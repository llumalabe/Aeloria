'use client';

import { useWallet } from '@/hooks/useWallet';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RewardsPage() {
  const { address } = useWallet();
  const router = useRouter();
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (!address) {
      router.push('/');
    }
  }, [address, router]);

  if (!address) {
    return null;
  }

  const handleClaimDaily = () => {
    setClaimed(true);
    // TODO: API call to claim daily reward
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-900 via-orange-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-8 text-yellow-400">
          🎁 Rewards Center
        </h1>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Daily Login Reward */}
          <div className="bg-gradient-to-br from-yellow-800/80 to-orange-800/80 border-2 border-yellow-500/50 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">📅 Daily Login Reward</h2>
                <p className="text-gray-300">Claim your daily rewards just by logging in!</p>
              </div>
              <div className="text-6xl">🎁</div>
            </div>
            <div className="grid grid-cols-7 gap-4 mb-6">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  className={`bg-gray-800/50 border-2 ${
                    day === 1 ? 'border-yellow-400' : 'border-gray-600'
                  } rounded-lg p-4 text-center`}
                >
                  <div className="text-2xl mb-2">🪙</div>
                  <p className="text-white font-bold">Day {day}</p>
                  <p className="text-yellow-400 text-sm">{day * 100} Gold</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleClaimDaily}
              disabled={claimed}
              className={`w-full py-4 rounded-lg font-bold text-xl transition-all ${
                claimed
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-black'
              }`}
            >
              {claimed ? '✅ Claimed Today' : 'Claim Daily Reward'}
            </button>
          </div>

          {/* Achievements */}
          <div className="bg-gradient-to-br from-purple-800/80 to-blue-800/80 border-2 border-purple-500/50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">🏆 Achievements</h2>
            <div className="space-y-4">
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">⚔️</div>
                  <div>
                    <h3 className="text-white font-bold">First Victory</h3>
                    <p className="text-gray-400 text-sm">Complete your first dungeon</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold">+100 🪙</p>
                  <p className="text-gray-400 text-sm">0/1</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🎭</div>
                  <div>
                    <h3 className="text-white font-bold">Collector</h3>
                    <p className="text-gray-400 text-sm">Own 5 different characters</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold">+500 🪙</p>
                  <p className="text-gray-400 text-sm">1/5</p>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">💎</div>
                  <div>
                    <h3 className="text-white font-bold">Level 10</h3>
                    <p className="text-gray-400 text-sm">Reach level 10 with any character</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold">+50 💎</p>
                  <p className="text-gray-400 text-sm">1/10</p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Rewards */}
          <div className="bg-gradient-to-br from-pink-800/80 to-red-800/80 border-2 border-pink-500/50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">👥 Referral Rewards</h2>
            <p className="text-gray-300 mb-4">Invite friends and earn rewards!</p>
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-4">
              <p className="text-gray-400 text-sm mb-2">Your Referral Code</p>
              <div className="flex items-center gap-4">
                <code className="flex-1 bg-gray-900 border border-gray-700 rounded px-4 py-2 text-yellow-400 font-mono text-lg">
                  AELORIA-{address?.slice(2, 8).toUpperCase()}
                </code>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-lg transition-colors">
                  Copy
                </button>
              </div>
            </div>
            <div className="space-y-2 text-gray-300">
              <p>• Invite a friend: +100 💎</p>
              <p>• Friend reaches Level 10: +500 🪙</p>
              <p>• Friend makes first purchase: +1000 🔮</p>
            </div>
          </div>

          {/* Season Pass */}
          <div className="bg-gradient-to-br from-indigo-800/80 to-purple-800/80 border-2 border-indigo-500/50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">🎫 Season Pass</h2>
            <p className="text-gray-300 mb-6">Level up your Season Pass to unlock exclusive rewards!</p>
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold">Level 3</span>
                <span className="text-gray-400">300 / 500 XP</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-block bg-yellow-500/20 border-2 border-yellow-500 rounded-lg px-8 py-4">
                <p className="text-yellow-400 font-bold text-xl">🚧 Season Pass Coming Soon! 🚧</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
