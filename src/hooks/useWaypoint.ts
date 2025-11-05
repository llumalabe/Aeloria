'use client';

import { useState, useEffect } from 'react';

// Waypoint SDK
let WaypointProvider: any;
if (typeof window !== 'undefined') {
  import('@sky-mavis/waypoint').then((module) => {
    WaypointProvider = module.WaypointProvider;
  });
}

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

  useEffect(() => {
    // Initialize Waypoint
    const initWaypoint = async () => {
      if (typeof window === 'undefined' || !WaypointProvider) return;

      try {
        const waypoint = await WaypointProvider.create({
          clientId: process.env.NEXT_PUBLIC_WAYPOINT_CLIENT_ID || 'aeloria-game',
          chainId: 2020, // Ronin Mainnet
        });

        setWaypointInstance(waypoint);

        // Check if already connected
        const user = await waypoint.getUser();
        if (user) {
          setWallet({
            address: user.address,
            chainId: '0x7e4', // Ronin Mainnet
            isConnected: true,
            isConnecting: false,
            error: null,
          });
        }
      } catch (error: any) {
        console.error('Failed to initialize Waypoint:', error);
        setWallet(prev => ({
          ...prev,
          error: error.message || 'Failed to initialize wallet',
        }));
      }
    };

    initWaypoint();
  }, []);

  const connect = async () => {
    if (!waypointInstance) {
      setWallet(prev => ({
        ...prev,
        error: 'Waypoint not initialized yet. Please wait...',
      }));
      return;
    }

    try {
      setWallet(prev => ({ ...prev, isConnecting: true, error: null }));

      // Authorize and get user info
      const user = await waypointInstance.authorize();

      setWallet({
        address: user.address,
        chainId: '0x7e4',
        isConnected: true,
        isConnecting: false,
        error: null,
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
      const waypoint = await WaypointProvider.create({
        clientId: process.env.NEXT_PUBLIC_WAYPOINT_CLIENT_ID || 'aeloria-game',
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
