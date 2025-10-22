import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  switchNetwork: () => Promise<void>;
  currentNetwork: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);

  // Function to get network name
  const getNetworkName = (chainId: string) => {
    const networks: Record<string, string> = {
      '1': 'Ethereum Mainnet',
      '11155111': 'Sepolia Testnet',  // This matches your config
      '5': 'Goerli Testnet',
      '137': 'Polygon Mainnet',
      '80001': 'Polygon Mumbai'
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  const connectWallet = async () => {
    setError(null);
    setIsConnecting(true);
    
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask!');
      setIsConnecting(false);
      return;
    }

    try {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await newProvider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        const newSigner = await newProvider.getSigner();
        const newAccount = await newSigner.getAddress();
        
        // Get network info
        const network = await newProvider.getNetwork();
        const chainId = network.chainId.toString();
        
        setProvider(newProvider);
        setSigner(newSigner);
        setAccount(newAccount);
        setCurrentNetwork(getNetworkName(chainId));
      }
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      if (err.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setError(null);
    setCurrentNetwork(null);
  };

  const isConnected = !!account;

  // Function to switch network to the configured one
  const switchNetwork = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask!');
      return;
    }

    const chainId = import.meta.env.VITE_CHAIN_ID || '11155111'; // Default to Sepolia
    const chainIdHex = '0x' + parseInt(chainId).toString(16);

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      
      // Update network info after switching
      if (provider) {
        const network = await provider.getNetwork();
        const currentChainId = network.chainId.toString();
        setCurrentNetwork(getNetworkName(currentChainId));
      }
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Network not added, try to add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName: getNetworkName(chainId),
                rpcUrls: [import.meta.env.VITE_RPC_URL] || ['https://sepolia.infura.io/v3/'],
                nativeCurrency: {
                  name: 'Sepolia Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          setError('Failed to add network. Please try again.');
        }
      } else {
        console.error('Error switching network:', switchError);
        setError('Failed to switch network. Please try again.');
      }
    }
  };

  useEffect(() => {
    // Listen for account changes
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        // Refresh the page when network changes to ensure everything is properly updated
        window.location.reload();
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      // Check current network on component mount
      const checkNetwork = async () => {
        if (ethereum && ethereum.chainId) {
          const currentChainId = parseInt(ethereum.chainId).toString();
          setCurrentNetwork(getNetworkName(currentChainId));
        }
      };
      checkNetwork();

      return () => {
        if (ethereum) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  const contextValue: Web3ContextType = {
    account,
    provider,
    signer,
    connectWallet,
    disconnect,
    isConnected,
    isConnecting,
    error,
    switchNetwork,
    currentNetwork
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};