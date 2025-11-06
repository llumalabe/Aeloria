'use client';

import { useEffect, useState } from 'react';
import { WaypointProvider } from '@sky-mavis/waypoint';

interface WalletState {
  address: string | null;
  chainId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useWaypoint() {
  const [waypointProvider, setWaypointProvider] = useState<WaypointProvider | null>(null);
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  // Initialize Waypoint Provider
  useEffect(() => {
    const initProvider = () => {
      if (typeof window === 'undefined') return;

      try {
        const provider = WaypointProvider.create({
          clientId: '32fa6abf-1ef8-4b71-8053-817c6120254a',
          chainId: 2020, // Ronin Mainnet
          redirectUrl: window.location.origin + '/',
        });

        setWaypointProvider(provider);
      } catch (error: any) {
        console.error('Failed to initialize Waypoint:', error);
        setWallet(prev => ({
          ...prev,
          error: error.message || 'Failed to initialize wallet',
        }));
      }
    };

    initProvider();
  }, []);

  const connect = async () => {
    if (!waypointProvider) {
      setWallet(prev => ({
        ...prev,
        error: 'Waypoint not initialized. Please refresh the page.',
      }));
      return;
    }

    try {
      setWallet(prev => ({ ...prev, isConnecting: true, error: null }));

      // Connect and get address
      const result = await waypointProvider.connect();
      
      if (result && result.address) {
        setWallet({
          address: result.address,
          chainId: '0x7e4', // Ronin Mainnet
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      } else {
        throw new Error('No address returned from authorization');
      }
    } catch (error: any) {
      console.error('Failed to connect:', error);
      setWallet(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  };

  const disconnect = () => {
    if (!waypointProvider) return;

    try {
      waypointProvider.disconnect();
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

  return {
    address: wallet.address,
    chainId: wallet.chainId,
    isConnected: wallet.isConnected,
    isConnecting: wallet.isConnecting,
    error: wallet.error,
    connect,
    disconnect,
  };
}
