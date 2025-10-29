# 🎮 Aeloria Game Design Document

## 📊 Core Game Loop

```
Player Workflow:
1. Connect Ronin Wallet → Register Account
2. Mint Character NFT (Choose Class)
3. Enter Town Hub
4. Select Activity:
   ├─ Dungeon Exploration → Earn Gold/EXP/Items
   ├─ PvP Battle → Earn Premium/Rank Up
   ├─ Quest Completion → Earn Rewards
   ├─ Marketplace Trading → Buy/Sell NFTs
   ├─ Gacha Summon → Get Rare Items
   └─ Guild Activities → Team Collaboration
5. Level Up & Enhance Equipment
6. Repeat
```

## 🎭 Character System

### Classes & Base Stats

| Class    | HP  | STR | AGI | INT | LUK | VIT | Role        |
|----------|-----|-----|-----|-----|-----|-----|-------------|
| Warrior  | 150 | 15  | 8   | 5   | 7   | 12  | Tank/DPS    |
| Mage     | 80  | 5   | 7   | 18  | 10  | 6   | Magic DPS   |
| Archer   | 100 | 8   | 16  | 7   | 12  | 8   | Physical DPS|
| Rogue    | 90  | 10  | 17  | 6   | 15  | 7   | Crit DPS    |
| Cleric   | 110 | 6   | 8   | 15  | 9   | 11  | Support     |
| Paladin  | 140 | 12  | 9   | 10  | 8   | 13  | Hybrid      |

### Passive Skills

#### Warrior - "Titan's Strength"
- +5 STR, +3 VIT
- Unlocks at Level 10
- Passive: 10% damage reduction

#### Mage - "Arcane Mastery"
- +7 INT, +2 LUK
- Unlocks at Level 10
- Passive: 15% magic damage boost

#### Archer - "Eagle Eye"
- +5 AGI, +4 LUK
- Unlocks at Level 10
- Passive: 20% critical chance

#### Rogue - "Shadow Step"
- +6 AGI, +3 LUK
- Unlocks at Level 10
- Passive: 25% evasion rate

#### Cleric - "Divine Blessing"
- +4 INT, +4 VIT, +1 LUK
- Unlocks at Level 10
- Passive: Auto-heal 5% HP per turn

#### Paladin - "Holy Guardian"
- +3 STR, +2 AGI, +2 INT, +3 VIT, +1 LUK
- Unlocks at Level 10
- Passive: 15% all damage reduction

### Leveling System

```javascript
// EXP Formula
expNeeded = currentLevel * 100

// Level Up Rewards
+2 STR
+2 AGI
+2 INT
+1 LUK
+2 VIT
+10 Max HP
Full HP Restore
```

Max Level: 100

## ⚔️ Combat System

### Damage Calculation

```javascript
// Base Power
basePower = (STR × 1.5) + (AGI × 1.2) + (INT × 1.3) + (LUK × 0.8)

// Attack Damage
damage = basePower × random(0.8, 1.2)

// Critical Hit (if LUK check passes)
if (random(0, 100) < LUK × 2) {
  damage *= 1.5
}
```

### Combat Flow (PvP/Boss)

1. Calculate both combatants' power
2. Roll random multiplier (0.8-1.2)
3. Check for critical hit (LUK-based)
4. Apply damage
5. Check for death
6. Next turn

## 🏰 Dungeon System

### Difficulty Levels

| Difficulty | Min Lvl | Floors | Gold Reward | EXP Reward | Drop Rate |
|------------|---------|--------|-------------|------------|-----------|
| Easy       | 1       | 3      | 50-100      | 20-50      | Common    |
| Normal     | 10      | 5      | 100-200     | 50-100     | Uncommon  |
| Hard       | 25      | 7      | 200-400     | 100-200    | Rare      |
| Expert     | 50      | 10     | 400-800     | 200-400    | Epic      |
| Hell       | 75      | 15     | 800-1500    | 400-800    | Legendary |

### Random Events

| Event Type    | Probability | Effect                           |
|---------------|-------------|----------------------------------|
| Treasure      | 20%         | +50% Gold                        |
| Trap          | 15%         | -20% HP                          |
| Monster Horde | 25%         | Battle 3 enemies                 |
| Merchant      | 10%         | Buy/Sell items                   |
| Healing Pool  | 15%         | Restore 30% HP                   |
| Boss Chamber  | 15%         | Mini-boss fight                  |

## 🎲 Item & Equipment System

### Item Types

1. **Weapon** - Increases STR, AGI
2. **Armor** - Increases VIT, HP
3. **Accessory** - Increases INT, LUK

### Rarity Tiers & Drop Rates

| Rarity    | Drop Rate | Stat Multiplier | Color Code |
|-----------|-----------|-----------------|------------|
| Common    | 60%       | 1x              | #FFFFFF    |
| Uncommon  | 25%       | 1.5x            | #00FF00    |
| Rare      | 10%       | 2x              | #0080FF    |
| Epic      | 3%        | 3x              | #9D00FF    |
| Legendary | 1.5%      | 5x              | #FF8000    |
| Mythic    | 0.5%      | 10x             | #FF00FF    |

### Enchant System

```
Enchant Level: 0 → +10
Cost per level: Level² × 100 Gold
Success Rate: 100% - (Level × 5%)

Each +1 enchant adds:
+2 to all stats
+5 HP
```

## 💰 Economy System

### Currency Types

