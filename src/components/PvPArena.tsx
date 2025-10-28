'use client'

import { useState, useEffect } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { useWallet } from '@/hooks/useWallet'

interface Player {
  walletAddress: string
  username: string
  level: number
  character: {
    tokenId: number
    class: string
    stats: {
      str: number
      agi: number
      int: number
      luk: number
      vit: number
    }
  }
}

interface BattleRound {
  round: number
  attacker: string
  defender: string
  damage: number
  attackerHp: number
  defenderHp: number
  action: string
}

interface BattleResult {
  winner: string
  rounds: BattleRound[]
  rewards: {
    gold: number
    exp: number
    rankPoints: number
  }
}

interface Ranking {
  rank: number
  walletAddress: string
  username: string
  wins: number
  losses: number
  rankPoints: number
}

export default function PvPArena() {
  const { user, selectedCharacter, updateCurrency } = useGameState()
  const { address } = useWallet()
  const [opponents, setOpponents] = useState<Player[]>([])
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null)
  const [isBattling, setIsBattling] = useState(false)
  const [activeTab, setActiveTab] = useState<'arena' | 'rankings'>('arena')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOpponents()
    fetchRankings()
  }, [])

  const fetchOpponents = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pvp/opponents`)
      const data = await response.json()
      setOpponents(data)
    } catch (error) {
      console.error('Failed to fetch opponents:', error)
    }
  }

  const fetchRankings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pvp/rankings`)
      const data = await response.json()
      setRankings(data)
    } catch (error) {
      console.error('Failed to fetch rankings:', error)
    }
  }

  const startBattle = async (opponent: Player) => {
    if (!selectedCharacter || !user) {
      alert('Please select a character first!')
      return
    }

    setLoading(true)
    setIsBattling(true)
    setBattleResult(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pvp/battle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attackerWallet: user.walletAddress,
          attackerTokenId: selectedCharacter.tokenId,
          defenderWallet: opponent.walletAddress,
          defenderTokenId: opponent.character.tokenId
        })
      })

      const result: BattleResult = await response.json()
      
      // Simulate battle animation
      await simulateBattle(result)
      
      // Update currency if won
      if (result.winner === user.walletAddress) {
        updateCurrency(result.rewards.gold, 0, 0)
      }

      setBattleResult(result)
      fetchRankings()
    } catch (error) {
      console.error('Failed to start battle:', error)
      alert('Battle failed. Please try again.')
      setIsBattling(false)
    } finally {
      setLoading(false)
    }
  }

  const simulateBattle = async (result: BattleResult) => {
    // Show each round with delay for animation effect
    for (const round of result.rounds) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Could trigger animations here
    }
  }

  const closeBattle = () => {
    setIsBattling(false)
    setBattleResult(null)
  }

  const getClassIcon = (className: string) => {
    const icons: Record<string, string> = {
      'Warrior': '⚔️',
      'Mage': '🔮',
      'Archer': '🏹',
      'Rogue': '🗡️',
      'Cleric': '✨',
      'Paladin': '🛡️'
    }
    return icons[className] || '⚔️'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-red-400 mb-8 text-center">⚔️ PvP Arena</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setActiveTab('arena')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'arena'
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            ⚔️ Battle Arena
          </button>
          <button
            onClick={() => setActiveTab('rankings')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'rankings'
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            🏆 Rankings
          </button>
        </div>

        {/* Arena Tab */}
        {activeTab === 'arena' && (
          <div>
            {!selectedCharacter && (
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6 text-center">
                <p className="text-red-200">⚠️ Please select a character from your dashboard first!</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opponents.map((opponent, index) => (
                <div
                  key={opponent.walletAddress}
                  className="bg-slate-800/50 border-2 border-red-500/30 rounded-lg p-6 hover:border-red-400 transition-all hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-amber-400">
                      {opponent.username || `Player ${index + 1}`}
                    </h3>
                    <span className="text-4xl">{getClassIcon(opponent.character.class)}</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400">Level:</span>
                      <span className="text-purple-400 font-bold">{opponent.level}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400">Class:</span>
                      <span className="text-blue-400 font-semibold">{opponent.character.class}</span>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">STR:</span>
                        <span className="text-red-400 font-semibold">{opponent.character.stats.str}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">AGI:</span>
                        <span className="text-green-400 font-semibold">{opponent.character.stats.agi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">INT:</span>
                        <span className="text-blue-400 font-semibold">{opponent.character.stats.int}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">LUK:</span>
                        <span className="text-yellow-400 font-semibold">{opponent.character.stats.luk}</span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span className="text-slate-400">VIT:</span>
                        <span className="text-purple-400 font-semibold">{opponent.character.stats.vit}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => startBattle(opponent)}
                    disabled={!selectedCharacter || loading}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all"
                  >
                    ⚔️ Challenge
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rankings Tab */}
        {activeTab === 'rankings' && (
          <div className="bg-slate-800/50 border-2 border-red-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-amber-400 mb-6">🏆 Top Warriors</h2>
            
            <div className="space-y-3">
              {rankings.map((player) => (
                <div
                  key={player.walletAddress}
                  className={`bg-slate-700/50 border-2 rounded-lg p-4 flex items-center justify-between ${
                    player.rank === 1 ? 'border-yellow-500' :
                    player.rank === 2 ? 'border-slate-400' :
                    player.rank === 3 ? 'border-amber-700' :
                    'border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                      player.rank === 1 ? 'bg-yellow-500 text-yellow-900' :
                      player.rank === 2 ? 'bg-slate-400 text-slate-900' :
                      player.rank === 3 ? 'bg-amber-700 text-amber-100' :
                      'bg-slate-600 text-slate-300'
                    }`}>
                      #{player.rank}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-amber-400">
                        {player.username || `${player.walletAddress.slice(0, 6)}...${player.walletAddress.slice(-4)}`}
                      </h3>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-400">✓ {player.wins}W</span>
                        <span className="text-red-400">✗ {player.losses}L</span>
                        <span className="text-purple-400">
                          {player.wins + player.losses > 0 
                            ? `${((player.wins / (player.wins + player.losses)) * 100).toFixed(1)}%` 
                            : '0%'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">
                      {player.rankPoints}
                    </div>
                    <div className="text-xs text-slate-400">Rank Points</div>
                  </div>
                </div>
              ))}

              {rankings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400">No rankings yet. Be the first to compete!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Battle Modal */}
        {isBattling && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border-2 border-red-500 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-red-400 mb-6 text-center">⚔️ Battle in Progress</h2>

              {battleResult ? (
                <div>
                  {/* Battle Result */}
                  <div className={`text-center mb-6 p-6 rounded-lg ${
                    battleResult.winner === user?.walletAddress 
                      ? 'bg-green-900/30 border-2 border-green-500'
                      : 'bg-red-900/30 border-2 border-red-500'
                  }`}>
                    <h3 className="text-4xl font-bold mb-2">
                      {battleResult.winner === user?.walletAddress ? '🎉 VICTORY!' : '💀 DEFEAT'}
                    </h3>
                    {battleResult.winner === user?.walletAddress && (
                      <div className="space-y-1 text-lg">
                        <p className="text-yellow-400">💰 +{battleResult.rewards.gold} Gold</p>
                        <p className="text-blue-400">⭐ +{battleResult.rewards.exp} EXP</p>
                        <p className="text-purple-400">🏆 +{battleResult.rewards.rankPoints} Rank Points</p>
                      </div>
                    )}
                  </div>

                  {/* Round by Round */}
                  <div className="space-y-3 mb-6">
                    <h4 className="text-xl font-bold text-amber-400 mb-3">Battle Log</h4>
                    {battleResult.rounds.map((round, index) => (
                      <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-purple-400">Round {round.round}</span>
                          <span className="text-sm text-slate-400">{round.action}</span>
                        </div>
                        <p className="text-sm text-slate-300">
                          {round.attacker === user?.walletAddress ? '🗡️ You' : '🛡️ Opponent'} dealt{' '}
                          <span className="text-red-400 font-bold">{round.damage}</span> damage!
                        </p>
                        <div className="flex gap-4 mt-2 text-xs">
                          <span className="text-green-400">Your HP: {round.attackerHp}</span>
                          <span className="text-red-400">Enemy HP: {round.defenderHp}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={closeBattle}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="animate-pulse text-6xl mb-4">⚔️</div>
                  <p className="text-xl text-slate-300">Battle in progress...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
