import { useAccount, useDisconnect, useWalletClient } from 'wagmi';
import { useMemo } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { disconnect } = useDisconnect();

  const { provider, signer } = useMemo(() => {
    if (!walletClient) {
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
  }, [walletClient]);

  const reconnect = async () => {
    console.log('Wagmi handles reconnection automatically');
  };

  return {
    address: address || null,
    isConnected,
    provider,
    signer,
    chainId: chainId || null,
    walletType: null,
    disconnect,
    reconnect,
  };
}