'use client';

// Force dynamic rendering to prevent SSR issues with Wagmi
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import { useState, useEffect, Suspense } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { TantoConnectButton } from '@sky-mavis/tanto-widget';
import BackToTown from '@/components/BackToTown';

interface Character {
  _id: string;
  characterName: string;
  characterClass: number;
  rarity?: number;
  level: number;
  exp: number;
  expRequired?: number;
  hp: number;
  maxHp: number;
  str: number;
  agi: number;
  int: number;
  luk: number;
  vit: number;
  passiveSkills?: Array<{
    name: string;
    description: string;
    effect: string;
  }>;
  equipment?: {
    weapon?: { itemName?: string; stats?: any };
    armor?: { itemName?: string; stats?: any };
    accessory1?: { itemName?: string; stats?: any };
    accessory2?: { itemName?: string; stats?: any };
    accessory3?: { itemName?: string; stats?: any };
  };
  isNFT: boolean;
  isBoundToAccount: boolean;
  tokenId?: number;
}

const CLASS_NAMES = ['Warrior', 'Mage', 'Archer', 'Rogue', 'Cleric', 'Paladin'];
const CLASS_ICONS = ['⚔️', '🔮', '🏹', '🗡️', '✨', '🛡️'];
const RARITY_NAMES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
const RARITY_COLORS = ['text-gray-400', 'text-green-400', 'text-blue-400', 'text-purple-400', 'text-yellow-400'];

