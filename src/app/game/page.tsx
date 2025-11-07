'use client';

import { useWaypoint } from '@/hooks/useWaypoint';
import GameNav from '@/components/GameNav';

export default function BunkerPage() {
  const { address, disconnect } = useWaypoint();

  if (!address) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-red-500 mb-4">Access Denied</h2>
          <p className="text-gray-400">Connect wallet first</p>
          <a href="/" className="mt-4 inline-block px-6 py-3 bg-red-700 hover:bg-red-800 rounded-lg text-white">
            Back
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white pb-20">
      <div className="bg-black/80 backdrop-blur-md border-b border-red-800/50 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-red-500">Safe Zone</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded text-sm">
              <span className="text-gray-400">{address.slice(0, 6)}...{address.slice(-4)}</span>
              <button onClick={disconnect} className="text-red-400 hover:text-red-300 text-xs">X</button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-20">
          <div className="text-9xl mb-4"></div>
          <h2 className="text-3xl font-bold text-red-500 mb-2">Safe Zone Alpha</h2>
          <p className="text-gray-400">Day 127 of the Apocalypse</p>
        </div>
      </div>
      <GameNav />
    </div>
  );
}
