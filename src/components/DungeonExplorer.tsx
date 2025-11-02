'use client'

import { useState, useEffect } from 'react'
import { useGameState } from '@/hooks/useGameState'

interface DungeonEvent {
  type: 'treasure' | 'combat' | 'trap' | 'boss' | 'rest' | 'merchant'
  title: string
  description: string
  rewards?: {
    gold?: number
    exp?: number
    item?: string
  }
  damage?: number
}

interface Dungeon {
  _id: string
  name: string
  difficulty: string
  minLevel: number
  description: string
  floors: number
  rewards: {
    goldMin: number
    goldMax: number
    expMin: number
    expMax: number
  }
}

export default function DungeonExplorer() {
  const { selectedCharacter, user, updateCurrency } = useGameState()
  const [dungeons, setDungeons] = useState<Dungeon[]>([])
  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon | null>(null)
  const [currentFloor, setCurrentFloor] = useState(0)
  const [currentEvent, setCurrentEvent] = useState<DungeonEvent | null>(null)
  const [isExploring, setIsExploring] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dungeonLog, setDungeonLog] = useState<string[]>([])

  useEffect(() => {
    fetchDungeons()
  }, [])

  const fetchDungeons = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dungeon/list`)
      const data = await response.json()
      
      // Ensure data is always an array
      if (Array.isArray(data)) {
        setDungeons(data)
      } else if (data.success && Array.isArray(data.dungeons)) {
        setDungeons(data.dungeons)
      } else {
        setDungeons([])
      }
    } catch (error) {
      console.error('Failed to fetch dungeons:', error)
      setDungeons([])
    }
  }

  const enterDungeon = async (dungeon: Dungeon) => {
    if (!selectedCharacter) {
      alert('Please select a character first!')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dungeon/${dungeon._id}/enter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          characterTokenId: selectedCharacter.tokenId,
          walletAddress: user?.walletAddress 
        })
      })

      const data = await response.json()
      setSelectedDungeon(dungeon)
      setCurrentFloor(1)
      setCurrentEvent(data.event)
      setIsExploring(true)
      setDungeonLog([`Entered ${dungeon.name}...`])
    } catch (error) {
      console.error('Failed to enter dungeon:', error)
      alert('Failed to enter dungeon. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEventAction = async (action: 'fight' | 'flee' | 'loot' | 'rest') => {
    if (!currentEvent || !selectedDungeon || !selectedCharacter) return

    setLoading(true)
    const newLog = [...dungeonLog]

    // Simulate event resolution
    if (currentEvent.type === 'combat' || currentEvent.type === 'boss') {
      if (action === 'fight') {
        const damage = Math.floor(Math.random() * 20) + 10
        const goldReward = Math.floor(Math.random() * 50) + 20
        const expReward = Math.floor(Math.random() * 100) + 50

        newLog.push(`⚔️ You defeated the enemy! (Took ${damage} damage)`)
        newLog.push(`💰 +${goldReward} Gold, ⭐ +${expReward} EXP`)
        
        updateCurrency(goldReward, 0, 0)
      } else if (action === 'flee') {
        newLog.push(`🏃 You fled from combat!`)
      }
    } else if (currentEvent.type === 'treasure' && action === 'loot') {
      const goldReward = currentEvent.rewards?.gold || 100
      newLog.push(`💎 You found a treasure chest!`)
      newLog.push(`💰 +${goldReward} Gold`)
      updateCurrency(goldReward, 0, 0)
    } else if (currentEvent.type === 'rest' && action === 'rest') {
      newLog.push(`❤️ You rested and recovered HP`)
    }

    setDungeonLog(newLog)

    // Progress to next floor
    if (currentFloor < selectedDungeon.floors) {
      setTimeout(() => {
        setCurrentFloor(currentFloor + 1)
        generateRandomEvent()
      }, 1500)
    } else {
      // Dungeon complete
      setTimeout(() => {
        completeDungeon()
      }, 1500)
    }

    setLoading(false)
  }

  const generateRandomEvent = () => {
    const eventTypes: DungeonEvent['type'][] = ['treasure', 'combat', 'trap', 'rest', 'merchant']
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

    const events: Record<string, DungeonEvent> = {
      treasure: {
        type: 'treasure',
        title: '💎 Treasure Chest Found!',
        description: 'You discovered a shining treasure chest!',
        rewards: { gold: Math.floor(Math.random() * 100) + 50 }
      },
      combat: {
        type: 'combat',
        title: '⚔️ Enemy Encounter!',
        description: 'A wild monster blocks your path!',
        damage: Math.floor(Math.random() * 20) + 10
      },
      trap: {
        type: 'trap',
        title: '🪤 Trap Triggered!',
        description: 'You stepped on a pressure plate!',
        damage: Math.floor(Math.random() * 15) + 5
      },
      rest: {
        type: 'rest',
        title: '🛌 Safe Room',
        description: 'A peaceful area to rest and recover.',
      },
      merchant: {
        type: 'merchant',
        title: '🏪 Wandering Merchant',
        description: 'A mysterious merchant offers their wares.',
      }
    }

    setCurrentEvent(events[randomType])
  }

  const completeDungeon = async () => {
    if (!selectedDungeon || !selectedCharacter || !user) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dungeon/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dungeonId: selectedDungeon._id,
          walletAddress: user.walletAddress,
          floorsCompleted: selectedDungeon.floors
        })
      })

      const data = await response.json()
      
      setDungeonLog([
        ...dungeonLog,
        ``,
        `🎉 DUNGEON CLEARED!`,
        `💰 Total Gold: +${data.rewards.gold}`,
        `⭐ Total EXP: +${data.rewards.exp}`,
        data.rewards.item ? `🎁 Item Drop: ${data.rewards.item}` : ''
      ])

      updateCurrency(data.rewards.gold, 0, 0)
      
      setTimeout(() => {
        exitDungeon()
      }, 3000)
    } catch (error) {
      console.error('Failed to complete dungeon:', error)
    }
  }

  const exitDungeon = () => {
    setSelectedDungeon(null)
    setCurrentFloor(0)
    setCurrentEvent(null)
    setIsExploring(false)
    setDungeonLog([])
  }

  if (!isExploring) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-amber-400 mb-8 text-center">
            🏰 Dungeon Explorer
          </h1>

          {!selectedCharacter && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6 text-center">
              <p className="text-red-200">⚠️ Please select a character from your dashboard first!</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(dungeons) && dungeons.map((dungeon) => (
              <div
                key={dungeon._id}
                className="bg-slate-800/50 border-2 border-purple-500/30 rounded-lg p-6 hover:border-purple-400 transition-all hover:scale-105"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-amber-400">{dungeon.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    dungeon.difficulty === 'Easy' ? 'bg-green-600' :
                    dungeon.difficulty === 'Medium' ? 'bg-yellow-600' :
                    dungeon.difficulty === 'Hard' ? 'bg-red-600' : 'bg-purple-600'
                  }`}>
                    {dungeon.difficulty}
                  </span>
                </div>

                <p className="text-slate-300 text-sm mb-4">{dungeon.description}</p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min Level:</span>
                    <span className="text-amber-400 font-semibold">{dungeon.minLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Floors:</span>
                    <span className="text-purple-400 font-semibold">{dungeon.floors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gold Reward:</span>
                    <span className="text-yellow-400 font-semibold">
                      {dungeon.rewards.goldMin} - {dungeon.rewards.goldMax}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">EXP Reward:</span>
                    <span className="text-blue-400 font-semibold">
                      {dungeon.rewards.expMin} - {dungeon.rewards.expMax}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => enterDungeon(dungeon)}
                  disabled={!selectedCharacter || (selectedCharacter?.level || 1) < dungeon.minLevel}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  {(selectedCharacter?.level || 1) < dungeon.minLevel ? 'Level Too Low' : 'Enter Dungeon'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Exploring view
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/80 border-2 border-purple-500 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-amber-400">{selectedDungeon?.name}</h2>
            <button
              onClick={exitDungeon}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Exit Dungeon
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 bg-slate-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all"
                style={{ width: `${(currentFloor / (selectedDungeon?.floors || 1)) * 100}%` }}
              />
            </div>
            <span className="text-purple-300 font-semibold">
              Floor {currentFloor} / {selectedDungeon?.floors}
            </span>
          </div>
        </div>

        {/* Current Event */}
        {currentEvent && (
          <div className="bg-slate-800/80 border-2 border-amber-500 rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-bold text-amber-400 mb-3">{currentEvent.title}</h3>
            <p className="text-slate-300 mb-6">{currentEvent.description}</p>

            <div className="flex gap-4 justify-center">
              {currentEvent.type === 'combat' && (
                <>
                  <button
                    onClick={() => handleEventAction('fight')}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    ⚔️ Fight
                  </button>
                  <button
                    onClick={() => handleEventAction('flee')}
                    disabled={loading}
                    className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    🏃 Flee
                  </button>
                </>
              )}

              {currentEvent.type === 'boss' && (
                <button
                  onClick={() => handleEventAction('fight')}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
                >
                  ⚔️ Fight Boss
                </button>
              )}

              {currentEvent.type === 'treasure' && (
                <button
                  onClick={() => handleEventAction('loot')}
                  disabled={loading}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  💰 Loot
                </button>
              )}

              {currentEvent.type === 'rest' && (
                <button
                  onClick={() => handleEventAction('rest')}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  🛌 Rest
                </button>
              )}

              {currentEvent.type === 'trap' && (
                <button
                  onClick={() => handleEventAction('fight')}
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  🪤 Disarm Trap
                </button>
              )}

              {currentEvent.type === 'merchant' && (
                <button
                  onClick={() => handleEventAction('fight')}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  🏪 Continue
                </button>
              )}
            </div>
          </div>
        )}

        {/* Event Log */}
        <div className="bg-slate-800/80 border-2 border-slate-600 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-400 mb-4">📜 Event Log</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Array.isArray(dungeonLog) && dungeonLog.map((log, index) => (
              <p key={index} className="text-slate-300 text-sm font-mono">
                {log}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
