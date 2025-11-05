'use client';

import { useState, useEffect } from 'react';

// Ronin Wallet types
interface RoninProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  isRonin?: boolean;
}

declare global {
  interface Window {
    ronin?: RoninProvider;
  }
}

interface WalletState {
  address: string | null;
  chainId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useRoninWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  useEffect(() => {
    // Check if Ronin Wallet is installed
    if (typeof window !== 'undefined' && window.ronin) {
      checkConnection();
      setupEventListeners();
    }

    return () => {
      // Cleanup event listeners
      if (window.ronin) {
        window.ronin.removeListener('accountsChanged', handleAccountsChanged);
        window.ronin.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (!window.ronin) return;

      const accounts = await window.ronin.request({ 
        method: 'eth_accounts' 
      });

      const chainId = await window.ronin.request({ 
        method: 'eth_chainId' 
      });

      if (accounts && accounts.length > 0) {
        setWallet({
          address: accounts[0],
          chainId,
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // Disconnected
      setWallet({
        address: null,
        chainId: null,
        isConnected: false,
        isConnecting: false,
        error: null,
      });
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
    if (!window.ronin) return;

    window.ronin.on('accountsChanged', handleAccountsChanged);
    window.ronin.on('chainChanged', handleChainChanged);
  };

  const connect = async () => {
    if (!window.ronin) {
      setWallet(prev => ({
        ...prev,
        error: 'Ronin Wallet not installed. Please install from https://wallet.roninchain.com/',
      }));
      return;
    }

    try {
      setWallet(prev => ({ ...prev, isConnecting: true, error: null }));

      const accounts = await window.ronin.request({
        method: 'eth_requestAccounts',
      });

      const chainId = await window.ronin.request({
        method: 'eth_chainId',
      });

      setWallet({
        address: accounts[0],
        chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
      });
    } catch (error: any) {
      setWallet(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  };

  const disconnect = () => {
    setWallet({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  };

  const switchToRonin = async () => {
    if (!window.ronin) return;

    try {
      await window.ronin.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7E4' }], // 2020 in hex (Ronin Mainnet)
      });
    } catch (error: any) {
      // If chain doesn't exist, add it
      if (error.code === 4902) {
        await window.ronin.request({
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
    if (!window.ronin) return;

    try {
      await window.ronin.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7E5' }], // 2021 in hex (Saigon Testnet)
      });
    } catch (error: any) {
      // If chain doesn't exist, add it
      if (error.code === 4902) {
        await window.ronin.request({
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
    ...wallet,
    connect,
    disconnect,
    switchToRonin,
    switchToSaigon,
    isInstalled: typeof window !== 'undefined' && !!window.ronin,
  };
}
