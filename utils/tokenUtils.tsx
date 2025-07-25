import { Contract, ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../config/config';

export const fetchTokenInfo = async (
  provider: ethers.providers.Provider,
  walletAddress: string,
  setTokenInfo: (info: { balance: ethers.BigNumber; balanceFormatted: string; symbol: string; decimals: number }) => void
) => {
  try {
    if (!provider || !walletAddress) {
      throw new Error('Provider or wallet address is missing');
    }

    const tokenContract = new Contract(
      CONTRACT_ADDRESS,
      [
        'function balanceOf(address) view returns (uint256)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
      ],
      provider
    );

    const [balance, symbol, decimals] = await Promise.all([
      tokenContract.balanceOf(walletAddress),
      tokenContract.symbol(),
      tokenContract.decimals(),
    ]);

    const balanceFormatted = ethers.utils.formatUnits(balance, decimals);
    setTokenInfo({ balance, balanceFormatted, symbol, decimals });
  } catch (error) {
    console.error('fetchTokenInfo Error:', error);
    throw error; // Let the caller handle the error
  }
};