'use client';

import { useState, useEffect } from 'react';

interface WalletState {
  address: string | null;
  chainId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

// Extend window to include ronin provider
declare global {
  interface Window {
    ronin?: any;
  }
}

export function useWaypoint() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  useEffect(() => {
    // Check if already connected on mount
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window === 'undefined' || !window.ronin) return;

    try {
      const provider = window.ronin.provider;
      const accounts = await provider.request({ method: 'eth_accounts' });
      
      if (accounts && accounts.length > 0) {
        const chainId = await provider.request({ method: 'eth_chainId' });
        setWallet({
          address: accounts[0],
          chainId,
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Check connection error:', error);
    }
  };

  const connect = async () => {
    if (typeof window === 'undefined') {
      setWallet(prev => ({
        ...prev,
        error: 'Browser environment required',
      }));
      return;
    }

    // Check if Ronin Wallet is installed
    if (!window.ronin) {
      setWallet(prev => ({
        ...prev,
        error: 'Ronin Wallet not found. Please install from wallet.roninchain.com',
      }));
      return;
    }

    try {
      setWallet(prev => ({ ...prev, isConnecting: true, error: null }));

      const provider = window.ronin.provider;
      
      // Request accounts
      const accounts = await provider.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      // Get chain ID
      const chainId = await provider.request({ method: 'eth_chainId' });

      setWallet({
        address: accounts[0],
        chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
      });

      // Setup event listeners
      provider.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setWallet(prev => ({ ...prev, address: accounts[0] }));
        }
      });

      provider.on('chainChanged', (chainId: string) => {
        setWallet(prev => ({ ...prev, chainId }));
      });

    } catch (error: any) {
      console.error('Failed to connect:', error);
      setWallet(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  };

  const disconnect = async () => {
    if (typeof window === 'undefined' || !window.ronin) return;

    try {
      setWallet({
        address: null,
        chainId: null,
        isConnected: false,
        isConnecting: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Failed to disconnect:', error);
    }
  };

  const switchToRonin = async () => {
    if (typeof window === 'undefined' || !window.ronin) return;

    try {
      const provider = window.ronin.provider;
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7e4' }], // Ronin Mainnet
      });
    } catch (error: any) {
      console.error('Failed to switch to Ronin:', error);
    }
  };

  const switchToSaigon = async () => {
    if (typeof window === 'undefined' || !window.ronin) return;

    try {
      const provider = window.ronin.provider;
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7e5' }], // Saigon Testnet
      });
    } catch (error: any) {
      console.error('Failed to switch to Saigon:', error);
    }
  };

  return {
    ...wallet,
    connect,
    disconnect,
    switchToRonin,
    switchToSaigon,
  };
}
