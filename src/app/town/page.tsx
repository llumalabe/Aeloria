'use client';

import { useWallet } from '@/hooks/useWallet';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TownPage() {
  const { address } = useWallet();
  const { userData, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!address) {
      router.push('/');
    }
  }, [address, router]);

  if (!address) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <p className="text-xl text-gray-300">Loading your town...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-8 text-yellow-400">
          🏰 Town of Aeloria
        </h1>

        {/* User Info Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-2 border-yellow-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{userData?.username || 'Adventurer'}</h2>
                <p className="text-sm text-gray-400">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-400">Lv. {userData?.level || 1}</div>
                <p className="text-sm text-gray-400">Total Power: {userData?.totalPower || 0}</p>
              </div>
            </div>

            {/* Currency Display */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-1">🪙</div>
                <div className="text-2xl font-bold text-yellow-400">{userData?.gold?.toLocaleString() || 0}</div>
                <div className="text-xs text-gray-400">Gold</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-1">💎</div>
                <div className="text-2xl font-bold text-purple-400">{userData?.premiumCurrency || 0}</div>
                <div className="text-xs text-gray-400">Premium</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-1">🔮</div>
                <div className="text-2xl font-bold text-blue-400">{userData?.tokenBalance || 0}</div>
                <div className="text-xs text-gray-400">AETH Token</div>
              </div>
            </div>
          </div>
        </div>

        {/* Town Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Characters */}
          <Link
            href="/characters"
            className="bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-2 border-blue-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">⚔️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Characters</h2>
            <p className="text-gray-300">View and manage your heroes</p>
          </Link>

          {/* Dungeon */}
          <Link
            href="/dungeon"
            className="bg-gradient-to-br from-red-900/80 to-red-800/80 border-2 border-red-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🗿</div>
            <h2 className="text-2xl font-bold text-white mb-2">Dungeon</h2>
            <p className="text-gray-300">Explore dangerous dungeons</p>
          </Link>

          {/* Shop */}
          <Link
            href="/shop"
            className="bg-gradient-to-br from-green-900/80 to-green-800/80 border-2 border-green-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏪</div>
            <h2 className="text-2xl font-bold text-white mb-2">Shop</h2>
            <p className="text-gray-300">Buy items and equipment</p>
          </Link>

          {/* Marketplace */}
          <Link
            href="/marketplace"
            className="bg-gradient-to-br from-purple-900/80 to-purple-800/80 border-2 border-purple-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏛️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Marketplace</h2>
            <p className="text-gray-300">Trade with other players</p>
          </Link>

          {/* Crafting */}
          <Link
            href="/crafting"
            className="bg-gradient-to-br from-orange-900/80 to-orange-800/80 border-2 border-orange-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">⚒️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Crafting</h2>
            <p className="text-gray-300">Craft and enhance equipment</p>
          </Link>

          {/* Gacha */}
          <Link
            href="/gacha"
            className="bg-gradient-to-br from-pink-900/80 to-pink-800/80 border-2 border-pink-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎰</div>
            <h2 className="text-2xl font-bold text-white mb-2">Gacha</h2>
            <p className="text-gray-300">Summon new heroes</p>
          </Link>

          {/* Rewards */}
          <Link
            href="/rewards"
            className="bg-gradient-to-br from-yellow-900/80 to-yellow-800/80 border-2 border-yellow-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎁</div>
            <h2 className="text-2xl font-bold text-white mb-2">Rewards</h2>
            <p className="text-gray-300">Claim daily rewards</p>
          </Link>

          {/* Ranking */}
          <Link
            href="/ranking"
            className="bg-gradient-to-br from-cyan-900/80 to-cyan-800/80 border-2 border-cyan-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
            <h2 className="text-2xl font-bold text-white mb-2">Ranking</h2>
            <p className="text-gray-300">View leaderboards</p>
          </Link>

          {/* Guild */}
          <Link
            href="/guild"
            className="bg-gradient-to-br from-teal-900/80 to-teal-800/80 border-2 border-teal-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🛡️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Guild</h2>
            <p className="text-gray-300">Join or create a guild</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
