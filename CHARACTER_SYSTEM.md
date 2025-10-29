# 🎭 Character System Design

## Overview
Aeloria uses a dual character system: **Starter Characters** (non-NFT, account-bound) and **Gacha Characters** (NFT, tradeable).

---

## Character Types

### 1. Starter Character
- **Class**: Warrior (fixed)
- **Name**: "Starter Warrior"
- **Acquisition**: Automatically created upon account registration
- **Properties**:
  - `isNFT`: `false`
  - `isBoundToAccount`: `true`
  - `tokenId`: `null`
- **Restrictions**:
  - ❌ Cannot mint as NFT
  - ❌ Cannot transfer to other wallets
  - ❌ Cannot sell on marketplace
  - ❌ Cannot delete
- **Usage**: Available for all game activities (dungeons, PvP, quests)

### 2. Gacha Characters (NFT)
- **Classes**: Warrior, Mage, Archer, Rogue, Cleric, Paladin (random)
- **Name**: `{Rarity} {ClassName}` (e.g., "Epic Mage")
- **Acquisition**: Gacha summon system
- **Properties**:
  - `isNFT`: `true`
  - `isBoundToAccount`: `false` (initially)
  - `tokenId`: Unique NFT token ID
- **States**:
  - **In Wallet**: `isBoundToAccount = false` - Can be traded/sold
  - **In-Game**: `isBoundToAccount = true` - Bound to account, usable in game

---

## Character Display Tabs

### Tab 1: In-Game Characters
**Filter**: `isBoundToAccount = true`

Shows:
- ✅ Starter Warrior
- ✅ Imported NFT characters

These characters can:
- Enter dungeons
- Participate in PvP
- Complete quests
- Equip items

### Tab 2: Wallet Characters
**Filter**: `isNFT = true AND isBoundToAccount = false`

Shows:
- ✅ NFT characters in wallet (not yet imported)

These characters can:
- Be traded on marketplace
- Be transferred to other wallets
- Be imported to game (becomes bound)

---

## API Endpoints

### Get Characters
```http
GET /api/characters/:walletAddress?filter={ingame|wallet|all}
```

**Query Parameters:**
- `filter=ingame` - Get bound characters (usable in game)
- `filter=wallet` - Get NFT characters in wallet (not bound)
- `filter=all` or omit - Get all characters

**Response:**
```json
{
  "success": true,
  "characters": [...],
  "counts": {
    "total": 5,
    "ingame": 3,
    "wallet": 2
  }
}
```

### Create Starter Character
```http
POST /api/characters/create-starter
Body: { "walletAddress": "0x..." }
```

Called automatically when user registers. Cannot create duplicate.

### Gacha Summon (Creates NFT Character)
```http
POST /api/gacha/summon
Body: { 
  "walletAddress": "0x...", 
  "summonType": "basic|premium|legendary" 
}
```

**Summon Types:**
- **Basic** (1000 Gold): Common-Rare characters
- **Premium** (100 Premium): Uncommon-Legendary characters
- **Legendary** (10 AETH): Epic-Mythic characters

**Returns:**
```json
{
  "success": true,
  "result": {
    "rarity": "Epic",
    "characterClass": "Mage",
    "tokenId": 1234567890,
    "message": "You summoned a Epic Mage!",
    "character": { ... }
  },
  "user": { ... }
}
```

### Import NFT to Game
```http
POST /api/characters/import-nft
Body: { "walletAddress": "0x...", "tokenId": 123 }
```

Moves NFT character from wallet to in-game (binds to account).

**Effects:**
- `isBoundToAccount`: `false` → `true`
- Character becomes usable in game
- Character can no longer be traded

---

## Character Stats by Rarity

| Rarity    | Stat Bonus | Total Stats Boost |
|-----------|------------|-------------------|
| Common    | +0         | Base stats        |
| Uncommon  | +2         | +12 total         |
| Rare      | +5         | +30 total         |
| Epic      | +10        | +60 total         |
| Legendary | +20        | +120 total        |
| Mythic    | +30        | +180 total        |

*Bonus applies to all stats: STR, AGI, INT, LUK, VIT, HP (+2x bonus)*

---

## Character Classes

