'use client';

import { useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';

export default function WalletReconnect() {
  const { address, walletType, reconnect } = useWallet();

  useEffect(() => {
    // Auto-reconnect if we have a stored wallet type but no active connection
    if (walletType && !address) {
      reconnect();
    }
  }, [walletType, address, reconnect]);

  return null; // This component doesn't render anything
}
