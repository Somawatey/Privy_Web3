import { fetchTokenInfo } from '@/utils/tokenUtils';
import { handleSendToken } from '@/utils/transactionUtils';
import { Ionicons } from '@expo/vector-icons';
import { useLoginWithEmail, usePrivy } from '@privy-io/expo';
import axios from 'axios';
import type { BigNumber } from 'ethers';
import { ethers } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { BASE_SEPOLIA_CONFIG, CONTRACT_ADDRESS } from '../config/config';
import LoadingOrRetry from './LoadingOrRetry';
import ReceiveModal from './ReceiveModal';
import ScanModal from './ScanModal';
import SendModal from './SendModal';

const CELL_COUNT = 6;
const { width } = Dimensions.get('window');

// Compact ActionButton with minimal spacing
const ActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.actionIconContainer}>
      <Ionicons name={icon} size={18} color="#FFFFFF" />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

// Streamlined TransactionItem
const TransactionItem = ({ item, isLast }) => (
  <View style={[styles.transactionItem, isLast && styles.transactionItemLast]}>
    <View style={styles.transactionIconContainer}>
      <Ionicons
        name={item.from?.toLowerCase() === item.to?.toLowerCase() ? "swap-horizontal" : "arrow-forward"}
        size={16}
        color="#6366F1"
      />
    </View>
    <View style={styles.transactionDetails}>
      <Text style={styles.transactionName}>{item.asset || 'Token Transfer'}</Text>
      <Text style={styles.transactionDate}>
        {new Date(item.metadata.blockTimestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>
    </View>
    <Text style={styles.transactionAmount}>
      {parseFloat(item.value).toFixed(2)}
    </Text>
  </View>
);

export default function LoginWithEmail() {
  const { user, logout } = usePrivy();
  const { sendCode, loginWithCode } = useLoginWithEmail();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  type WalletType = { address: string } | null;
  type ProviderType = ethers.providers.JsonRpcProvider | null;
  type TokenInfoType = {
    balance: BigNumber;
    balanceFormatted: string;
    symbol: string;
    decimals: number;
    address?: string;
  } | null;
  type TransactionType = {
    hash: string;
    from: string;
    to: string;
    asset?: string;
    value: string;
    metadata: { blockTimestamp: string };
    uniqueId?: string;
  };

  const [wallet, setWallet] = useState<WalletType>(null);
  const [provider, setProvider] = useState<ProviderType>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfoType>(null);
  const [ethBalance, setEthBalance] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  const [showSendModal, setShowSendModal] = useState<boolean>(false);
  const [showReceiveModal, setShowReceiveModal] = useState<boolean>(false);
  const [showScanModal, setShowScanModal] = useState<boolean>(false);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  // ...existing code...
  const walletAddress = user?.linked_accounts?.find(acc => acc.type === 'wallet')?.address || '';
  const router = useRouter();

  // Initialize wallet and provider
  useEffect(() => {
    if (user && walletAddress) {
      setWallet({ address: walletAddress });
      const rpcProvider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA_CONFIG.rpcUrl);
      setProvider(rpcProvider);
    }
  }, [user, walletAddress]);

  // Fetch token info and ETH balance
  const fetchAllData = useCallback(async () => {
    if (!provider || !walletAddress) {
      console.log('Provider or walletAddress missing');
      Alert.alert('Error', 'Wallet or provider not initialized');
      return;
    }
    setIsLoading(true);
    try {
      await Promise.all([
        fetchTokenInfo(provider, walletAddress, (info) => setTokenInfo(info)),
        // Fetch ETH balance
        provider.getBalance(walletAddress).then((balance: BigNumber) => {
          const formattedBalance = ethers.utils.formatEther(balance);
          setEthBalance(parseFloat(formattedBalance).toFixed(4));
        }),
      ]);
    } catch (error) {
      console.error('fetchAllData Error:', error);
      Alert.alert('Error', 'Failed to fetch wallet data');
    } finally {
      setIsLoading(false);
    }
  }, [provider, walletAddress]);

  const reloadAll = () => {
    fetchAllData();
    fetchTransactionHistory();
  };

  // Handle scanned QR code data
  const handleScan = (data: string) => {
    setRecipientAddress(data); // Set the scanned address as recipient
    setShowSendModal(true); // Open SendModal with the scanned address
  };

  // Fetch transaction history
  const fetchTransactionHistory = useCallback(async () => {
    if (!wallet?.address) return;
    setLoadingTransactions(true);
    const timeoutMs = 10000;
    let timeoutHandle: NodeJS.Timeout | null = null;
    try {
      const rpcUrl = BASE_SEPOLIA_CONFIG.rpcUrl;
      const contractAddress = CONTRACT_ADDRESS;
      const baseParams = {
        fromBlock: '0x0',
        toBlock: 'latest',
        contractAddresses: contractAddress ? [contractAddress] : [],
        withMetadata: true,
        excludeZeroValue: true,
        maxCount: '0x5',
        category: ['erc20'],
      };
      const fetchPromise = Promise.all([
        axios.post(rpcUrl, {
          id: 1,
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [{ ...baseParams, toAddress: wallet.address }],
        }),
        axios.post(rpcUrl, {
          id: 2,
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [{ ...baseParams, fromAddress: wallet.address }],
        }),
      ]);
      const timeoutPromise = new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
      });
      const result = await Promise.race([fetchPromise, timeoutPromise]);
      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (!Array.isArray(result)) throw new Error('Transaction fetch failed');
      const [inRes, outRes] = result as any[];
      const inTransfers = inRes?.data?.result?.transfers || [];
      const outTransfers = outRes?.data?.result?.transfers || [];
      const allTransfers = [...inTransfers, ...outTransfers].filter(
        (v: TransactionType, i: number, a: TransactionType[]) => a.findIndex(t => t.hash === v.hash) === i
      );
      const sortedTransactions = allTransfers.sort((a: TransactionType, b: TransactionType) =>
        new Date(b.metadata.blockTimestamp).getTime() - new Date(a.metadata.blockTimestamp).getTime()
      );
      sortedTransactions.forEach((tx: TransactionType, idx: number) => {
        tx.uniqueId = tx.hash + idx;
      });
      setTransactions(sortedTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', error?.message || 'Failed to load transaction history');
    } finally {
      setLoadingTransactions(false);
    }
  }, [wallet?.address]);

  // Fetch data when wallet and provider are ready
  useEffect(() => {
    if (walletAddress && provider) {
      fetchAllData();
      fetchTransactionHistory();
    }
  }, [walletAddress, provider, fetchAllData, fetchTransactionHistory]);

  const shortenAddress = () => {
    if (!walletAddress || walletAddress.length < 12) return walletAddress;
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'Wallet address copied to clipboard.');
  };

  const handleSendCode = async () => {
    if (!email) return Alert.alert('Validation', 'Please enter your email.');
    try {
      await sendCode({ email });
      setStep(2);
    } catch {
      Alert.alert('Error', 'Failed to send code.');
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return Alert.alert('Validation', 'Please enter the code.');
    try {
      await loginWithCode({ email, code });
      router.replace('/');
    } catch {
      Alert.alert('Login Failed', 'Invalid code.');
    }
  };

  const handleLogout = async () => {
    await logout();
    console.log('Logged out');
    setStep(1);
    setWallet(null);
    setProvider(null);
    setTokenInfo(null);
    setEthBalance('');
    setTransactions([]);
  };

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value: code, setValue: setCode });

  if (!user) {
    return (
      <View style={styles.authContainer}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardContainer}>
          {step === 1 && (
            <View style={styles.card}>
              <View style={styles.authHeader}>
                <View style={styles.authIconContainer}>
                  <Ionicons name="wallet-outline" size={28} color="#6366F1" />
                </View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to access your wallet</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <Pressable style={styles.primaryButton} onPress={handleSendCode}>
                <Text style={styles.buttonText}>Continue</Text>
              </Pressable>
            </View>
          )}

          {step === 2 && (
            <View style={styles.card}>
              <View style={styles.authHeader}>
                <View style={styles.authIconContainer}>
                  <Ionicons name="mail-outline" size={28} color="#6366F1" />
                </View>
                <Text style={styles.title}>Check Your Email</Text>
                <Text style={styles.subtitle}>We sent a 6-digit code to {email}</Text>
              </View>

              <View style={styles.codeContainer}>
                <Text style={styles.inputLabel}>Verification Code</Text>
                <CodeField
                  ref={ref}
                  {...props}
                  value={code}
                  onChangeText={setCode}
                  cellCount={CELL_COUNT}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={({ index, symbol, isFocused }) => (
                    <View
                      key={index}
                      style={[styles.cell, isFocused && styles.focusCell]}
                      onLayout={getCellOnLayoutHandler(index)}
                    >
                      <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
                    </View>
                  )}
                />
              </View>

              <Pressable style={styles.primaryButton} onPress={handleVerifyCode}>
                <Text style={styles.buttonText}>Verify Code</Text>
              </Pressable>

              <Pressable onPress={handleSendCode} style={styles.resendButton}>
                <Text style={styles.resendText}>Didn't receive code? Resend</Text>
              </Pressable>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading wallet data...</Text>
        </View>
      ) : (
        <>
          {/* Ultra-Compact Balance Card */}
          <View style={styles.balanceCard}>
            <LoadingOrRetry
              isLoading={loadingTransactions}
              onRetry={reloadAll}
            />

            {/* Minimized Header Section */}
            <View style={styles.compactHeader}>
              <View style={styles.addressSection}>
                <Text style={styles.addressLabel}>WALLET</Text>
                <Pressable
                  onPress={() => copyToClipboard(walletAddress)}
                  style={styles.addressContainer}
                  activeOpacity={0.7}
                >
                  <Text style={styles.addressText}>{shortenAddress()}</Text>
                  <Ionicons name="copy-outline" size={12} color="#B8B5FF" style={styles.copyIcon} />
                </Pressable>
              </View>

              <View style={styles.balanceSection}>
                {tokenInfo ? (
                  <Text style={styles.balanceAmount}>
                    {parseFloat(tokenInfo.balanceFormatted).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2
                    })}
                    <Text style={styles.balanceSymbol}> {tokenInfo.symbol}</Text>
                  </Text>
                ) : (
                  <Text style={styles.balanceError}>Unable to load</Text>
                )}

                <Text style={styles.ethBalanceText}>{ethBalance} ETH</Text>
              </View>
            </View>

            {/* Compact Action Buttons */}
            <View style={styles.actions}>
              <ActionButton
                icon="arrow-up-outline"
                label="Send"
                onPress={() => setShowSendModal(true)}
              />
              <ActionButton
                icon="arrow-down-outline"
                label="Receive"
                onPress={() => setShowReceiveModal(true)}
              />
              <ActionButton
                icon="scan-outline"
                label="Scan"
                onPress={() => setShowScanModal(true)}
              />
            </View>
          </View>

          {/* Streamlined Transactions Section */}
          <View style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Activity</Text>
              {transactions.length > 0 && (
                <Text style={styles.transactionCount}>{transactions.length}</Text>
              )}
            </View>

            {loadingTransactions ? (
              <View style={styles.loadingTransactions}>
                <ActivityIndicator size="small" color="#6366F1" />
              </View>
            ) : transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={32} color="#9CA3AF" />
                <Text style={styles.emptyStateTitle}>No transactions yet</Text>
                <Text style={styles.emptyStateText}>Your history will appear here</Text>
              </View>
            ) : (
              <FlatList
                data={transactions}
                keyExtractor={item => item.uniqueId}
                renderItem={({ item, index }) => (
                  <TransactionItem item={item} isLast={index === transactions.length - 1} />
                )}
                showsVerticalScrollIndicator={false}
                style={styles.transactionsList}
              />
            )}
          </View>

          {/* Modals */}
          <SendModal
            visible={showSendModal}
            onClose={() => {
              setShowSendModal(false);
              setRecipientAddress('');
              setTransferAmount('');
            }}
            tokenInfo={tokenInfo || { symbol: 'KST', balanceFormatted: '0.00' }}
            recipientAddress={recipientAddress}
            setRecipientAddress={setRecipientAddress}
            transferAmount={transferAmount}
            setTransferAmount={setTransferAmount}
            onSend={() =>
              handleSendToken(
                wallet,
                tokenInfo,
                recipientAddress,
                transferAmount,
                ethBalance,
                setIsTransferring,
                fetchAllData,
                setShowSendModal,
                setRecipientAddress,
                setTransferAmount
              )
            }
            isTransferring={isTransferring}
          />

          <ReceiveModal
            visible={showReceiveModal}
            onClose={() => setShowReceiveModal(false)}
            walletAddress={walletAddress}
            onCopy={() => copyToClipboard(walletAddress)}
            tokenSymbol={tokenInfo?.symbol || 'USD'}
          />
          <ScanModal
            visible={showScanModal}
            onClose={() => setShowScanModal(false)}
            onScan={handleScan}
          />

          {/* Compact Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={16} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Auth Container Styles
  authContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    padding: 16,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  authIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  // Main Container - Reduced padding
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 12,
  },

  // Card Styles - Reduced padding
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  // Typography - Slightly smaller
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 22,
  },

  // Input Styles - Reduced margins
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    color: '#1F2937',
  },

  // Button Styles - Reduced margins
  primaryButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  resendButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  resendText: {
    color: '#6366F1',
    fontWeight: '500',
    fontSize: 14,
  },

  // Code Field Styles - Slightly smaller
  codeContainer: {
    marginBottom: 24,
  },
  codeFieldRoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    width: 44,
    height: 52,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 20,
    color: '#1F2937',
    fontWeight: '600',
  },
  focusCell: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },

  // Loading States - Reduced padding
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  loadingTransactions: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  // Ultra-Compact Balance Card
  balanceCard: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  // Minimized Header
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  // Streamlined Address Section
  addressSection: {
    flex: 1,
  },
  addressLabel: {
    color: '#B8B5FF',
    fontSize: 9,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  addressText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  copyIcon: {
    marginLeft: 4,
  },

  // Compact Balance Section
  balanceSection: {
    alignItems: 'flex-end',
    flex: 1,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 2,
  },
  balanceSymbol: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  balanceError: {
    color: '#FCA5A5',
    fontSize: 12,
    fontStyle: 'italic',
  },
  ethBalanceText: {
    color: '#E0E7FF',
    fontSize: 11,
    fontWeight: '500',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  // Compact Action Buttons
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },

  // Streamlined Transactions Section
  transactionsSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  transactionCount: {
    fontSize: 11,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    minWidth: 20,
    textAlign: 'center',
  },

  // Compact Transaction Items
  transactionsList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionItemLast: {
    borderBottomWidth: 0,
  },
  transactionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 1,
  },
  transactionDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },

  // Compact Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Compact Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
});