| Class   | Base HP | STR | AGI | INT | LUK | VIT | Role        |
|---------|---------|-----|-----|-----|-----|-----|-------------|
| Warrior | 150     | 15  | 8   | 5   | 7   | 12  | Tank/DPS    |
| Mage    | 80      | 5   | 7   | 18  | 10  | 6   | Magic DPS   |
| Archer  | 100     | 8   | 16  | 7   | 12  | 8   | Physical DPS|
| Rogue   | 90      | 10  | 17  | 6   | 15  | 7   | Crit DPS    |
| Cleric  | 110     | 6   | 8   | 15  | 9   | 11  | Support     |
| Paladin | 140     | 12  | 9   | 10  | 8   | 13  | Hybrid      |

---

## User Flow

### New Player
1. Connect wallet
2. Register account → **Starter Warrior created automatically**
3. Can start playing immediately with starter character

### Gacha Summon
1. Click "Gacha" menu
2. Choose summon type (Basic/Premium/Legendary)
3. Confirm cost deduction
4. Receive NFT character → **Goes to "Wallet" tab**
5. Character is not yet usable in game

### Import to Game
1. Go to "Characters" page → "Wallet" tab
2. Select NFT character
3. Click "Import to Game"
4. Character moves to "In-Game" tab
5. Character now usable in all game features

### Selling Character
1. Only NFT characters in "Wallet" tab can be sold
2. List on marketplace
3. Transfer ownership on purchase
4. Buyer receives character in their wallet

---

## Database Schema

```typescript
interface ICharacter {
  walletAddress: string;
  characterName: string;
  characterClass: 0-5; // Warrior, Mage, Archer, Rogue, Cleric, Paladin
  level: number; // 1-100
  exp: number;
  hp: number;
  maxHp: number;
  str: number;
  agi: number;
  int: number;
  luk: number;
  vit: number;
  
  // NFT data
  tokenId?: number; // null for starter
  isNFT: boolean; // false for starter, true for gacha
  isBoundToAccount: boolean; // true = in-game, false = wallet
  
  // Equipment
  equippedWeapon?: number;
  equippedArmor?: number;
  equippedAccessory?: number;
  
  lastAdventureTime: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Business Logic Rules

### Starter Character
- ✅ Created on registration
- ✅ Always exists (one per account)
- ✅ Always bound to account
- ❌ Cannot be deleted
- ❌ Cannot be traded
- ❌ Cannot be minted as NFT

### NFT Characters
- ✅ Created from gacha
- ✅ Start in wallet (unbound)
- ✅ Can be traded while unbound
- ✅ Can be imported to game (becomes bound)
- ❌ Cannot unbind after importing
- ❌ Cannot delete if bound

---

## Frontend Components

### CharacterList Component
```tsx
<Tabs>
  <Tab label="In-Game">
    {/* Show isBoundToAccount = true */}
    <CharacterCard character={starter} canDelete={false} />
    <CharacterCard character={importedNFT} canDelete={false} />
  </Tab>
  
  <Tab label="Wallet">
    {/* Show isNFT = true AND isBoundToAccount = false */}
    <CharacterCard character={nftChar} canImport={true} canTrade={true} />
  </Tab>
</Tabs>
```

### Gacha Result
```tsx
<GachaResult>
  <h2>You got: {rarity} {className}!</h2>
  <p>Character added to your Wallet</p>
  <Button onClick={goToWallet}>View in Wallet</Button>
</GachaResult>
```

---

## Smart Contract Integration (Future)

When NFTs are actually minted on blockchain:

1. **Gacha Summon**:
   - Call `CharacterNFT.mint(walletAddress, class, rarity)`
   - Get `tokenId` from event
   - Store in database with `isNFT = true`

2. **Import to Game**:
   - Verify ownership: `CharacterNFT.ownerOf(tokenId) == walletAddress`
   - Set `isBoundToAccount = true` in database
   - Optionally: Lock NFT in game contract (cannot transfer)

3. **Marketplace**:
   - Only list if `isNFT = true AND isBoundToAccount = false`
   - Transfer NFT on purchase
   - Update `walletAddress` in database

---

**This system allows both free-to-play (starter) and play-to-earn (NFT) experiences!** 🎮✨
