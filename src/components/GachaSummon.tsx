'use client'

import { useState } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { RARITY_NAMES } from '@/config/constants'

interface SummonResult {
  success: boolean
  item?: {
    tokenId: number
    name: string
    rarity: number
    itemType: string
    stats: {
      str?: number
      agi?: number
      int?: number
      luk?: number
      vit?: number
    }
  }
  cost: {
    gold?: number
    premium?: number
  }
}

export default function GachaSummon() {
  const { user, updateCurrency } = useGameState()
  const [summoning, setSummoning] = useState(false)
  const [summonResult, setSummonResult] = useState<SummonResult | null>(null)
  const [summonAnimation, setSummonAnimation] = useState(false)

  const gachaTiers = [
    {
      id: 'basic',
      name: 'Basic Summon',
      icon: '📦',
      cost: { gold: 500 },
      description: 'Common and Uncommon items',
      rarityChance: 'Common: 70%, Uncommon: 25%, Rare: 5%'
    },
    {
      id: 'premium',
      name: 'Premium Summon',
      icon: '💎',
      cost: { premium: 50 },
      description: 'Rare and Epic items guaranteed',
      rarityChance: 'Rare: 60%, Epic: 35%, Legendary: 5%'
    },
    {
      id: 'legendary',
      name: 'Legendary Summon',
      icon: '⭐',
      cost: { premium: 200 },
      description: 'Epic and Legendary items',
      rarityChance: 'Epic: 50%, Legendary: 45%, Mythic: 5%'
    }
  ]

  const performSummon = async (tierId: string) => {
    if (!user) {
      alert('Please connect your wallet first!')
      return
    }

    const tier = gachaTiers.find(t => t.id === tierId)
    if (!tier) return

    // Check if user has enough currency
    if (tier.cost.gold && user.gold < tier.cost.gold) {
      alert('Not enough Gold!')
      return
    }
    if (tier.cost.premium && user.premium < tier.cost.premium) {
      alert('Not enough Premium Currency!')
      return
    }

    setSummoning(true)
    setSummonAnimation(true)
    setSummonResult(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gacha/summon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: user.walletAddress,
          tier: tierId
        })
      })

      const result: SummonResult = await response.json()

      // Simulate summon animation
      await new Promise(resolve => setTimeout(resolve, 3000))

      setSummonAnimation(false)
      setSummonResult(result)

      // Update currency
      if (tier.cost.gold) {
        updateCurrency(-tier.cost.gold, 0, 0)
      }
      if (tier.cost.premium) {
        updateCurrency(0, -tier.cost.premium, 0)
      }
    } catch (error) {
      console.error('Summon failed:', error)
      alert('Summon failed. Please try again.')
      setSummonAnimation(false)
    } finally {
      setSummoning(false)
    }
  }

  const closeSummonResult = () => {
    setSummonResult(null)
  }

  const getRarityColor = (rarity: number) => {
    const colors = [
      'from-gray-400 to-gray-600',      // Common
      'from-green-400 to-green-600',    // Uncommon
      'from-blue-400 to-blue-600',      // Rare
      'from-purple-400 to-purple-600',  // Epic
      'from-orange-400 to-orange-600',  // Legendary
      'from-red-400 to-red-600'         // Mythic
    ]
    return colors[rarity] || colors[0]
  }

  const getRarityGlow = (rarity: number) => {
    const glows = [
      'shadow-gray-500',      // Common
      'shadow-green-500',     // Uncommon
      'shadow-blue-500',      // Rare
      'shadow-purple-500',    // Epic
      'shadow-orange-500',    // Legendary
      'shadow-red-500'        // Mythic
    ]
    return glows[rarity] || glows[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-400 mb-8 text-center">
          ✨ Mystical Summons
        </h1>

        <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">🎲 How it Works</h2>
          <div className="space-y-2 text-slate-300">
            <p>• Choose your summon tier based on your budget and desired rarity</p>
            <p>• Higher tiers guarantee better items with increased legendary chances</p>
            <p>• All summoned items are minted as NFTs on the Ronin Network</p>
            <p>• Items can be equipped, traded on the marketplace, or enchanted</p>
          </div>
        </div>

        {/* Gacha Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {gachaTiers.map((tier) => (
            <div
              key={tier.id}
              className="bg-slate-800/50 border-2 border-purple-500/30 rounded-lg p-6 hover:border-purple-400 transition-all hover:scale-105"
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{tier.icon}</div>
                <h3 className="text-2xl font-bold text-amber-400 mb-2">{tier.name}</h3>
                <p className="text-slate-300 text-sm mb-4">{tier.description}</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                <p className="text-xs text-slate-400 mb-2">Drop Rates:</p>
                <p className="text-sm text-purple-300">{tier.rarityChance}</p>
              </div>

              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-yellow-400">
                  {tier.cost.gold && `💰 ${tier.cost.gold}`}
                  {tier.cost.premium && `💎 ${tier.cost.premium}`}
                </div>
              </div>

              <button
                onClick={() => performSummon(tier.id)}
                disabled={
                  summoning || 
                  !user ||
                  (tier.cost.gold ? user.gold < tier.cost.gold : false) ||
                  (tier.cost.premium ? user.premium < tier.cost.premium : false)
                }
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                {!user ? 'Connect Wallet' :
                 (tier.cost.gold && user.gold < tier.cost.gold) || 
                 (tier.cost.premium && user.premium < tier.cost.premium) 
                   ? 'Insufficient Funds' 
                   : 'Summon'}
              </button>
            </div>
          ))}
        </div>

        {/* History */}
        <div className="bg-slate-800/50 border-2 border-purple-500/30 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-amber-400 mb-4">📜 Recent Summons</h3>
          <div className="space-y-2 text-slate-400 text-center py-8">
            <p>No summons yet. Try your luck!</p>
          </div>
        </div>

        {/* Summon Animation Modal */}
        {summonAnimation && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-9xl mb-6 animate-bounce">✨</div>
              <div className="text-3xl font-bold text-purple-300 animate-pulse">
                Summoning...
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Summon Result Modal */}
        {summonResult && summonResult.item && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border-4 rounded-lg p-8 max-w-md w-full relative overflow-hidden"
                 style={{borderColor: `var(--rarity-color-${summonResult.item.rarity})`}}>
              {/* Background glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${getRarityColor(summonResult.item.rarity)} opacity-10 animate-pulse`}></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-center mb-6 text-amber-400">
                  🎉 Summon Result!
                </h2>

                {/* Item Display */}
                <div className={`bg-gradient-to-br ${getRarityColor(summonResult.item.rarity)} rounded-lg p-1 mb-6 shadow-2xl ${getRarityGlow(summonResult.item.rarity)}`}>
                  <div className="bg-slate-900 rounded-lg p-6">
                    <div className="text-center mb-4">
                      <div className="text-7xl mb-4">
                        {summonResult.item.itemType === 'weapon' ? '⚔️' :
                         summonResult.item.itemType === 'armor' ? '🛡️' :
                         summonResult.item.itemType === 'accessory' ? '💍' : '✨'}
                      </div>
                      <h3 className="text-2xl font-bold text-amber-400 mb-2">
                        {summonResult.item.name}
                      </h3>
                      <p className={`text-xl font-bold ${
                        summonResult.item.rarity === 0 ? 'text-gray-400' :
                        summonResult.item.rarity === 1 ? 'text-green-400' :
                        summonResult.item.rarity === 2 ? 'text-blue-400' :
                        summonResult.item.rarity === 3 ? 'text-purple-400' :
                        summonResult.item.rarity === 4 ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        ⭐ {RARITY_NAMES[summonResult.item.rarity]}
                      </p>
                    </div>

                    {/* Stats */}
                    {summonResult.item.stats && Object.keys(summonResult.item.stats).length > 0 && (
                      <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-2">Item Stats:</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {summonResult.item.stats.str && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">STR:</span>
                              <span className="text-red-400 font-bold">+{summonResult.item.stats.str}</span>
                            </div>
                          )}
                          {summonResult.item.stats.agi && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">AGI:</span>
                              <span className="text-green-400 font-bold">+{summonResult.item.stats.agi}</span>
                            </div>
                          )}
                          {summonResult.item.stats.int && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">INT:</span>
                              <span className="text-blue-400 font-bold">+{summonResult.item.stats.int}</span>
                            </div>
                          )}
                          {summonResult.item.stats.luk && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">LUK:</span>
                              <span className="text-yellow-400 font-bold">+{summonResult.item.stats.luk}</span>
                            </div>
                          )}
                          {summonResult.item.stats.vit && (
                            <div className="flex justify-between col-span-2">
                              <span className="text-slate-400">VIT:</span>
                              <span className="text-purple-400 font-bold">+{summonResult.item.stats.vit}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="bg-green-900/30 border border-green-500 rounded-lg p-3 mb-4">
                      <p className="text-green-200 text-sm text-center">
                        ✓ NFT Token #{summonResult.item.tokenId} minted successfully!
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeSummonResult}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Claim Reward
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