#### 1. Gold (G)
- **Source**: Dungeons, quests, selling items
- **Use**: Basic upgrades, healing, enchanting
- **Cap**: No limit

#### 2. Premium (P)
- **Source**: Events, PvP wins, daily quests
- **Use**: Premium gacha, rare items, guild upgrades
- **Cap**: No limit

#### 3. AETH Token (C)
- **Source**: Achievement rewards, airdrops, marketplace
- **Use**: NFT minting, trading, withdrawing to wallet
- **Cap**: 1 billion total supply

### Marketplace Fees

- Listing Fee: 0 AETH
- Transaction Fee: 2.5% of sale price
- Fee goes to treasury wallet

## 🎯 Quest System

### Daily Quests (Reset every 24h)

1. **Dungeon Explorer**
   - Complete 3 dungeons
   - Reward: 200 Gold, 50 EXP

2. **Monster Slayer**
   - Defeat 10 enemies
   - Reward: 150 Gold, 30 EXP

3. **Social Butterfly**
   - Chat in global chat 5 times
   - Reward: 50 Premium

### Weekly Quests (Reset every 7 days)

1. **Boss Hunter**
   - Defeat 5 bosses
   - Reward: 1000 Gold, 500 EXP, 100 Premium

2. **PvP Warrior**
   - Win 10 PvP battles
   - Reward: 200 Premium, Rare Item

3. **Guild Contributor**
   - Donate 5000 Gold to guild
   - Reward: Epic Item Fragment

### Achievement System

Permanent achievements with one-time rewards:

- **First Blood**: Win first PvP → 500 Gold
- **Dungeon Master**: Complete 100 dungeons → Legendary Item
- **Max Level**: Reach level 100 → 1000 AETH
- **Collector**: Own 50 NFT items → Epic NFT
- **Guild Leader**: Create a guild → Special Title

## 🏆 PvP System

### Auto Battle Mechanics

```javascript
// 5-round auto battle
for (round = 1; round <= 5; round++) {
  attackerDamage = calculateDamage(attacker)
  defender.hp -= attackerDamage
  
  if (defender.hp <= 0) {
    winner = attacker
    break
  }
  
  defenderDamage = calculateDamage(defender)
  attacker.hp -= defenderDamage
  
  if (attacker.hp <= 0) {
    winner = defender
    break
  }
}

// If both alive after 5 rounds
winner = (attacker.hp > defender.hp) ? attacker : defender
```

### Ranking System

| Rank       | Points  | Rewards (Weekly)        |
|------------|---------|-------------------------|
| Bronze     | 0-999   | 100 Premium             |
| Silver     | 1000-   | 250 Premium, Rare Item  |
| Gold       | 2500-   | 500 Premium, Epic Item  |
| Platinum   | 5000-   | 1000 Premium, Legendary |
| Diamond    | 10000+  | 2000 Premium, Mythic    |

## 🎰 Gacha System

### Summon Types

#### Basic Summon (1000 Gold)
- 60% Common
- 30% Uncommon
- 10% Rare

#### Premium Summon (100 Premium)
- 40% Uncommon
- 40% Rare
- 15% Epic
- 5% Legendary

#### Legendary Summon (10 AETH)
- 50% Epic
- 40% Legendary
- 10% Mythic

### Pity System

- Every 10 pulls guarantee at least 1 Rare
- Every 50 pulls guarantee at least 1 Epic
- Every 100 pulls guarantee 1 Legendary

## 👥 Guild System

### Guild Features

- **Max Members**: 20 (upgradeable to 50)
- **Guild Level**: Earned through member activity
- **Guild Treasury**: Shared resources
- **Guild Hall**: Provides passive bonuses

### Guild Bonuses (per level)

- Level 1-5: +1% Gold gain
- Level 6-10: +2% EXP gain
- Level 11-15: +3% Drop rate
- Level 16-20: +5% All stats

### Guild Activities

- **Guild Wars**: Team battles (coming soon)
- **Guild Raids**: Cooperative PvE content
- **Guild Shop**: Exclusive items

## 🌍 World Boss Events

### Event Schedule

- Spawns every 24 hours
- Active for 2 hours
- All players can participate
- HP scales with participants

### Rewards

Top 10 Contributors:
1. 1st Place: Mythic Item + 500 AETH
2. 2nd Place: Legendary Item + 300 AETH
3. 3rd Place: Epic Item + 200 AETH
4. 4-10th: Rare Item + 100 AETH

All Participants: Gold + EXP based on damage dealt

## 📈 Season Pass

### Free Track (All Players)

- Level up by earning SP EXP
- 50 levels total
- Rewards: Gold, Items, Premium

### Premium Track (Costs 500 AETH)

- Same levels as free
- 2x better rewards
- Exclusive cosmetics
- NFT rewards at milestones

### Season Duration

- 90 days per season
- Resets with new content

## 🎁 Reward & Airdrop System

### Daily Login Rewards

| Day | Reward                          |
|-----|---------------------------------|
| 1   | 100 Gold                        |
| 2   | 150 Gold                        |
| 3   | 200 Gold + 10 Premium           |
| 4   | 250 Gold                        |
| 5   | 300 Gold + 20 Premium           |
| 6   | 400 Gold                        |
| 7   | 500 Gold + 50 Premium + 5 AETH  |

### Referral System

- Refer friends with unique code
- Referrer gets 10% of referee's first purchase
- Referee gets 100 Gold + 50 Premium bonus

---

**This design is subject to balance changes based on player feedback and testing.**
