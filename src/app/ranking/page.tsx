'use client';

import { useWallet } from '@/hooks/useWallet';
import BackToTown from '@/components/BackToTown';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RankingPlayer {
  rank: number;
  address: string;
  username: string;
  level: number;
  power: number;
  wins: number;
}

const MOCK_RANKINGS: RankingPlayer[] = [
  { rank: 1, address: '0x1234...5678', username: 'DragonSlayer', level: 50, power: 12500, wins: 150 },
  { rank: 2, address: '0x2345...6789', username: 'ShadowMage', level: 48, power: 11800, wins: 142 },
  { rank: 3, address: '0x3456...7890', username: 'IronKnight', level: 47, power: 11200, wins: 138 },
  { rank: 4, address: '0x4567...8901', username: 'StormArcher', level: 45, power: 10500, wins: 130 },
  { rank: 5, address: '0x5678...9012', username: 'HolyCleric', level: 44, power: 10100, wins: 125 },
];

export default function RankingPage() {
  const { address } = useWallet();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'power' | 'level' | 'pvp'>('power');

  useEffect(() => {
    if (!address) {
      router.push('/');
    }
  }, [address, router]);

  if (!address) {
    return null;
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-orange-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-900 via-blue-900 to-black lg:pl-64">
      <BackToTown />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-8 text-yellow-400">
          🏆 Rankings
        </h1>

        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 justify-center flex-wrap">
            <button
              onClick={() => setSelectedTab('power')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                selectedTab === 'power'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ⚡ Power
            </button>
            <button
              onClick={() => setSelectedTab('level')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                selectedTab === 'level'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📊 Level
            </button>
            <button
              onClick={() => setSelectedTab('pvp')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                selectedTab === 'pvp'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ⚔️ PvP Wins
            </button>
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* 2nd Place */}
            <div className="text-center pt-8">
              <div className="bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-gray-400 rounded-xl p-6">
                <div className="text-5xl mb-3">🥈</div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">{MOCK_RANKINGS[1].username}</h3>
                <p className="text-gray-400 text-sm mb-2">{MOCK_RANKINGS[1].address}</p>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-yellow-400">{MOCK_RANKINGS[1].power.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">Power</p>
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-600 to-orange-600 border-2 border-yellow-400 rounded-xl p-6 transform scale-110">
                <div className="text-6xl mb-3">🥇</div>
                <h3 className="text-2xl font-bold text-white mb-2">{MOCK_RANKINGS[0].username}</h3>
                <p className="text-yellow-100 text-sm mb-2">{MOCK_RANKINGS[0].address}</p>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-3xl font-bold text-white">{MOCK_RANKINGS[0].power.toLocaleString()}</p>
                  <p className="text-yellow-100 text-sm">Power</p>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center pt-8">
              <div className="bg-gradient-to-br from-orange-700 to-orange-900 border-2 border-orange-500 rounded-xl p-6">
                <div className="text-5xl mb-3">🥉</div>
                <h3 className="text-xl font-bold text-orange-200 mb-2">{MOCK_RANKINGS[2].username}</h3>
                <p className="text-orange-300 text-sm mb-2">{MOCK_RANKINGS[2].address}</p>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-yellow-400">{MOCK_RANKINGS[2].power.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">Power</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ranking List */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-cyan-500/30 rounded-xl overflow-hidden">
            <div className="bg-gray-900/50 border-b border-gray-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Top Players</h2>
            </div>
            <div className="divide-y divide-gray-700">
              {MOCK_RANKINGS.map((player) => (
                <div
                  key={player.rank}
                  className={`px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors ${
                    player.rank <= 3 ? 'bg-gray-700/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className={`text-2xl font-bold ${getRankColor(player.rank)} min-w-[60px]`}>
                      {getRankIcon(player.rank)}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{player.username}</h3>
                      <p className="text-gray-400 text-sm font-mono">{player.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Level</p>
                      <p className="text-white font-bold">{player.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Power</p>
                      <p className="text-yellow-400 font-bold">{player.power.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Wins</p>
                      <p className="text-green-400 font-bold">{player.wins}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Ranking */}
          <div className="mt-8 bg-gradient-to-br from-purple-800/80 to-blue-800/80 border-2 border-purple-500/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Your Ranking</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">Your best rank</p>
                <p className="text-4xl font-bold text-yellow-400">#42</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 mb-2">Your Power</p>
                <p className="text-2xl font-bold text-white">8,250</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
