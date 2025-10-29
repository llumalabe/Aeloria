'use client';

import { useWallet } from '@/hooks/useWallet';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TownPage() {
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-12 text-yellow-400">
          🏰 Town of Aeloria
        </h1>

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
