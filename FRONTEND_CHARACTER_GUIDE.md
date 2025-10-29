# 🎭 Frontend Character Page Guide

## ❌ สิ่งที่ไม่ควรมี

### ไม่ต้องมีปุ่ม "Create Your Character"
เพราะ:
- Starter Warrior ถูกสร้างอัตโนมัติตอน register แล้ว
- ตัวละครอื่นๆ ได้จาก Gacha เท่านั้น
- ผู้เล่นไม่ได้เลือกคลาสเอง (สุ่มจาก Gacha)

---

## ✅ หน้า Characters ควรมี

### Layout Structure

```tsx
<div className="characters-page">
  <header>
    <h1>My Characters</h1>
    <button onClick={goToGacha}>🎲 Summon New Character</button>
  </header>

  <Tabs>
    <Tab label="In-Game" count={ingameCount}>
      {/* ตัวละครที่ใช้ในเกมได้ */}
    </Tab>
    
    <Tab label="Wallet" count={walletCount}>
      {/* NFT ที่ยังไม่ได้ import */}
    </Tab>
  </Tabs>
</div>
```

---

## 📱 Character Tabs

### Tab 1: In-Game Characters

**API Call:**
```typescript
const { data } = await fetch(`/api/characters/${walletAddress}?filter=ingame`)
```

**Display:**
```tsx
<div className="character-grid">
  {characters.map(char => (
    <CharacterCard
      key={char._id}
      character={char}
      isStarter={!char.isNFT}
      actions={
        <div>
          <button onClick={() => selectCharacter(char)}>
            {selectedId === char._id ? '✓ Selected' : 'Select'}
          </button>
          <button onClick={() => viewDetails(char)}>Details</button>
        </div>
      }
    />
  ))}
</div>
```

**Character Card:**
- Show character name, class, level
- Show stats (STR, AGI, INT, LUK, VIT)
- Show HP bar
- Show "STARTER" badge if `!isNFT`
- Show "NFT" badge if `isNFT`
- Cannot delete starter character
- Cannot unbind imported NFT characters

---

### Tab 2: Wallet Characters

**API Call:**
```typescript
const { data } = await fetch(`/api/characters/${walletAddress}?filter=wallet`)
```

**Display:**
```tsx
<div className="character-grid">
  {characters.length === 0 ? (
    <EmptyState>
      <p>No characters in wallet</p>
      <button onClick={goToGacha}>Summon from Gacha</button>
    </EmptyState>
  ) : (
    characters.map(char => (
      <CharacterCard
        key={char._id}
        character={char}
        actions={
          <div>
            <button onClick={() => importToGame(char.tokenId)}>
              Import to Game
            </button>
            <button onClick={() => listOnMarketplace(char.tokenId)}>
              Sell on Marketplace
            </button>
            <button onClick={() => viewDetails(char)}>Details</button>
          </div>
        }
      />
    ))
  )}
</div>
```

---

## 🎮 Character Actions

### In-Game Tab Actions

#### 1. Select Character
```typescript
const selectCharacter = (character: Character) => {
  setSelectedCharacterId(character._id)
  // Save to localStorage or global state
}
```

#### 2. View Details
```typescript
const viewDetails = (character: Character) => {
  setDetailModal({
    open: true,
    character: character
  })
}
```

#### 3. Use in Game
```typescript
// เมื่อเข้า Dungeon, PvP, etc.
const enterDungeon = () => {
  if (!selectedCharacterId) {
    alert('Please select a character first')
    return
  }
  // Proceed with selected character
}
```

---

### Wallet Tab Actions

#### 1. Import to Game
```typescript
const importToGame = async (tokenId: number) => {
  try {
    const res = await fetch('/api/characters/import-nft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, tokenId })
    })
    
    if (res.ok) {
      toast.success('Character imported to game!')
      refetchCharacters()
    }
  } catch (error) {
    toast.error('Failed to import character')
  }
}
```

**Confirmation Modal:**
```tsx
<ConfirmModal
  title="Import Character to Game?"
  message="This character will be bound to your account and cannot be traded after import."
  onConfirm={() => importToGame(tokenId)}
>
  <CharacterPreview character={character} />
  <p>⚠️ Warning: This action is permanent!</p>
</ConfirmModal>
```

#### 2. List on Marketplace
```typescript
const listOnMarketplace = (tokenId: number) => {
  // Navigate to marketplace listing page
  router.push(`/marketplace/list?tokenId=${tokenId}&type=character`)
}
```

#### 3. Transfer/Gift
```typescript
const transferCharacter = async (tokenId: number, toAddress: string) => {
  // Call smart contract transfer function
  const tx = await characterContract.transferFrom(walletAddress, toAddress, tokenId)
  await tx.wait()
  
  // Update database
  // Refetch characters
}
```

---

## 🎨 UI Components

### CharacterCard Component

```tsx
interface CharacterCardProps {
  character: Character
  isStarter?: boolean
  actions?: React.ReactNode
}

export function CharacterCard({ character, isStarter, actions }: CharacterCardProps) {
  const classColors = {
    0: 'border-red-500',    // Warrior
    1: 'border-blue-500',   // Mage
    2: 'border-green-500',  // Archer
    3: 'border-purple-500', // Rogue
    4: 'border-yellow-500', // Cleric
    5: 'border-cyan-500',   // Paladin
  }

  return (
    <div className={`character-card ${classColors[character.characterClass]}`}>
      {/* Header */}
      <div className="card-header">
        <h3>{character.characterName}</h3>
        <div className="badges">
          {isStarter && <span className="badge-starter">STARTER</span>}
          {character.isNFT && <span className="badge-nft">NFT</span>}
        </div>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="level">Lv. {character.level}</div>
        <div className="hp-bar">
          <span>{character.hp} / {character.maxHp}</span>
          <div className="bar" style={{ width: `${(character.hp / character.maxHp) * 100}%` }} />
        </div>
      </div>

      {/* Attributes */}
      <div className="attributes">
        <span>STR: {character.str}</span>
        <span>AGI: {character.agi}</span>
        <span>INT: {character.int}</span>
        <span>LUK: {character.luk}</span>
        <span>VIT: {character.vit}</span>
      </div>

      {/* Actions */}
      {actions && <div className="card-actions">{actions}</div>}
    </div>
  )
}
```

