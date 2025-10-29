'use client';

import { useWallet } from '@/hooks/useWallet';
import BackToTown from '@/components/BackToTown';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Guild {
  id: string;
  name: string;
  logo: string;
  members: number;
  maxMembers: number;
  level: number;
  power: number;
  description: string;
}

const MOCK_GUILDS: Guild[] = [
  {
    id: '1',
    name: 'Dragon Slayers',
    logo: '🐉',
    members: 48,
    maxMembers: 50,
    level: 25,
    power: 125000,
    description: 'Elite guild for the strongest warriors',
  },
  {
    id: '2',
    name: 'Shadow Legion',
    logo: '🌙',
    members: 45,
    maxMembers: 50,
    level: 23,
    power: 118000,
    description: 'Masters of stealth and darkness',
  },
  {
    id: '3',
    name: 'Holy Knights',
    logo: '⚔️',
    members: 42,
    maxMembers: 50,
    level: 22,
    power: 112000,
    description: 'Defenders of justice and light',
  },
  {
    id: '4',
    name: 'Arcane Circle',
    logo: '🔮',
    members: 38,
    maxMembers: 50,
    level: 20,
    power: 105000,
    description: 'Guild of powerful mages',
  },
];

export default function GuildPage() {
  const { address } = useWallet();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'browse' | 'my-guild' | 'create'>('browse');
  const [hasGuild, setHasGuild] = useState(false);

  useEffect(() => {
    if (!address) {
      router.push('/');
    }
  }, [address, router]);

  if (!address) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 via-cyan-900 to-black">
      <BackToTown />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-8 text-yellow-400">
          🛡️ Guild System
        </h1>

        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 justify-center flex-wrap">
            <button
              onClick={() => setSelectedTab('browse')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                selectedTab === 'browse'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔍 Browse Guilds
            </button>
            <button
              onClick={() => setSelectedTab('my-guild')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                selectedTab === 'my-guild'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🛡️ My Guild
            </button>
            <button
              onClick={() => setSelectedTab('create')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                selectedTab === 'create'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ✨ Create Guild
            </button>
          </div>

          {/* Browse Guilds */}
          {selectedTab === 'browse' && (
            <div className="space-y-4">
              {MOCK_GUILDS.map((guild) => (
                <div
                  key={guild.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-teal-500/30 rounded-xl p-6 hover:border-yellow-400 transition-all"
                >
                  <div className="flex items-start gap-6">
                    <div className="text-6xl">{guild.logo}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-white">{guild.name}</h3>
                        <span className="bg-teal-600 text-white px-4 py-1 rounded-full font-bold">
                          Level {guild.level}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-4">{guild.description}</p>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                          <p className="text-gray-400 text-sm">Members</p>
                          <p className="text-white font-bold">{guild.members}/{guild.maxMembers}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                          <p className="text-gray-400 text-sm">Power</p>
                          <p className="text-yellow-400 font-bold">{guild.power.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                          <p className="text-gray-400 text-sm">Status</p>
                          <p className="text-green-400 font-bold">Open</p>
                        </div>
                      </div>
                      <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition-colors">
                        Request to Join
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* My Guild */}
          {selectedTab === 'my-guild' && (
            <div>
              {hasGuild ? (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-teal-500/30 rounded-xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">Your Guild Info</h2>
                  {/* Guild content here */}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-teal-500/30 rounded-xl p-12 text-center">
                  <div className="text-8xl mb-6">🛡️</div>
                  <h2 className="text-3xl font-bold text-white mb-4">You're not in a guild</h2>
                  <p className="text-gray-400 mb-8 text-lg">
                    Join a guild to unlock exclusive features, participate in guild wars, and earn special rewards!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setSelectedTab('browse')}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-lg transition-colors text-lg"
                    >
                      Browse Guilds
                    </button>
                    <button
                      onClick={() => setSelectedTab('create')}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
                    >
                      Create Your Own
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Create Guild */}
          {selectedTab === 'create' && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-teal-500/30 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">✨ Create New Guild</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 mb-2">Guild Name</label>
                  <input
                    type="text"
                    placeholder="Enter guild name"
                    className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:outline-none"
                    maxLength={30}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Guild Logo (Emoji)</label>
                  <input
                    type="text"
                    placeholder="🛡️"
                    className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-3 text-white text-4xl text-center focus:border-yellow-400 focus:outline-none"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Description</label>
                  <textarea
                    placeholder="Tell others about your guild..."
                    className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:outline-none h-32 resize-none"
                    maxLength={200}
                  />
                </div>
                <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-4">
                  <h3 className="text-yellow-400 font-bold mb-2">Creation Cost</h3>
                  <div className="flex items-center gap-6 text-white">
                    <span>💎 1,000 Premium Currency</span>
                    <span>or</span>
                    <span>🔮 100 AETH Tokens</span>
                  </div>
                </div>
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-lg transition-colors text-lg">
                  Create Guild
                </button>
              </div>
            </div>
          )}

          {/* Guild Benefits */}
          <div className="mt-8 bg-gradient-to-br from-purple-800/80 to-blue-800/80 border-2 border-purple-500/50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">🎁 Guild Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-3xl mb-2">⚔️</div>
                <h3 className="text-white font-bold mb-1">Guild Wars</h3>
                <p className="text-gray-400 text-sm">Compete with other guilds for exclusive rewards</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-3xl mb-2">🏛️</div>
                <h3 className="text-white font-bold mb-1">Guild Shop</h3>
                <p className="text-gray-400 text-sm">Access exclusive items and equipment</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-3xl mb-2">💪</div>
                <h3 className="text-white font-bold mb-1">Guild Buffs</h3>
                <p className="text-gray-400 text-sm">Passive bonuses for all guild members</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="text-white font-bold mb-1">Guild Quests</h3>
                <p className="text-gray-400 text-sm">Complete quests together for bonus rewards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
