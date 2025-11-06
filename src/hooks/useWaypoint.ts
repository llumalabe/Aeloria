'use client';

import { useState, useEffect } from 'react';

interface WalletState {
  address: string | null;
  chainId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useWaypoint() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const [waypointInstance, setWaypointInstance] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize Waypoint
    const initWaypoint = async () => {
      if (typeof window === 'undefined') return;

      try {
        setIsInitializing(true);
        
        // Dynamically import Waypoint SDK
        const { WaypointProvider } = await import('@sky-mavis/waypoint');
        
        const waypoint = await WaypointProvider.create({
          clientId: 'FWH2ducl0Ur5fFSAOeNdXS0p8LmWGD6j',
          chainId: 2020, // Ronin Mainnet
        });

        setWaypointInstance(waypoint);
        setIsInitializing(false);
      } catch (error: any) {
        console.error('Failed to initialize Waypoint:', error);
        setWallet(prev => ({
          ...prev,
          error: error.message || 'Failed to initialize wallet',
        }));
        setIsInitializing(false);
      }
    };

    initWaypoint();
  }, []);

  const connect = async () => {
    // Wait for initialization if still loading
    if (isInitializing) {
      setWallet(prev => ({
        ...prev,
        error: 'Initializing wallet... Please wait a moment.',
      }));
      return;
    }

    if (!waypointInstance) {
      setWallet(prev => ({
        ...prev,
        error: 'Waypoint not initialized. Please refresh the page.',
      }));
      return;
    }

    try {
      setWallet(prev => ({ ...prev, isConnecting: true, error: null }));

      // Waypoint SDK v4 uses sendTransaction to trigger authorization
      // First, we need to get user to authenticate
      const result = await waypointInstance.login();
      
      if (result && result.address) {
        setWallet({
          address: result.address,
          chainId: '0x7e4',
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      } else {
        throw new Error('Failed to get user address');
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

  const disconnect = async () => {
    if (!waypointInstance) return;

    try {
      await waypointInstance.logout();
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
    // Waypoint handles chain switching automatically
    return Promise.resolve();
  };

  const switchToSaigon = async () => {
    // Would need to reinitialize Waypoint with different chainId
    if (!waypointInstance) return;

    try {
      const { WaypointProvider } = await import('@sky-mavis/waypoint');
      const waypoint = await WaypointProvider.create({
        clientId: 'FWH2ducl0Ur5fFSAOeNdXS0p8LmWGD6j',
        chainId: 2021, // Saigon Testnet
      });
      setWaypointInstance(waypoint);
    } catch (error: any) {
      console.error('Failed to switch network:', error);
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
