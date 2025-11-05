'use client';

import { useState, useEffect } from 'react';

// Ethereum Provider types (Ronin uses standard EIP-1193)
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on?: (event: string, callback: (...args: any[]) => void) => void;
  removeListener?: (event: string, callback: (...args: any[]) => void) => void;
  isRonin?: boolean;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ronin?: EthereumProvider;
    ethereum?: EthereumProvider;
  }
}

interface WalletState {
  address: string | null;
  chainId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  isInstalled: boolean;
  isMobile: boolean;
}

export function useRoninWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
    isInstalled: false,
    isMobile: false,
  });

  // Detect if user is on mobile
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Get the provider (Ronin Wallet or fallback to Ethereum)
  const getProvider = (): EthereumProvider | null => {
    if (typeof window === 'undefined') return null;
    
    // Check if window.ronin has a provider property (Ronin Wallet Chrome Extension structure)
    if ((window.ronin as any)?.provider?.request) {
      return (window.ronin as any).provider;
    }
    
    // Fallback to window.ronin direct (older versions)
    if (window.ronin?.request) {
      return window.ronin;
    }
    
    // Fallback to window.ethereum
    if (window.ethereum?.request) {
      return window.ethereum;
    }
    
    return null;
  };

  useEffect(() => {
    // Set mobile detection
    setWallet(prev => ({ ...prev, isMobile: isMobile() }));

    // Check for provider immediately
    const checkProvider = () => {
      const provider = getProvider();
      if (provider) {
        setWallet(prev => ({ ...prev, isInstalled: true }));
        checkConnection();
        setupEventListeners();
      }
    };

    // Check immediately
    checkProvider();

    // Also check after a delay (in case wallet extension loads slowly)
    const timer = setTimeout(checkProvider, 1000);

    return () => {
      clearTimeout(timer);
      // Cleanup event listeners
      const provider = getProvider();
      if (provider?.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged);
        provider.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      const provider = getProvider();
      if (!provider) return;

      const accounts = await provider.request({ 
        method: 'eth_accounts' 
      });

      const chainId = await provider.request({ 
        method: 'eth_chainId' 
      });

      if (accounts && accounts.length > 0) {
        setWallet(prev => ({
          ...prev,
          address: accounts[0],
          chainId,
          isConnected: true,
          isConnecting: false,
          error: null,
        }));
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // Disconnected
      setWallet(prev => ({
        ...prev,
        address: null,
        chainId: null,
        isConnected: false,
        isConnecting: false,
        error: null,
      }));
    } else {
      setWallet(prev => ({
        ...prev,
        address: accounts[0],
        isConnected: true,
      }));
    }
  };

  const handleChainChanged = (chainId: string) => {
    setWallet(prev => ({
      ...prev,
      chainId,
    }));
    // Reload page when chain changes
    window.location.reload();
  };

  const setupEventListeners = () => {
    const provider = getProvider();
    if (!provider?.on) return;

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
  };

  const connect = async () => {
    // If on mobile and no provider, open Ronin Wallet app via deep link
    if (isMobile() && !getProvider()) {
      const currentUrl = window.location.href;
      const dappUrl = encodeURIComponent(currentUrl);
      
      // Try to open Ronin Wallet mobile app
      const roninDeepLink = `roninwallet://dapp?url=${dappUrl}`;
      window.location.href = roninDeepLink;
      
      // Fallback: redirect to Ronin Wallet website after 2 seconds
      setTimeout(() => {
        setWallet(prev => ({
          ...prev,
          error: 'Please open this site in Ronin Wallet mobile app browser',
        }));
      }, 2000);
      
      return;
    }

    const provider = getProvider();
    if (!provider) {
      setWallet(prev => ({
        ...prev,
        error: 'Ronin Wallet not installed. Please install from https://wallet.roninchain.com/',
      }));
      return;
    }

    try {
      setWallet(prev => ({ ...prev, isConnecting: true, error: null }));

      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      const chainId = await provider.request({
        method: 'eth_chainId',
      });

      setWallet(prev => ({
        ...prev,
        address: accounts[0],
        chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
      }));
    } catch (error: any) {
      setWallet(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  };

  const disconnect = () => {
    setWallet(prev => ({
      ...prev,
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    }));
  };

  const switchToRonin = async () => {
    const provider = getProvider();
    if (!provider) return;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7E4' }], // 2020 in hex (Ronin Mainnet)
      });
    } catch (error: any) {
      // If chain doesn't exist, add it
      if (error.code === 4902) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x7E4',
            chainName: 'Ronin Mainnet',
            nativeCurrency: {
              name: 'RON',
              symbol: 'RON',
              decimals: 18,
            },
            rpcUrls: ['https://api.roninchain.com/rpc'],
            blockExplorerUrls: ['https://app.roninchain.com/'],
          }],
        });
      }
    }
  };

  const switchToSaigon = async () => {
    const provider = getProvider();
    if (!provider) return;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7E5' }], // 2021 in hex (Saigon Testnet)
      });
    } catch (error: any) {
      // If chain doesn't exist, add it
      if (error.code === 4902) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x7E5',
            chainName: 'Saigon Testnet',
            nativeCurrency: {
              name: 'RON',
              symbol: 'RON',
              decimals: 18,
            },
            rpcUrls: ['https://saigon-testnet.roninchain.com/rpc'],
            blockExplorerUrls: ['https://saigon-app.roninchain.com/'],
          }],
        });
      }
    }
  };

  return {
    address: wallet.address,
    chainId: wallet.chainId,
    isConnected: wallet.isConnected,
    isConnecting: wallet.isConnecting,
    error: wallet.error,
    isInstalled: wallet.isInstalled,
    isMobile: wallet.isMobile,
    connect,
    disconnect,
    switchToRonin,
    switchToSaigon,
  };
}
