'use client';

import { useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import useAuth from '@/hooks/useAuth';

export default function WalletReconnect() {
  const { address, walletType, reconnect } = useWallet();
  const { isLoading, isRegistered } = useAuth(); // This will auto-register users

  useEffect(() => {
    // Auto-reconnect if we have a stored wallet type but no active connection
    if (walletType && !address) {
      reconnect();
    }
  }, [walletType, address, reconnect]);

  // Show loading indicator if registering
  if (isLoading && address) {
    return (
      <div className="fixed top-20 right-4 z-50 bg-gray-900 border-2 border-yellow-400 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin text-2xl">⚙️</div>
          <div>
            <p className="text-white font-bold">Setting up your account...</p>
            <p className="text-gray-400 text-sm">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
