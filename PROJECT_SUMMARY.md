# 🎮 Aeloria: Guardians of the Eternal Sigils
## Web3 Text-Based Fantasy RPG on Ronin Network

![Status](https://img.shields.io/badge/Status-Development-yellow)
![Blockchain](https://img.shields.io/badge/Blockchain-Ronin-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📁 Project Summary

**Aeloria** is a comprehensive Web3 text-based fantasy RPG built on Ronin Network, featuring NFT characters, dungeon exploration, boss battles, PvP combat, and a player-driven economy.

### 🎯 Project Location
```
📂 C:\Users\User\aeloria-guardians\
```

---

## ✅ Implementation Status

### ✨ Completed Features

#### 🔗 Blockchain Layer
- ✅ **AeloriaCharacter.sol** - ERC-721 NFT for characters with 6 classes
- ✅ **AeloriaItem.sol** - ERC-721 NFT for equipment (Weapon/Armor/Accessory)
- ✅ **AeloriaToken.sol** - ERC-20 game token (AETH) with anti-bot measures
- ✅ **AeloriaMarketplace.sol** - NFT trading platform with 2.5% fee
- ✅ Hardhat configuration for Ronin Network (Testnet & Mainnet)
- ✅ Deployment scripts for all contracts

#### 🎭 Character System
- ✅ 6 Character Classes (Warrior, Mage, Archer, Rogue, Cleric, Paladin)
- ✅ Stats System (STR, AGI, INT, LUK, VIT)
- ✅ Passive Skills per class
- ✅ Level & EXP Progression (1-100)
- ✅ HP Management System
- ✅ Character minting, healing, leveling on-chain

#### ⚔️ Equipment & Items
- ✅ 3 Equipment Types (Weapon, Armor, Accessory)
- ✅ 6 Rarity Tiers (Common → Mythic)
- ✅ Enchant System (+0 to +10)
- ✅ Rarity Upgrade System
- ✅ Stat Bonuses from equipment
- ✅ NFT-based item ownership

#### 🏰 Game Systems (Backend)
- ✅ Dungeon System with 5 difficulty levels
- ✅ Random Event Generation in dungeons
- ✅ Boss Battle Mechanics
- ✅ Combat Calculation System
- ✅ PvP Auto Battle (5 rounds)
- ✅ Quest System (Daily/Weekly/Achievement)
- ✅ Gacha/Summon System (3 tiers)

#### 💰 Economy
- ✅ 3-Tier Currency (Gold/Premium/AETH Token)
- ✅ Reward Distribution System
- ✅ Daily Login Rewards with streak bonuses
- ✅ Referral System
- ✅ Marketplace with transaction fees
- ✅ Anti-bot protection (cooldown, daily limits, whitelist)

#### 👥 Social Features
- ✅ Guild System (create, join, manage)
- ✅ Socket.IO for real-time chat
- ✅ Global Chat Room
- ✅ Guild Chat Room
- ✅ PvP Ranking System
- ✅ Player Profiles

#### 🗄️ Backend Infrastructure
- ✅ Express.js REST API
- ✅ MongoDB Integration
- ✅ User Management System
- ✅ Character Routes & Controllers
- ✅ Dungeon Routes & Controllers
- ✅ Combat Routes & Controllers
- ✅ Marketplace Routes & Controllers
- ✅ Quest Routes & Controllers
- ✅ Guild Routes & Controllers
- ✅ PvP Routes & Controllers
- ✅ Gacha Routes & Controllers
- ✅ WebSocket (Socket.IO) for real-time features

#### 🎨 Frontend
- ✅ Next.js 14 with App Router
- ✅ TypeScript Configuration
- ✅ Tailwind CSS Setup
- ✅ Project Structure

---

## 📂 Project Structure

```
aeloria-guardians/
├── 📄 .env.example                 # Frontend environment template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 package.json                 # Frontend dependencies
├── 📄 tsconfig.json                # TypeScript config
├── 📄 tailwind.config.ts           # Tailwind config
├── 📄 next.config.ts               # Next.js config
│
├── 📁 .github/
│   └── copilot-instructions.md    # Project guidelines
│
├── 📁 src/                         # Next.js frontend
│   └── app/
│       ├── layout.tsx             # Root layout
│       ├── page.tsx               # Home page
│       └── globals.css            # Global styles
│
├── 📁 backend/                     # Node.js backend
│   ├── 📄 package.json            # Backend dependencies
│   ├── 📄 tsconfig.json           # Backend TypeScript config
│   ├── 📄 .env.example            # Backend environment template
│   └── src/
│       ├── index.ts               # Server entry point
│       ├── config/
│       │   ├── database.ts        # MongoDB connection
│       │   └── socket.ts          # Socket.IO setup
│       ├── models/
│       │   ├── User.model.ts      # User schema
│       │   ├── Dungeon.model.ts   # Dungeon schema
│       │   ├── Quest.model.ts     # Quest schema
│       │   └── Guild.model.ts     # Guild schema
│       ├── routes/
│       │   ├── user.routes.ts     # User endpoints
│       │   ├── character.routes.ts # Character endpoints
│       │   ├── dungeon.routes.ts  # Dungeon endpoints
│       │   ├── combat.routes.ts   # Combat endpoints
│       │   ├── marketplace.routes.ts # Marketplace endpoints
│       │   ├── quest.routes.ts    # Quest endpoints
│       │   ├── guild.routes.ts    # Guild endpoints
│       │   ├── pvp.routes.ts      # PvP endpoints
│       │   └── gacha.routes.ts    # Gacha endpoints
│       └── middleware/
│           └── errorHandler.ts    # Error handling
│
└── 📁 contracts/                   # Solidity smart contracts
    ├── 📄 package.json            # Contract dependencies
    ├── 📄 hardhat.config.ts       # Hardhat configuration
    ├── 📄 .env.example            # Contract environment template
    ├── 📄 AeloriaCharacter.sol    # Character NFT contract
    ├── 📄 AeloriaItem.sol         # Item NFT contract
    ├── 📄 AeloriaToken.sol        # ERC-20 token contract
    ├── 📄 AeloriaMarketplace.sol  # Marketplace contract
    └── scripts/
        └── deploy.ts              # Deployment script
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
```bash
✅ Node.js 18+
✅ npm or yarn
✅ MongoDB (local or Atlas)
✅ Ronin Wallet Browser Extension
```

### 2. Installation

```bash
# Navigate to project
cd C:\Users\User\aeloria-guardians

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install contract dependencies
cd ../contracts
npm install --legacy-peer-deps
```

### 3. Environment Setup

Copy `.env.example` files and configure:
- Frontend: `.env.local`
- Backend: `backend/.env`
- Contracts: `contracts/.env`

### 4. Deploy Smart Contracts

```bash
cd contracts

# Compile contracts
npm run compile

# Deploy to Ronin Testnet
npx hardhat run scripts/deploy.ts --network saigon

# Update .env files with contract addresses
```

### 5. Run Backend

```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

### 6. Run Frontend

```bash
# From root directory
npm run dev
# Runs on http://localhost:3000
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](SETUP.md) | Complete setup and installation guide |
| [GAME_DESIGN.md](GAME_DESIGN.md) | Game mechanics and system design |
| [CONTRACT_API.md](CONTRACT_API.md) | Smart contract API reference |

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **Next.js 14+** - React framework with App Router
- 📘 **TypeScript** - Type-safe development
- 🎨 **Tailwind CSS** - Utility-first styling
- 🔗 **ethers.js** - Ethereum library

### Backend
- 🟢 **Node.js + Express** - REST API server
- 📘 **TypeScript** - Type-safe backend
- 🍃 **MongoDB** - NoSQL database
- 🔌 **Socket.IO** - Real-time communication

### Blockchain
- 🔗 **Ronin Network** - Layer-1 blockchain
- 📜 **Solidity ^0.8.20** - Smart contracts
- ⚒️ **Hardhat** - Development environment
- 🛡️ **OpenZeppelin** - Contract libraries

---

## 📊 Smart Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| AeloriaCharacter | `[To Deploy]` | Character NFTs |
| AeloriaItem | `[To Deploy]` | Item NFTs |
| AeloriaToken | `[To Deploy]` | ERC-20 Token |
| AeloriaMarketplace | `[To Deploy]` | NFT Trading |

---

## 🎮 Core Features

### 🎭 Character System
- 6 Character Classes with unique stats
- Level 1-100 progression
- Stats: STR, AGI, INT, LUK, VIT
- Class-specific passive skills
- On-chain character data

### 🏰 Dungeon & Combat
- 5 Difficulty levels
- Random event generation
- Boss battles with NFT drops
- Auto-battle combat system
- EXP and Gold rewards

### ⚙️ Equipment & Items
- NFT-based equipment
- 6 Rarity tiers
- Enchant system (+0 to +10)
- Stat bonuses
- Upgrade mechanics

### 💰 Economy
- **Gold**: Basic currency (dungeons)
- **Premium**: Special currency (events, PvP)
- **AETH**: Blockchain token (trading, NFT)

### 👥 Social & Multiplayer
- Guild system (up to 50 members)
- Real-time global chat
- PvP auto battles
- Ranking leaderboards
- Referral system

### 🎯 Progression
- Daily/Weekly quests
- Achievement system
- Season pass (planned)
- World boss events (planned)
- Login streak rewards

---

## 🔐 Security Features

### Anti-Bot Measures
- ✅ Transaction cooldown (1 second)
- ✅ Daily transaction limits (100 max)
- ✅ Whitelist system for trusted addresses
- ✅ Smart contract access control
- 🔜 Chainlink VRF for fair randomness (planned)

---

## 🎯 Roadmap

### Phase 1: Core Development ✅ (Current)
- [x] Smart contract development
- [x] Backend API implementation
- [x] Database models
- [x] Basic game systems

### Phase 2: Frontend Development 🚧
- [ ] Landing page
- [ ] Wallet connection
- [ ] Character creation UI
- [ ] Dungeon exploration UI
- [ ] Marketplace UI
- [ ] Guild management UI

### Phase 3: Advanced Features 📋
- [ ] World boss events
- [ ] Season pass system
- [ ] Advanced PvP modes
- [ ] Guild wars
- [ ] NFT cosmetics
- [ ] Achievement NFTs

### Phase 4: Launch & Scale 🎯
- [ ] Testnet beta testing
- [ ] Security audit
- [ ] Mainnet deployment
- [ ] Marketing campaign
- [ ] Community building

---

## 📈 Current Status

| Component | Status | Progress |
|-----------|--------|----------|
| Smart Contracts | ✅ Complete | 100% |
| Backend API | ✅ Complete | 100% |
| Database Models | ✅ Complete | 100% |
| Game Systems | ✅ Complete | 100% |
| Frontend UI | 🚧 In Progress | 20% |
| Documentation | ✅ Complete | 100% |
| Testing | 📋 Pending | 0% |
| Deployment | 📋 Pending | 0% |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🔗 Links

- **Project Folder**: `C:\Users\User\aeloria-guardians\`
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:3001`
- **Ronin Testnet**: https://saigon-testnet.roninchain.com
- **Ronin Explorer**: https://saigon-explorer.roninchain.com

---

## 👥 Team

Built with ❤️ by the Aeloria Development Team

---

## 🙏 Acknowledgments

- **OpenZeppelin** - Secure smart contract libraries
- **Ronin Network** - Scalable blockchain infrastructure
- **Next.js** - Amazing React framework
- **Hardhat** - Ethereum development environment

---

## 📞 Support

For questions or issues, please open an issue in the repository.

---

**⚔️ Ready to explore Aeloria? Connect your Ronin Wallet and start your adventure! 🏰✨**
