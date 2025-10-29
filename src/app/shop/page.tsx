'use client';

import { useWallet } from '@/hooks/useWallet';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'gold' | 'premium' | 'token';
  icon: string;
  type: 'potion' | 'equipment' | 'material';
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: '1',
    name: 'Health Potion',
    description: 'Restores 100 HP',
    price: 50,
    currency: 'gold',
    icon: '🧪',
    type: 'potion',
  },
  {
    id: '2',
    name: 'Mana Potion',
    description: 'Restores 50 MP',
    price: 40,
    currency: 'gold',
    icon: '💙',
    type: 'potion',
  },
  {
    id: '3',
    name: 'EXP Boost',
    description: '+50% EXP for 1 hour',
    price: 100,
    currency: 'premium',
    icon: '⭐',
    type: 'potion',
  },
  {
    id: '4',
    name: 'Iron Ore',
    description: 'Crafting material',
    price: 20,
    currency: 'gold',
    icon: '⛏️',
    type: 'material',
  },
];

export default function ShopPage() {
  const { address } = useWallet();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'all' | 'potion' | 'equipment' | 'material'>('all');

  useEffect(() => {
    if (!address) {
      router.push('/');
    }
  }, [address, router]);

  if (!address) {
    return null;
  }

  const filteredItems = selectedTab === 'all' 
    ? SHOP_ITEMS 
    : SHOP_ITEMS.filter(item => item.type === selectedTab);

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'gold': return '🪙';
      case 'premium': return '💎';
      case 'token': return '🔮';
      default: return '🪙';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-emerald-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-8 text-yellow-400">
          🏪 Item Shop
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              selectedTab === 'all'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setSelectedTab('potion')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              selectedTab === 'potion'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Potions
          </button>
          <button
            onClick={() => setSelectedTab('equipment')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              selectedTab === 'equipment'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Equipment
          </button>
          <button
            onClick={() => setSelectedTab('material')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              selectedTab === 'material'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Materials
          </button>
        </div>

        {/* Shop Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-green-500/30 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all"
            >
              <div className="text-6xl mb-4 text-center">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">{item.name}</h3>
              <p className="text-gray-400 text-sm mb-4 text-center">{item.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-yellow-400">
                  {getCurrencyIcon(item.currency)} {item.price}
                </span>
              </div>
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition-colors">
                Buy Now
              </button>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No items in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