export default function CharactersPage() {
  const { address } = useWallet();
  const [activeTab, setActiveTab] = useState<'ingame' | 'wallet'>('ingame');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address) {
      loadCharacters();
    } else {
      setLoading(false);
    }
  }, [address, activeTab]);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      const filter = activeTab === 'ingame' ? 'ingame' : 'wallet';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/characters/${address}?filter=${filter}`
      );
      const data = await response.json();
      
      if (data.success) {
        setCharacters(data.characters);
      }
    } catch (error) {
      console.error('Failed to load characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportNFT = async (tokenId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/characters/import-nft`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: address,
            tokenId,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert('Character imported successfully!');
        loadCharacters();
      } else {
        alert(data.error || 'Failed to import character');
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import character');
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black flex items-center justify-center lg:pl-64">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">⚔️ My Characters</h1>
          <p className="text-gray-300 mb-6">Please connect your wallet to view your characters</p>
          <div className="flex justify-center">
            <TantoConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black p-8 lg:pl-64">
      <BackToTown />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">
          ⚔️ My Characters
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('ingame')}
            className={`px-8 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'ingame'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎮 In-Game Characters
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-8 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'wallet'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            👛 Wallet NFTs
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-4 mb-6">
          {activeTab === 'ingame' ? (
            <p className="text-blue-200">
              💡 <strong>In-Game Characters</strong> are bound to your account and can be used in dungeons, PvP, and quests.
            </p>
          ) : (
            <p className="text-blue-200">
              💡 <strong>Wallet NFTs</strong> are owned by you on the blockchain. Click "Import" to use them in-game!
            </p>
          )}
        </div>

        {/* Characters Grid */}
        {loading ? (
          <div className="text-center text-gray-300">Loading characters...</div>
        ) : characters.length === 0 ? (
          <div className="text-center">
            <div className="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg p-12">
              {activeTab === 'ingame' ? (
                <>
                  <p className="text-gray-400 text-lg mb-4">
                    No characters found. You should have a Starter Warrior!
                  </p>
                  <p className="text-gray-500">
                    Try refreshing the page or check if you registered successfully.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-400 text-lg mb-4">
                    No NFT characters in your wallet
                  </p>
                  <p className="text-gray-500 mb-4">
                    Use the <strong>Gacha</strong> to summon new NFT characters!
                  </p>
                  <a
                    href="/gacha"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold"
                  >
                    🎰 Go to Gacha
                  </a>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char) => (
              <div
                key={char._id}
                onClick={() => setSelectedCharacter(char)}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-600 rounded-lg p-6 hover:shadow-xl hover:shadow-yellow-500/50 transition-all cursor-pointer hover:scale-105"
              >
                {/* Character Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">
                      {CLASS_ICONS[char.characterClass]}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-400">
                        {char.characterName}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {CLASS_NAMES[char.characterClass]} • Lv.{char.level}
                      </p>
                      {char.rarity !== undefined && (
                        <p className={`text-xs font-bold ${RARITY_COLORS[char.rarity]}`}>
                          {RARITY_NAMES[char.rarity]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* HP Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-400">HP</span>
                    <span className="text-gray-300">
                      {char.hp}/{char.maxHp}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full"
                      style={{ width: `${(char.hp / char.maxHp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-700/50 rounded px-2 py-1 text-center">
                    <span className="text-xs text-gray-400">STR</span>
                    <p className="text-sm font-bold text-red-400">{char.str}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded px-2 py-1 text-center">
                    <span className="text-xs text-gray-400">AGI</span>
                    <p className="text-sm font-bold text-green-400">{char.agi}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded px-2 py-1 text-center">
                    <span className="text-xs text-gray-400">INT</span>
                    <p className="text-sm font-bold text-blue-400">{char.int}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded px-2 py-1 text-center">
                    <span className="text-xs text-gray-400">LUK</span>
                    <p className="text-sm font-bold text-yellow-400">{char.luk}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded px-2 py-1 text-center">
                    <span className="text-xs text-gray-400">VIT</span>
                    <p className="text-sm font-bold text-purple-400">{char.vit}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded px-2 py-1 text-center">
                    <span className="text-xs text-gray-400">EXP</span>
                    <p className="text-sm font-bold text-cyan-400">{char.exp}</p>
                  </div>
                </div>

                {/* Passive Skills Preview */}
                {char.passiveSkills && char.passiveSkills.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">⭐ Passive Skills:</p>
                    <div className="space-y-1">
                      {char.passiveSkills.slice(0, 2).map((skill, idx) => (
                        <p key={idx} className="text-xs text-purple-300">
                          • {skill.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment Preview */}
                {char.equipment && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">🎒 Equipment:</p>
                    <div className="flex gap-1 flex-wrap">
                      {char.equipment.weapon && (
                        <span className="text-xs bg-orange-900/50 text-orange-300 px-2 py-0.5 rounded">
                          ⚔️ {char.equipment.weapon.itemName || 'Weapon'}
                        </span>
                      )}
                      {char.equipment.armor && (
                        <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">
                          🛡️ {char.equipment.armor.itemName || 'Armor'}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Character Type Badge */}
                <div className="flex items-center justify-between">
                  {char.isNFT ? (
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🎫 NFT #{char.tokenId}
                    </span>
                  ) : (
                    <span className="bg-gray-600 text-gray-200 px-3 py-1 rounded-full text-xs font-bold">
                      🔒 Starter
                    </span>
                  )}

                  {/* Import Button (only in Wallet tab for unbound NFTs) */}
                  {activeTab === 'wallet' && !char.isBoundToAccount && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImportNFT(char.tokenId!);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm"
                    >
                      Import
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-2 text-center">
                  Click to view details
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Character Detail Modal */}
        {selectedCharacter && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCharacter(null)}
          >
            <div 
              className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-4 border-yellow-500 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCharacter(null)}
                className="float-right text-gray-400 hover:text-white text-2xl font-bold"
              >
                ✕
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-6xl">{CLASS_ICONS[selectedCharacter.characterClass]}</span>
                <div>
                  <h2 className="text-3xl font-bold text-yellow-400">{selectedCharacter.characterName}</h2>
                  <p className="text-lg text-gray-300">
                    {CLASS_NAMES[selectedCharacter.characterClass]} • Level {selectedCharacter.level}
                  </p>
                  {selectedCharacter.rarity !== undefined && (
                    <p className={`text-sm font-bold ${RARITY_COLORS[selectedCharacter.rarity]}`}>
                      ⭐ {RARITY_NAMES[selectedCharacter.rarity]}
                    </p>
                  )}
                </div>
              </div>

              {/* HP/EXP Bars */}
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-400 font-bold">HP</span>
                    <span className="text-gray-300">{selectedCharacter.hp}/{selectedCharacter.maxHp}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full"
                      style={{ width: `${(selectedCharacter.hp / selectedCharacter.maxHp) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-400 font-bold">EXP</span>
                    <span className="text-gray-300">{selectedCharacter.exp} / {selectedCharacter.expRequired || 100}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full"
                      style={{ width: `${(selectedCharacter.exp / (selectedCharacter.expRequired || 100)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-3">📊 Stats</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-800 border border-red-500 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">STR</p>
                    <p className="text-2xl font-bold text-red-400">{selectedCharacter.str}</p>
                  </div>
                  <div className="bg-gray-800 border border-green-500 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">AGI</p>
                    <p className="text-2xl font-bold text-green-400">{selectedCharacter.agi}</p>
                  </div>
                  <div className="bg-gray-800 border border-blue-500 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">INT</p>
                    <p className="text-2xl font-bold text-blue-400">{selectedCharacter.int}</p>
                  </div>
                  <div className="bg-gray-800 border border-yellow-500 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">LUK</p>
                    <p className="text-2xl font-bold text-yellow-400">{selectedCharacter.luk}</p>
                  </div>
                  <div className="bg-gray-800 border border-purple-500 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">VIT</p>
                    <p className="text-2xl font-bold text-purple-400">{selectedCharacter.vit}</p>
                  </div>
                </div>
              </div>

              {/* Passive Skills */}
              {selectedCharacter.passiveSkills && selectedCharacter.passiveSkills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">⭐ Passive Skills</h3>
                  <div className="space-y-3">
                    {selectedCharacter.passiveSkills.map((skill, idx) => (
                      <div key={idx} className="bg-purple-900/50 border border-purple-500 rounded-lg p-4">
                        <p className="text-lg font-bold text-purple-300 mb-1">{skill.name}</p>
                        <p className="text-sm text-gray-300 mb-2">{skill.description}</p>
                        <p className="text-xs text-yellow-400 font-bold">📈 {skill.effect}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-3">🎒 Equipment</h3>
                <div className="space-y-2">
                  {selectedCharacter.equipment?.weapon ? (
                    <div className="bg-orange-900/30 border border-orange-500 rounded-lg p-3">
                      <p className="text-sm font-bold text-orange-300">⚔️ Weapon: {selectedCharacter.equipment.weapon.itemName}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3">
                      <p className="text-sm text-gray-500">⚔️ Weapon: Empty</p>
                    </div>
                  )}
                  {selectedCharacter.equipment?.armor ? (
                    <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3">
                      <p className="text-sm font-bold text-blue-300">🛡️ Armor: {selectedCharacter.equipment.armor.itemName}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3">
                      <p className="text-sm text-gray-500">🛡️ Armor: Empty</p>
                    </div>
                  )}
                  {['accessory1', 'accessory2', 'accessory3'].map((slot, idx) => {
                    const acc = selectedCharacter.equipment?.[slot as keyof typeof selectedCharacter.equipment];
                    return acc ? (
                      <div key={idx} className="bg-purple-900/30 border border-purple-500 rounded-lg p-3">
                        <p className="text-sm font-bold text-purple-300">💍 Accessory {idx + 1}: {acc.itemName}</p>
                      </div>
                    ) : (
                      <div key={idx} className="bg-gray-800/50 border border-gray-600 rounded-lg p-3">
                        <p className="text-sm text-gray-500">💍 Accessory {idx + 1}: Empty</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* NFT Info */}
              {selectedCharacter.isNFT && (
                <div className="bg-purple-900/50 border border-purple-500 rounded-lg p-4">
                  <p className="text-sm text-purple-200">
                    🎫 <strong>NFT Token ID:</strong> #{selectedCharacter.tokenId}
                  </p>
                  <p className="text-sm text-purple-200">
                    {selectedCharacter.isBoundToAccount 
                      ? '🔒 Bound to your account (in-game)' 
                      : '👛 In your wallet (not yet imported)'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            {activeTab === 'ingame' 
              ? 'Use your characters in Dungeon, PvP, and Quests!'
              : 'Import NFTs from your wallet to use them in-game'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
