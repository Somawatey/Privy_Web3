
import JSONABI from './contracts/base_abi.json';

// Define constants before using them in config object
export const CHAIN_ID = 84532; // base Sepolia chain ID
export const NETWORK_NAME = 'Base Sepolia';
export const BASE_SEPOLIA_RPC_URLS = [
  'https://base-sepolia.g.alchemy.com/v2/nHrvTEBBQEqzkSvlIBpNW', // Replace with your actual Alchemy API key
  'https://sepolia.base.org',
];
export const PROVIDER_URL = BASE_SEPOLIA_RPC_URLS[0];
export const BLOCK_EXPLORER_URL = 'https://base-sepolia.blockscout.com/';

// Base Sepolia Network Configuration
export const CONTRACT_ADDRESS = '0x7409226573165cD329f493Bf69985342477Da3d0'; // Your deployed contract ETH Sepolia contract
export const CONTRACT_ABI = JSONABI;

export const BASE_SEPOLIA_CONFIG = {
  chainId: CHAIN_ID,
  name: NETWORK_NAME,
  rpcUrl: PROVIDER_URL,
  explorerUrl: BLOCK_EXPLORER_URL,
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
};