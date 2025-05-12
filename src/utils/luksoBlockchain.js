import Web3 from 'web3';
import { ERC725 } from '@erc725/erc725.js';
import LSP0ABI from '@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json';
import { ethers } from 'ethers';
import { useUpProvider } from './upProviderContext';
import { 
  LUKSO_TESTNET_RPC, 
  ERC725Y_SCHEMA, 
  MICRO_BLOG_POSTS_KEY_NAME 
} from '../config/luksoConfig';

// Generate the data key for our micro-blog posts
const MICRO_BLOG_POSTS_KEY = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes(MICRO_BLOG_POSTS_KEY_NAME)
);

// Check for LUKSO Browser Extension
export const isLuksoExtensionAvailable = () => {
  // Check if window.lukso exists (direct access to LUKSO extension)
  if (window.lukso) {
    return true;
  }
  
  // Check if window.ethereum is the LUKSO extension
  if (window.ethereum && window.ethereum.isLukso) {
    return true;
  }
  
  // Check if LUKSO extension is in the list of providers
  if (window.ethereum && window.ethereum.providers) {
    return window.ethereum.providers.some(provider => provider.isLukso);
  }
  
  return false;
};

// Get the LUKSO provider
export const getLuksoProvider = () => {
  // Direct access via window.lukso
  if (window.lukso) {
    return window.lukso;
  }
  
  // If window.ethereum is the LUKSO extension
  if (window.ethereum && window.ethereum.isLukso) {
    return window.ethereum;
  }
  
  // Find LUKSO in the list of providers
  if (window.ethereum && window.ethereum.providers) {
    const luksoProvider = window.ethereum.providers.find(provider => provider.isLukso);
    if (luksoProvider) {
      return luksoProvider;
    }
  }
  
  // Fallback to window.ethereum (for development/testing)
  return window.ethereum;
};

// Initialize Web3 with LUKSO testnet
let web3;
if (isLuksoExtensionAvailable()) {
  web3 = new Web3(getLuksoProvider());
} else {
  web3 = new Web3(new Web3.providers.HttpProvider(LUKSO_TESTNET_RPC));
}

/**
 * Connect to the Universal Profile using UP Provider
 * @returns {Promise<string>} The connected Universal Profile address
 */
export const connectToLukso = async () => {
  // For backward compatibility, check if LUKSO extension is available
  if (!isLuksoExtensionAvailable()) {
    console.warn('LUKSO Browser Extension not found. Using UP Provider for The Grid.');
  }

  try {
    // Get the UP Provider instance from the React context
    // Note: This function should be called from within a component that uses the useUpProvider hook
    // For direct usage outside of React components, we'll fall back to the old method
    let account;
    
    // Check if we're in a Grid environment by checking for window.parent
    const isGridEnvironment = window.parent !== window;
    
    if (isGridEnvironment) {
      // We're in The Grid environment, use UP Provider
      // This will be handled by the component using the useUpProvider hook
      console.log('Detected Grid environment, using UP Provider');
      return null; // The actual connection will be handled by the component
    } else {
      // We're not in The Grid, fall back to LUKSO Browser Extension
      const provider = getLuksoProvider();
      
      // Request account access
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      
      // Check if we're on the LUKSO network
      const chainId = await provider.request({ method: 'eth_chainId' });
      if (chainId !== '0x1069') { // LUKSO Testnet Chain ID in hex
        try {
          // Switch to LUKSO Testnet
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1069' }], // LUKSO Testnet Chain ID
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to the LUKSO Browser Extension
          if (switchError.code === 4902) {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x1069',
                  chainName: 'LUKSO Testnet',
                  nativeCurrency: {
                    name: 'LYX',
                    symbol: 'LYX',
                    decimals: 18,
                  },
                  rpcUrls: [LUKSO_TESTNET_RPC],
                  blockExplorerUrls: ['https://explorer.testnet.lukso.network/'],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }
      
      account = accounts[0];
    }
    
    return account;
  } catch (error) {
    console.error('Error connecting to Universal Profile:', error);
    throw error;
  }
};

/**
 * Get an LSP0 ERC725Account contract instance
 * @param {string} address - The Universal Profile address
 * @returns {Object} The contract instance
 */
export const getLSP0Contract = (address) => {
  return new web3.eth.Contract(LSP0ABI.abi, address);
};

/**
 * Get an ERC725 instance for a Universal Profile
 * @param {string} address - The Universal Profile address
 * @returns {Object} The ERC725 instance
 */
export const getERC725Instance = (address) => {
  return new ERC725(
    ERC725Y_SCHEMA,
    address,
    web3.currentProvider,
    { ipfsGateway: 'https://api.universalprofile.cloud/ipfs' }
  );
};

/**
 * Store data on a Universal Profile using LSP0 ERC725Account
 * @param {string} address - The Universal Profile address
 * @param {string} data - The data to store (JSON string)
 * @returns {Promise<string>} The transaction hash
 */
export const storePostsOnUP = async (address, data) => {
  if (!address || !data) {
    throw new Error('Missing required parameters');
  }

  // For development/testing, use localStorage if LUKSO extension isn't available
  if (!isLuksoExtensionAvailable()) {
    console.warn('No LUKSO provider found. Using localStorage for development.');
    // Store in localStorage for development/testing
    localStorage.setItem(`lukso_microblog_${address}`, data);
    return 'mock_tx_hash_' + Date.now();
  }

  try {
    // Get the LSP0 contract
    const lsp0Contract = getLSP0Contract(address);
    
    // Convert data to bytes
    const dataBytes = ethers.utils.toUtf8Bytes(data);
    const dataHex = ethers.utils.hexlify(dataBytes);
    
    // Encode the setData call
    const setDataCall = lsp0Contract.methods.setData(
      MICRO_BLOG_POSTS_KEY,
      dataHex
    ).encodeABI();
    
    // Get the LUKSO provider
    const provider = getLuksoProvider();
    
    // Send the transaction using the LUKSO Browser Extension
    // The extension handles the special transaction format needed for Universal Profiles
    const txHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: address,
        to: address, // UP is both the sender and receiver
        data: setDataCall,
      }],
    });
    
    return txHash;
  } catch (error) {
    console.error('Error storing data on Universal Profile:', error);
    throw error;
  }
};

/**
 * Fetch data from a Universal Profile using LSP0 ERC725Account
 * @param {string} address - The Universal Profile address
 * @returns {Promise<Array>} The posts array
 */
export const fetchPostsFromUP = async (address) => {
  if (!address) {
    throw new Error('Missing required parameters');
  }

  try {
    // For development/testing, use mock data if LUKSO extension isn't available
    if (!isLuksoExtensionAvailable()) {
      console.warn('No LUKSO provider found. Using mock data for development.');
      const mockData = localStorage.getItem(`lukso_microblog_${address}`);
      if (mockData) {
        return JSON.parse(mockData);
      }
      return [];
    }

    // Get the LSP0 contract
    const lsp0Contract = getLSP0Contract(address);
    
    // Call getData function - this works the same with both providers
    const result = await lsp0Contract.methods.getData(MICRO_BLOG_POSTS_KEY).call();
    
    // If no data is found, return empty array
    if (!result || result === '0x' || result === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return [];
    }
    
    // Decode the bytes to a string
    const jsonString = ethers.utils.toUtf8String(result);
    
    // Parse the JSON string to get the posts array
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error fetching data from Universal Profile:', error);
    // If there's an error parsing (likely because no posts exist yet), return empty array
    return [];
  }
};
