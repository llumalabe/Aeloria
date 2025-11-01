'use client';

import { useWallet } from '@/hooks/useWallet';
import BackToTown from '@/components/BackToTown';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VIPPage() {
  const { address } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!address) {
      router.push('/');
    }
  }, [address, router]);

  if (!address) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      <BackToTown />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-600">
          👑 VIP Benefits
        </h1>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* VIP Tiers */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Bronze VIP */}
            <div className="bg-gradient-to-br from-orange-800/80 to-yellow-800/80 border-2 border-orange-500/50 rounded-xl p-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-orange-400 mb-2">🥉 Bronze VIP</h2>
                <p className="text-gray-300 text-sm">Level 1-10</p>
              </div>
              <ul className="space-y-2 text-white">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> +10% EXP Bonus
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> +5% Gold Bonus
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Daily Login Bonus x1.5
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> VIP Chat Badge
                </li>
              </ul>
              <button className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-all">
                Activate - 100 Premium
              </button>
            </div>

            {/* Silver VIP */}
            <div className="bg-gradient-to-br from-gray-600/80 to-gray-800/80 border-2 border-gray-400/50 rounded-xl p-6 transform scale-105">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-gray-300 mb-2">🥈 Silver VIP</h2>
                <p className="text-gray-400 text-sm">Level 11-25</p>
              </div>
              <ul className="space-y-2 text-white">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> +20% EXP Bonus
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> +10% Gold Bonus
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Daily Login Bonus x2
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> +5% Drop Rate
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Exclusive VIP Dungeon
                </li>
              </ul>
              <button className="w-full mt-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all">
                Activate - 300 Premium
              </button>
            </div>

            {/* Gold VIP */}
            <div className="bg-gradient-to-br from-yellow-600/80 to-yellow-800/80 border-2 border-yellow-400/50 rounded-xl p-6">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">🥇 Gold VIP</h2>
                <p className="text-gray-300 text-sm">Level 26+</p>
              </div>
              <ul className="space-y-2 text-white">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> +30% EXP Bonus
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> +15% Gold Bonus
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Daily Login Bonus x3
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> +10% Drop Rate
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> VIP-Only World Boss
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Priority Support
                </li>
              </ul>
              <button className="w-full mt-6 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition-all">
                Activate - 500 Premium
              </button>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-gradient-to-br from-purple-800/80 to-indigo-800/80 border-2 border-purple-500/50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Your VIP Status</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 mb-2">Current Tier</p>
                <p className="text-2xl font-bold text-white">Free Player</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Active Bonuses</p>
                <p className="text-lg text-gray-300">No active VIP benefits</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-900/30 border-2 border-blue-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-3">ℹ️ VIP Information</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• VIP status lasts for 30 days from activation</li>
              <li>• Benefits stack with guild bonuses and equipment</li>
              <li>• VIP status can be renewed before expiration</li>
              <li>• Premium currency can be purchased or earned in-game</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