---

### EmptyState Component

```tsx
export function EmptyState({ tab }: { tab: 'ingame' | 'wallet' }) {
  if (tab === 'ingame') {
    return (
      <div className="empty-state">
        <p>🎮 You only have your Starter Warrior</p>
        <p>Summon more characters from Gacha!</p>
        <button onClick={goToGacha}>Go to Gacha</button>
      </div>
    )
  }

  return (
    <div className="empty-state">
      <p>📦 No characters in wallet</p>
      <p>Summon characters from Gacha to add them here</p>
      <button onClick={goToGacha}>Go to Gacha</button>
    </div>
  )
}
```

---

## 📊 State Management

### Character Context/Store

```typescript
interface CharacterStore {
  characters: Character[]
  selectedCharacterId: string | null
  filter: 'ingame' | 'wallet' | 'all'
  
  fetchCharacters: (walletAddress: string, filter: string) => Promise<void>
  selectCharacter: (id: string) => void
  importCharacter: (tokenId: number) => Promise<void>
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  characters: [],
  selectedCharacterId: null,
  filter: 'ingame',
  
  fetchCharacters: async (walletAddress, filter) => {
    const res = await fetch(`/api/characters/${walletAddress}?filter=${filter}`)
    const data = await res.json()
    set({ characters: data.characters })
  },
  
  selectCharacter: (id) => {
    set({ selectedCharacterId: id })
    localStorage.setItem('selectedCharacter', id)
  },
  
  importCharacter: async (tokenId) => {
    const res = await fetch('/api/characters/import-nft', {
      method: 'POST',
      body: JSON.stringify({ walletAddress: get().walletAddress, tokenId })
    })
    if (res.ok) {
      await get().fetchCharacters(get().walletAddress, 'ingame')
    }
  }
}))
```

---

## 🔄 User Flows

### New Player First Visit
1. Register → Starter Warrior created automatically
2. Land on Characters page → See Starter Warrior in "In-Game" tab
3. See prompt: "Summon more characters from Gacha!"

### After Gacha Summon
1. Complete gacha summon
2. Show result: "Epic Mage added to Wallet!"
3. Button: "Go to Characters" → Navigate to Wallet tab
4. See new character with "Import to Game" button

### Importing Character
1. Click "Import to Game" on Wallet character
2. Confirmation modal appears
3. Confirm → Character moves to In-Game tab
4. Toast: "Character imported successfully!"

### Using Character in Game
1. Select character from In-Game tab
2. Navigate to Dungeon/PvP/Quest
3. Selected character is used automatically
4. Gain EXP → Character levels up

---

## ⚠️ Important Notes

### DO NOT:
- ❌ Show "Create Character" button
- ❌ Show class selection modal
- ❌ Allow creating characters manually
- ❌ Allow deleting starter character
- ❌ Allow unbinding imported characters

### DO:
- ✅ Show "Summon from Gacha" as primary CTA
- ✅ Clearly separate In-Game vs Wallet tabs
- ✅ Show warning before importing (permanent action)
- ✅ Display starter character badge
- ✅ Allow selling only unbound NFT characters

---

## 🎯 Example Page Structure

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { CharacterCard } from '@/components/CharacterCard'

export default function CharactersPage() {
  const { address } = useWallet()
  const [tab, setTab] = useState<'ingame' | 'wallet'>('ingame')
  const [characters, setCharacters] = useState([])

  useEffect(() => {
    if (address) {
      fetchCharacters()
    }
  }, [address, tab])

  const fetchCharacters = async () => {
    const res = await fetch(`/api/characters/${address}?filter=${tab}`)
    const data = await res.json()
    setCharacters(data.characters)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold">My Characters</h1>
        <button
          onClick={() => router.push('/gacha')}
          className="btn-primary"
        >
          🎲 Summon Character
        </button>
      </header>

      <div className="tabs mb-8">
        <button
          onClick={() => setTab('ingame')}
          className={tab === 'ingame' ? 'active' : ''}
        >
          In-Game
        </button>
        <button
          onClick={() => setTab('wallet')}
          className={tab === 'wallet' ? 'active' : ''}
        >
          Wallet
        </button>
      </div>

      <div className="character-grid">
        {characters.map(char => (
          <CharacterCard
            key={char._id}
            character={char}
            isStarter={!char.isNFT}
            actions={
              tab === 'ingame' ? (
                <button onClick={() => selectCharacter(char._id)}>
                  Select
                </button>
              ) : (
                <>
                  <button onClick={() => importCharacter(char.tokenId)}>
                    Import to Game
                  </button>
                  <button onClick={() => listOnMarketplace(char.tokenId)}>
                    Sell
                  </button>
                </>
              )
            }
          />
        ))}
      </div>
    </div>
  )
}
```

---

**สรุป: หน้า Characters ไม่มีปุ่ม "Create" แต่มีปุ่ม "Summon from Gacha" แทน!** 🎲✨
