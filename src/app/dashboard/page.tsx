'use client';

import { useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const { address } = useWallet();
  const { isLoading, userData, isRegistered } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!address && !isLoading) {
      router.push('/');
    }
  }, [address, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!address) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center text-yellow-400 mb-8">
          ⚔️ Dashboard
        </h1>

        {/* User Info Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-purple-900/80 to-blue-900/80 border-2 border-purple-500/50 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {userData?.username || `Player_${address.slice(2, 8)}`}
                </h2>
                <p className="text-gray-400 font-mono text-sm">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </div>
              <div className="text-6xl">🎮</div>
            </div>

            {/* Currency Display */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">Gold</p>
                <p className="text-3xl font-bold text-yellow-400">
                  🪙 {userData?.gold?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">Premium</p>
                <p className="text-3xl font-bold text-purple-400">
                  💎 {userData?.premiumCurrency?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">AETH Token</p>
                <p className="text-3xl font-bold text-pink-400">
                  🔮 {userData?.tokenBalance?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Town */}
            <Link
              href="/town"
              className="bg-gradient-to-br from-indigo-900/80 to-blue-800/80 border-2 border-indigo-500/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏰</div>
              <h3 className="text-2xl font-bold text-white mb-2">Town</h3>
              <p className="text-gray-300">Visit the town hub</p>
            </Link>

            {/* Characters */}
            <Link
              href="/characters"
              className="bg-gradient-to-br from-blue-900/80 to-cyan-800/80 border-2 border-blue-500/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">⚔️</div>
              <h3 className="text-2xl font-bold text-white mb-2">Characters</h3>
              <p className="text-gray-300">View your heroes</p>
            </Link>

            {/* Gacha */}
            <Link
              href="/gacha"
              className="bg-gradient-to-br from-pink-900/80 to-purple-800/80 border-2 border-pink-500/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎰</div>
              <h3 className="text-2xl font-bold text-white mb-2">Gacha</h3>
              <p className="text-gray-300">Summon new heroes</p>
            </Link>

            {/* Shop */}
            <Link
              href="/shop"
              className="bg-gradient-to-br from-green-900/80 to-emerald-800/80 border-2 border-green-500/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏪</div>
              <h3 className="text-2xl font-bold text-white mb-2">Shop</h3>
              <p className="text-gray-300">Buy items</p>
            </Link>

            {/* Marketplace */}
            <Link
              href="/marketplace"
              className="bg-gradient-to-br from-purple-900/80 to-pink-800/80 border-2 border-purple-500/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏛️</div>
              <h3 className="text-2xl font-bold text-white mb-2">Marketplace</h3>
              <p className="text-gray-300">Trade NFTs</p>
            </Link>

            {/* Rewards */}
            <Link
              href="/rewards"
              className="bg-gradient-to-br from-yellow-900/80 to-orange-800/80 border-2 border-yellow-500/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎁</div>
              <h3 className="text-2xl font-bold text-white mb-2">Rewards</h3>
              <p className="text-gray-300">Claim rewards</p>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        {isRegistered && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">📊 Your Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-sm">Level</p>
                  <p className="text-2xl font-bold text-white">{userData?.level || 1}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Power</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {userData?.totalPower?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Characters</p>
                  <p className="text-2xl font-bold text-blue-400">1</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Guild</p>
                  <p className="text-2xl font-bold text-purple-400">None</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
