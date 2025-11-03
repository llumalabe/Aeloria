'use client';

import useAuth from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';

export default function WalletReconnect() {
  const { address } = useWallet();
  const { isLoading } = useAuth();

  if (isLoading && address) {
    return (
      <div className="fixed top-20 right-4 z-50 bg-gray-900">
        <p>Loading...</p>
      </div>
    );
  }
  return null;
}
