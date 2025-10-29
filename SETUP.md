# 🎮 Aeloria: Guardians of the Eternal Sigils - Setup Guide

## 📋 Project Structure

```
aeloria-guardians/
├── src/                        # Next.js frontend
│   └── app/                    # App router pages
├── backend/                    # Node.js Express backend
│   └── src/
│       ├── config/            # Database & Socket.IO config
│       ├── models/            # MongoDB models
│       ├── routes/            # API routes
│       ├── middleware/        # Express middleware
│       └── index.ts           # Server entry point
├── contracts/                  # Solidity smart contracts
│   ├── AeloriaCharacter.sol   # ERC-721 Character NFT
│   ├── AeloriaItem.sol        # ERC-721 Item NFT
│   ├── AeloriaToken.sol       # ERC-20 Game Token
│   ├── AeloriaMarketplace.sol # NFT Marketplace
│   ├── hardhat.config.ts      # Hardhat configuration
│   └── scripts/deploy.ts      # Deployment script
└── .github/
    └── copilot-instructions.md # Project guidelines
```

## 🚀 Quick Start

### 1. Prerequisites

Install the following:
- **Node.js 18+** and npm
- **MongoDB** (local or MongoDB Atlas)
- **Ronin Wallet** browser extension

### 2. Clone and Install

```bash
# Clone repository
git clone https://github.com/yourusername/aeloria-guardians.git
cd aeloria-guardians

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install contract dependencies
cd contracts
npm install --legacy-peer-deps
cd ..
```

### 3. Environment Configuration

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_RONIN_CHAIN_ID=2021
NEXT_PUBLIC_RONIN_RPC_URL=https://saigon-testnet.roninchain.com/rpc
NEXT_PUBLIC_CHARACTER_CONTRACT=<deployed_address>
NEXT_PUBLIC_ITEM_CONTRACT=<deployed_address>
NEXT_PUBLIC_TOKEN_CONTRACT=<deployed_address>
NEXT_PUBLIC_MARKETPLACE_CONTRACT=<deployed_address>
```

#### Backend (backend/.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/aeloria
FRONTEND_URL=http://localhost:3000
RONIN_RPC_URL=https://saigon-testnet.roninchain.com/rpc
PRIVATE_KEY=<your_private_key>
JWT_SECRET=<random_secret>
```

#### Contracts (contracts/.env)
```env
PRIVATE_KEY=<your_private_key>
```

### 4. Deploy Smart Contracts

```bash
cd contracts

# Compile contracts
npm run compile

# Deploy to Ronin Testnet (Saigon)
npx hardhat run scripts/deploy.ts --network saigon

# Copy contract addresses to .env files
```

### 5. Start MongoDB

```bash
# If using local MongoDB
mongod
```

### 6. Run Backend

```bash
cd backend
npm run dev
```
Server runs on `http://localhost:3001`

### 7. Run Frontend

```bash
# From root directory
npm run dev
```
Frontend runs on `http://localhost:3000`

## 📚 API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `GET /api/users/:walletAddress` - Get user profile
- `POST /api/users/:walletAddress/login` - Daily login (rewards)

### Characters
- `GET /api/characters/:walletAddress` - Get all characters
- `POST /api/characters/mint` - Mint new character
- `POST /api/characters/:tokenId/level-up` - Add EXP

### Dungeon
- `GET /api/dungeon/list` - List dungeons
- `POST /api/dungeon/:id/enter` - Enter dungeon
- `POST /api/dungeon/complete` - Complete dungeon

### PvP
- `POST /api/pvp/battle` - Auto battle
- `GET /api/pvp/rankings` - Get rankings

### Gacha
- `POST /api/gacha/summon` - Summon items

### Guilds
- `GET /api/guilds` - List guilds
- `POST /api/guilds/create` - Create guild
- `POST /api/guilds/:id/join` - Join guild

## 🎯 Game Mechanics

### Character Classes
1. **Warrior** ⚔️ - High STR & VIT
2. **Mage** 🔮 - High INT
3. **Archer** 🏹 - High AGI & LUK
4. **Rogue** 🗡️ - Highest AGI
5. **Cleric** ✨ - Balanced INT & VIT
6. **Paladin** 🛡️ - Balanced all stats

### Stats Explanation
- **STR**: Physical damage
- **AGI**: Speed & evasion
- **INT**: Magic damage
- **LUK**: Critical & drop rate
- **VIT**: HP & defense

### Economy
- **Gold**: In-game currency (dungeons)
- **Premium**: Special currency (events, PvP)
- **AETH Token**: Blockchain token (trading)

## 🔧 Development Commands

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Lint code
```

### Backend
```bash
npm run dev          # Development server with hot reload
npm run build        # Compile TypeScript
npm run start        # Start compiled server
```

### Contracts
```bash
npm run compile      # Compile Solidity contracts
npm run test         # Run tests
npm run deploy       # Deploy to network
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aeloria
```

### Contract Deployment Fails
```bash
# Check RPC URL
# Check private key has RON tokens
# Try increasing gas limit in hardhat.config.ts
```

### Frontend Can't Connect to Wallet
```bash
# Install Ronin Wallet extension
# Switch to Saigon Testnet
# Get test RON from faucet: https://faucet.roninchain.com
```

## 📖 Additional Resources

- [Ronin Documentation](https://docs.roninchain.com)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📝 License

MIT License - see LICENSE file

---

**Happy Gaming! ⚔️🏰✨**
