'use client';

import GameNav from '@/components/GameNav';
import { useWaypoint } from '@/hooks/useWaypoint';

export default function WalletPage() {
  const { address } = useWaypoint();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white pb-20">
      <div className="bg-black/80 backdrop-blur-md border-b border-red-800/50 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-red-500">💰 Wallet</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-9xl mb-4">💰</div>
          <h2 className="text-3xl font-bold text-red-500 mb-2">Your Wallet</h2>
          <p className="text-gray-400 mb-6">NFTs, tokens, and transactions</p>
          {address && (
            <div className="bg-black/40 border border-red-800/50 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-sm text-gray-400 mb-2">Wallet Address</p>
              <p className="text-lg font-mono text-red-400 break-all">{address}</p>
            </div>
          )}
        </div>
      </div>
      <GameNav />
    </div>
  );
}
