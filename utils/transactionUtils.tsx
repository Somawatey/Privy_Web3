import {
    BASE_SEPOLIA_CONFIG,
    CHAIN_ID,
    CONTRACT_ABI,
    CONTRACT_ADDRESS,
} from "@/config/config";
import { TokenInfo } from "@/types/TokenInfo";
import { Buffer } from "buffer";
import { ethers } from "ethers";
import { Alert } from "react-native";
global.Buffer = Buffer;


export const validateTransferInputs = async (
  recipientAddress: string,
  transferAmount: string,
  tokenInfo: TokenInfo | null,
  ethBalance: string
): Promise<boolean> => {
  if (!recipientAddress.trim()) {
    Alert.alert("Error", "Please enter a recipient address");
    return false;
  }

  if (!ethers.utils.isAddress(recipientAddress.trim())) {
    Alert.alert("Error", "Invalid recipient address");
    return false;
  }

  if (!transferAmount.trim()) {
    Alert.alert("Error", "Please enter a transfer amount");
    return false;
  }

  const sanitizedAmount = transferAmount.trim().replace(/,/g, "");
  const numericAmount = Number(sanitizedAmount);

  if (isNaN(numericAmount) || !isFinite(numericAmount) || numericAmount <= 0) {
    Alert.alert("Error", "Please enter a valid positive number");
    return false;
  }

  if (tokenInfo && sanitizedAmount.includes(".")) {
    const decimalPlaces = sanitizedAmount.split(".")[1].length;
    if (decimalPlaces > tokenInfo.decimals) {
      Alert.alert(
        "Error",
        `Maximum ${tokenInfo.decimals} decimal places allowed`
      );
      return false;
    }
  }

  if (!tokenInfo) {
    Alert.alert("Error", "Token information not loaded");
    return false;
  }

  if (numericAmount > parseFloat(tokenInfo.balance)) {
    Alert.alert(
      "Error",
      `Insufficient balance. Available: ${tokenInfo.balanceFormatted} ${tokenInfo.symbol}`
    );
    return false;
  }

  const ethBalanceNum = parseFloat(ethBalance);
  console.log("Validating Sepolia ETH balance:", ethBalanceNum);
  if (ethBalanceNum === 0) {
    Alert.alert(
      "Insufficient Gas Funds",
      "You need ETH to pay for transaction gas fees on Base Sepolia. Your ETH balance is 0.\n\nPlease add ETH to your wallet first.",
      [
        { text: "OK" },
        {
          text: "Get ETH",
          onPress: () => {
            console.log("Direct user to get Sepolia ETH");
          },
        },
      ]
    );
    return false;
  }

  const minimumEthNeeded = 0.001;
  if (ethBalanceNum < minimumEthNeeded) {
    Alert.alert(
      "Low ETH Balance",
      `You may not have enough ETH for gas fees.\n\nCurrent: ${ethBalance} ETH\nRecommended: At least ${minimumEthNeeded} ETH\n\nDo you want to continue anyway?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => {} },
      ]
    );
    return true;
  }

  return true;
};

export const handleSendToken = async (
  wallet: any,
  tokenInfo: TokenInfo | null,
  recipientAddress: string,
  transferAmount: string,
  ethBalance: string,
  setIsTransferring: (isTransferring: boolean) => void,
  fetchAllData: () => Promise<void>,
  setShowSendModal: (show: boolean) => void,
  setRecipientAddress: (address: string) => void,
  setTransferAmount: (amount: string) => void
) => {
  const isValid = await validateTransferInputs(
    recipientAddress,
    transferAmount,
    tokenInfo,
    ethBalance
  );
  if (!isValid || !wallet || !tokenInfo) return;

  try {
    setIsTransferring(true);

    const sanitizedAmount = transferAmount.trim().replace(/,/g, "");
    console.log("Sanitized amount:", sanitizedAmount);

    if (!sanitizedAmount || isNaN(Number(sanitizedAmount))) {
      throw new Error("Invalid transfer amount format");
    }

    const embeddedProvider = await wallet.getProvider();
    const ethersProvider = new ethers.providers.Web3Provider(embeddedProvider);
    const currentNetwork = await ethersProvider.getNetwork();

    console.log(
      "Transaction network check:",
      currentNetwork.chainId,
      "Expected:",
      BASE_SEPOLIA_CONFIG.chainId
    );

    let transactionProvider = ethersProvider;
    let useDirectProvider = false;

    if (currentNetwork.chainId !== BASE_SEPOLIA_CONFIG.chainId) {
      console.log("Not on Base Sepolia, attempting final switch...");

      try {
        await embeddedProvider.request({
          method: "wallet_switchEthereumChain",
          params: [
            { chainId: `0x${BASE_SEPOLIA_CONFIG.chainId.toString(16)}` },
          ],
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));
        const switchedNetwork = await ethersProvider.getNetwork();

        if (switchedNetwork.chainId !== BASE_SEPOLIA_CONFIG.chainId) {
          console.log("Switch failed, will use hybrid approach");
          useDirectProvider = true;
        } else {
          console.log("Switch successful, proceeding normally");
        }
      } catch (switchError) {
        console.log("Final switch failed, using hybrid approach:", switchError);
        useDirectProvider = true;
      }
    }

    if (useDirectProvider) {
      console.log("Using hybrid provider approach");

      const baseProvider = new ethers.providers.JsonRpcProvider(
        BASE_SEPOLIA_CONFIG.rpcUrl
      );
      const baseBalance = await baseProvider.getBalance(wallet.address);
      const baseBalanceFormatted = ethers.utils.formatEther(baseBalance);

      console.log("Base Sepolia ETH balance (hybrid):", baseBalanceFormatted);

      if (parseFloat(baseBalanceFormatted) < 0.001) {
        throw new Error(
          `Insufficient ETH on Base Sepolia. Balance: ${baseBalanceFormatted} ETH`
        );
      }
    }

    const accounts = await embeddedProvider.request({
      method: "eth_requestAccounts",
    });

    const gasProvider = useDirectProvider
      ? new ethers.providers.JsonRpcProvider(BASE_SEPOLIA_CONFIG.rpcUrl)
      : ethersProvider;

    const decimals = tokenInfo.decimals || 18;
    const amountWei = ethers.utils.parseUnits(sanitizedAmount, decimals);

    const tokenContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      gasProvider
    );

    const data = tokenContract.interface.encodeFunctionData("transfer", [
      recipientAddress.trim(),
      amountWei,
    ]);

    const gasPrice = await gasProvider.getGasPrice();
    console.log(
      "Gas price:",
      ethers.utils.formatUnits(gasPrice, "gwei"),
      "gwei"
    );

    let gasEstimate;
    try {
      gasEstimate = await gasProvider.estimateGas({
        from: accounts[0],
        to: CONTRACT_ADDRESS,
        data,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(
        "Failed to estimate gas. Please check your ETH balance and network."
      );
    }

    const gasLimit = gasEstimate.mul(130).div(100);
    console.log("Gas estimate:", gasEstimate.toString());
    console.log("Gas limit:", gasLimit.toString());

    const totalCost = gasLimit.mul(gasPrice);
    const totalCostInEth = ethers.utils.formatEther(totalCost);
    console.log("Transaction cost:", totalCostInEth, "ETH");

    if (parseFloat(totalCostInEth) > parseFloat(ethBalance)) {
      throw new Error(
        `Insufficient ETH for gas. Required: ${totalCostInEth} ETH, Available: ${ethBalance} ETH`
      );
    }

    const txParams: {
      from: any;
      to: string;
      data: string;
      gas: string;
      gasPrice: string;
      chainId?: number;
    } = {
      from: accounts[0],
      to: CONTRACT_ADDRESS,
      data,
      gas: `0x${gasLimit.toHexString().replace("0x", "")}`,
      gasPrice: `0x${gasPrice.toHexString().replace("0x", "")}`,
    };

    if (useDirectProvider) {
      txParams.chainId = CHAIN_ID;
    }

    console.log("Sending transaction with params:", txParams);

    const txHash = await embeddedProvider.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });
    console.log("Transaction sent:", txHash);

    try {
      const confirmationProvider = useDirectProvider
        ? new ethers.providers.JsonRpcProvider(BASE_SEPOLIA_CONFIG.rpcUrl)
        : ethersProvider;

      const receipt = await confirmationProvider.waitForTransaction(
        txHash,
        1,
        300000
      );
      if (receipt && receipt.status === 1) {
        Alert.alert("Success", "Transaction confirmed on Base Sepolia!");
        await fetchAllData();
        setShowSendModal(false);
        setRecipientAddress("");
        setTransferAmount("");
      } else {
        Alert.alert("Error", "Transaction failed or was reverted");
      }
    } catch (receiptError) {
      console.warn("Could not verify receipt:", receiptError);
      Alert.alert(
        "Transaction Sent",
        "Transaction sent but confirmation could not be verified."
      );
    }
  } catch (error: any) {
    console.error("Transfer error:", error);
    let errorMessage = "Transfer failed. Please try again.";

    if (error.message?.includes("Insufficient ETH")) {
      errorMessage = error.message;
    } else if (error.code === "ACTION_REJECTED") {
      errorMessage = "Transaction was rejected";
    } else if (error.message?.includes("network")) {
      errorMessage =
        error.message +
        "\n\nTry manually switching to Base Sepolia network in your wallet.";
    } else if (error.message?.includes("gas")) {
      errorMessage = error.message;
    }

    Alert.alert("Transfer Error", errorMessage);
  } finally {
    setIsTransferring(false);
  }
};

export const handleGetEth = () => {
  Alert.alert(
    "Get ETH for Gas Fees",
    "You need ETH to pay for transaction fees on Base Sepolia. Here are some options:",
    [
      {
        text: "Base Sepolia Faucet",
        onPress: () => {
          console.log("Direct to: https://faucet.base.org/");
        },
      },
      {
        text: "Alchemy Faucet",
        onPress: () => {
          console.log("Direct to: https://basesepoliafaucet.com/");
        },
      },
      {
        text: "Bridge from Ethereum",
        onPress: () => {
          console.log("Direct to: https://bridge.base.org/");
        },
      },
      { text: "Cancel", style: "cancel" },
    ]
  );
};
