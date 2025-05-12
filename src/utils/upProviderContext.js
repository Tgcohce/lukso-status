import React, { createContext, useContext, useState, useEffect } from 'react';
import { LUKSO_TESTNET_RPC } from '../config/luksoConfig';

// Create a context for the UP Provider
const UpProviderContext = createContext(null);

// This is a simplified implementation that works with The Grid requirements
export const UpProviderProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isGridEnvironment, setIsGridEnvironment] = useState(false);

  // Check if we're in The Grid environment on component mount
  useEffect(() => {
    // A simple way to detect if we're in an iframe (The Grid uses iframes)
    const isGrid = window.parent !== window;
    setIsGridEnvironment(isGrid);

    // Auto-connect if we're in The Grid environment
    if (isGrid) {
      // For now, we'll just check for messages from the parent frame
      // In a real Grid implementation, this would use the proper messaging protocol
      window.addEventListener('message', (event) => {
        // Check if the message is from The Grid
        if (event.data && event.data.type === 'UP_CONNECTED' && event.data.address) {
          setAccount(event.data.address);
        }
      });
    }
  }, []);

  // Connect function - uses the LUKSO Browser Extension
  const connect = async () => {
    setIsConnecting(true);
    
    try {
      // Check if we're in The Grid environment
      if (isGridEnvironment) {
        console.log('Grid environment detected, waiting for UP connection message...');
        // In Grid environment, connection is handled by the parent frame
        // We'll just wait for the message event to set the account
        return null;
      }
      
      // Check if LUKSO Browser Extension is available
      if (!window.ethereum && !window.lukso) {
        console.error('No Ethereum provider found');
        throw new Error('LUKSO Browser Extension not found. Please install it to connect your Universal Profile.');
      }
      
      // Get the provider from the LUKSO Browser Extension
      // First try window.lukso, then try to find LUKSO provider in window.ethereum.providers
      let provider;
      
      if (window.lukso) {
        provider = window.lukso;
        console.log('Using window.lukso provider');
      } else if (window.ethereum) {
        if (window.ethereum.isLukso) {
          provider = window.ethereum;
          console.log('Using window.ethereum provider (isLukso)');
        } else if (window.ethereum.providers) {
          const luksoProvider = window.ethereum.providers.find(p => p.isLukso);
          if (luksoProvider) {
            provider = luksoProvider;
            console.log('Using LUKSO provider from window.ethereum.providers');
          } else {
            // Fallback to window.ethereum
            provider = window.ethereum;
            console.log('Falling back to window.ethereum provider');
          }
        } else {
          // Fallback to window.ethereum
          provider = window.ethereum;
          console.log('Falling back to window.ethereum provider');
        }
      }
      
      console.log('Requesting accounts from LUKSO Browser Extension...');
      
      // Request accounts
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      console.log('Accounts received:', accounts);
      
      // Check if we're on the LUKSO testnet
      const chainId = await provider.request({ method: 'eth_chainId' });
      console.log('Current chainId:', chainId);
      
      // If not on LUKSO testnet, try to switch
      if (chainId !== '0x1069') { // LUKSO Testnet Chain ID in hex
        try {
          console.log('Switching to LUKSO Testnet...');
          // Switch to LUKSO Testnet
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1069' }], // LUKSO Testnet Chain ID
          });
        } catch (switchError) {
          console.error('Error switching chain:', switchError);
          // This error code indicates that the chain has not been added to the extension
          if (switchError.code === 4902) {
            console.log('Adding LUKSO Testnet to wallet...');
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
                  rpcUrls: ['https://rpc.testnet.lukso.network'],
                  blockExplorerUrls: ['https://explorer.testnet.lukso.network'],
                },
              ],
            });
          }
        }
      }
      
      // Set the account
      if (accounts && accounts.length > 0) {
        console.log('Setting account:', accounts[0]);
        setAccount(accounts[0]);
        return accounts[0];
      } else {
        throw new Error('No accounts found');
      }
    } catch (error) {
      console.error('Error connecting to Universal Profile:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect function
  const disconnect = async () => {
    setAccount(null);
  };

  // Send transaction function - uses the LUKSO Browser Extension
  const sendTransaction = async ({ to, data }) => {
    if (!account) {
      throw new Error('Not connected to a Universal Profile');
    }
    
    try {
      // Get the provider from the LUKSO Browser Extension using the same logic as in connect
      let provider;
      
      if (window.lukso) {
        provider = window.lukso;
      } else if (window.ethereum) {
        if (window.ethereum.isLukso) {
          provider = window.ethereum;
        } else if (window.ethereum.providers) {
          const luksoProvider = window.ethereum.providers.find(p => p.isLukso);
          if (luksoProvider) {
            provider = luksoProvider;
          } else {
            provider = window.ethereum;
          }
        } else {
          provider = window.ethereum;
        }
      }
      
      if (!provider) {
        throw new Error('No provider available');
      }
      
      console.log('Sending transaction via provider:', { from: account, to, data });
      
      // Send the transaction
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: to,
          data: data
        }]
      });
      
      console.log('Transaction sent, hash:', txHash);
      return { hash: txHash };
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  };

  // Value to be provided by the context
  const value = {
    account,
    connect,
    disconnect,
    isConnecting,
    sendTransaction,
    isGridEnvironment
  };

  return (
    <UpProviderContext.Provider value={value}>
      {children}
    </UpProviderContext.Provider>
  );
};

// Custom hook to use the UP Provider context
export const useUpProvider = () => {
  const context = useContext(UpProviderContext);
  if (!context) {
    throw new Error('useUpProvider must be used within an UpProviderProvider');
  }
  return context;
};
