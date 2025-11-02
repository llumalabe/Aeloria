'use client';

import { useAccount, useDisconnect, useWalletClient } from 'wagmi';
import { useMemo, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always call hooks (rules of hooks requirement)
  const { address, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { disconnect } = useDisconnect();

  // Return safe defaults before mount to prevent SSR issues
  if (!mounted) {
    return {
      address: undefined,
      isConnected: false,
      chainId: undefined,
      provider: null,
      signer: null,
      disconnect: () => {},
    };
  }

  const { provider, signer } = useMemo(() => {
    // During SSR or when no wallet is connected
    if (!mounted || !walletClient) {
      return { provider: null, signer: null };
    }

    try {
      const ethersProvider = new ethers.BrowserProvider(walletClient as any);
      return {
        provider: ethersProvider,
        signer: ethersProvider.getSigner() as any,
      };
    } catch (error) {
      console.error('Failed to create Ethers.js provider:', error);
      return { provider: null, signer: null };
    }
  }, [mounted, walletClient]);

  const reconnect = async () => {
    console.log('Wagmi handles reconnection automatically');
  };

  return {
    address: address || null,
    isConnected: isConnected || false,
    provider,
    signer,
    chainId: chainId || null,
    walletType: null,
    disconnect,
    reconnect,
  };
}
