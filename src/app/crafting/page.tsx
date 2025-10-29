'use client';

import { useWallet } from '@/hooks/useWallet';
import BackToTown from '@/components/BackToTown';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CraftingPage() {
  const { address } = useWallet();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'weapon' | 'armor' | 'accessory'>('weapon');

  useEffect(() => {
    if (!address) {
      router.push('/');
    }
  }, [address, router]);

  if (!address) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 via-red-900 to-black">
      <BackToTown />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-8 text-yellow-400">
          ⚒️ Crafting Workshop
        </h1>

        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={() => setSelectedTab('weapon')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                selectedTab === 'weapon'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ⚔️ Weapons
            </button>
            <button
              onClick={() => setSelectedTab('armor')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                selectedTab === 'armor'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🛡️ Armor
            </button>
            <button
              onClick={() => setSelectedTab('accessory')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                selectedTab === 'accessory'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              💍 Accessories
            </button>
          </div>

          {/* Crafting Info */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-orange-500/30 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">🔨 How to Craft</h2>
            <div className="space-y-3 text-gray-300">
              <p>• Collect materials from dungeons and monsters</p>
              <p>• Select the item you want to craft</p>
              <p>• Ensure you have all required materials</p>
              <p>• Pay the crafting fee in Gold</p>
              <p>• Higher rarity items require rare materials</p>
            </div>
          </div>

          {/* Enhancement Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-orange-500/30 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">✨ Enhancement</h2>
            <div className="space-y-3 text-gray-300">
              <p>• Enhance your equipment from +0 to +10</p>
              <p>• Each level increases item stats</p>
              <p>• Higher enhancement levels have lower success rates</p>
              <p>• Use Enhancement Stones to increase success rate</p>
            </div>
          </div>

          {/* Upgrade Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-orange-500/30 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">⬆️ Rarity Upgrade</h2>
            <div className="space-y-3 text-gray-300">
              <p>• Upgrade item rarity: Common → Uncommon → Rare → Epic → Legendary → Mythic</p>
              <p>• Requires specific upgrade materials</p>
              <p>• Higher rarity = better base stats</p>
              <p>• Enhancement level is preserved during upgrade</p>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-yellow-500/20 border-2 border-yellow-500 rounded-lg px-8 py-4">
              <p className="text-yellow-400 font-bold text-xl">🚧 Full Crafting System Coming Soon! 🚧</p>
              <p className="text-gray-300 mt-2">Stay tuned for crafting recipes and materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
