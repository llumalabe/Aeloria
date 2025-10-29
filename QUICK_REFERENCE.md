# ⚡ Aeloria - Quick Reference Guide

## 🚀 Quick Commands

### Start Development Environment

```bash
# Terminal 1 - MongoDB
mongod

# Terminal 2 - Backend Server
cd C:\Users\User\aeloria-guardians\backend
npm run dev

# Terminal 3 - Frontend
cd C:\Users\User\aeloria-guardians
npm run dev
```

### Smart Contract Commands

```bash
cd C:\Users\User\aeloria-guardians\contracts

# Compile contracts
npm run compile

# Deploy to Ronin Testnet
npx hardhat run scripts/deploy.ts --network saigon

# Deploy to Ronin Mainnet (⚠️ Use with caution)
npx hardhat run scripts/deploy.ts --network ronin
```

---

## 📁 Important File Locations

| File | Path | Purpose |
|------|------|---------|
| Frontend Entry | `src/app/page.tsx` | Main landing page |
| Backend Entry | `backend/src/index.ts` | API server |
| Smart Contracts | `contracts/*.sol` | Blockchain contracts |
| Environment Config | `.env.local`, `backend/.env`, `contracts/.env` | Configuration |

---

## 🔗 API Endpoints Reference

### Base URL
```
http://localhost:3001/api
```

### User Endpoints
```bash
POST   /users/register              # Register user
GET    /users/:walletAddress        # Get profile
POST   /users/:walletAddress/login  # Daily login
POST   /users/:walletAddress/currency # Update currency
```

### Character Endpoints
```bash
GET    /characters/:walletAddress   # Get all characters
POST   /characters/mint             # Mint character
POST   /characters/:tokenId/level-up # Add EXP
POST   /characters/:tokenId/heal    # Heal character
GET    /characters/:tokenId/stats   # Get stats
```

### Dungeon Endpoints
```bash
GET    /dungeon/list                # List dungeons
POST   /dungeon/:id/enter           # Enter dungeon
POST   /dungeon/complete            # Complete dungeon
```

### PvP Endpoints
```bash
POST   /pvp/battle                  # Start PvP battle
GET    /pvp/rankings                # Get rankings
```

### Guild Endpoints
```bash
GET    /guilds                      # List guilds
POST   /guilds/create               # Create guild
POST   /guilds/:id/join             # Join guild
```

### Gacha Endpoints
```bash
POST   /gacha/summon                # Perform summon
```

### Marketplace Endpoints
```bash
GET    /marketplace/listings        # Get listings
POST   /marketplace/list            # List item
POST   /marketplace/buy             # Buy item
```

---

## 🎮 Game Constants

### Character Classes
```
0 = Warrior   (⚔️)
1 = Mage      (🔮)
2 = Archer    (🏹)
3 = Rogue     (🗡️)
4 = Cleric    (✨)
5 = Paladin   (🛡️)
```

### Item Types
```
0 = Weapon
1 = Armor
2 = Accessory
3 = Consumable
4 = Material
```

### Rarity Tiers
```
0 = Common     (White)
1 = Uncommon   (Green)
2 = Rare       (Blue)
3 = Epic       (Purple)
4 = Legendary  (Orange)
5 = Mythic     (Pink)
```

### Difficulty Levels
```
Easy   - Level 1+
Normal - Level 10+
Hard   - Level 25+
Expert - Level 50+
Hell   - Level 75+
```

---

## 💰 Economy Costs

### Gacha Summon Costs
```
Basic Summon:     1,000 Gold
Premium Summon:   100 Premium
Legendary Summon: 10 AETH Tokens
```

### Character Actions
```
Full Heal:        50 Gold
Revive:           100 Gold
Stat Reset:       500 Premium
```

### Item Enhancement
```
Enchant +1:       Level² × 100 Gold
Rarity Upgrade:   1,000 Premium
```

### Guild Operations
```
Create Guild:     5,000 Gold
Expand Members:   1,000 Gold per slot
Upgrade Hall:     Level × 500 Gold
```

---

## 📊 Stat Formulas

### Combat Power
```javascript
power = (STR × 1.5) + (AGI × 1.2) + (INT × 1.3) + (LUK × 0.8)
```

### EXP Required per Level
```javascript
expNeeded = currentLevel × 100
```

### Level Up Stat Gains
```
+2 STR
+2 AGI
+2 INT
+1 LUK
+2 VIT
+10 Max HP
```

### Critical Hit Chance
```javascript
critChance = LUK × 2 // (as percentage)
```

### Drop Rate Bonus
```javascript
dropBonus = 1 + (LUK / 100)
```

---

## 🔑 Environment Variables Template

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_RONIN_CHAIN_ID=2021
NEXT_PUBLIC_RONIN_RPC_URL=https://saigon-testnet.roninchain.com/rpc
NEXT_PUBLIC_CHARACTER_CONTRACT=0x...
NEXT_PUBLIC_ITEM_CONTRACT=0x...
NEXT_PUBLIC_TOKEN_CONTRACT=0x...
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0x...
```

### Backend (backend/.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/aeloria
FRONTEND_URL=http://localhost:3000
RONIN_RPC_URL=https://saigon-testnet.roninchain.com/rpc
PRIVATE_KEY=your_private_key_here
JWT_SECRET=your_secret_here
```

### Contracts (contracts/.env)
```env
PRIVATE_KEY=your_private_key_here
```

---

## 🐛 Common Issues & Fixes

### Issue: MongoDB Connection Failed
```bash
# Solution: Start MongoDB
mongod

# Or use MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aeloria
```

### Issue: Contract Compilation Error
```bash
# Solution: Install dependencies with legacy peer deps
cd contracts
npm install --legacy-peer-deps
```

### Issue: Wallet Not Connecting
```bash
# Solution:
1. Install Ronin Wallet extension
2. Switch to Saigon Testnet
3. Get test RON from: https://faucet.roninchain.com
```

### Issue: Backend Port Already in Use
```bash
# Solution: Change port in backend/.env
PORT=3002
```

### Issue: Next.js Build Error
```bash
# Solution: Clear cache and rebuild
rm -rf .next
npm run dev
```

---

## 📦 Useful Commands

### NPM Commands
```bash
# Install dependencies
npm install

# Clean install
npm ci

# Update packages
npm update

# Check outdated packages
npm outdated

# Audit security
npm audit
```

### Git Commands
```bash
# Check status
git status

# Stage all changes
git add .

# Commit changes
git commit -m "message"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main
```

### MongoDB Commands
```bash
# Start MongoDB
mongod

# MongoDB Shell
mongosh

# Use database
use aeloria

# Show collections
show collections

# Query users
db.users.find()

# Clear collection
db.users.deleteMany({})
```

---

## 🎯 Testing Checklist

### Smart Contracts
- [ ] Compile without errors
- [ ] Deploy to testnet
- [ ] Mint character NFT
- [ ] Mint item NFT
- [ ] List item on marketplace
- [ ] Buy item from marketplace
- [ ] Transfer tokens

### Backend
- [ ] Server starts successfully
- [ ] MongoDB connects
- [ ] Create user account
- [ ] Daily login works
- [ ] Enter dungeon
- [ ] Complete quest
- [ ] Join guild
- [ ] PvP battle

### Frontend
- [ ] Page loads without errors
- [ ] Wallet connects
- [ ] Character creation UI
- [ ] Dungeon UI
- [ ] Marketplace UI

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Frontend Dev | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Backend Health | http://localhost:3001/health |
| MongoDB | mongodb://localhost:27017 |
| Ronin Testnet RPC | https://saigon-testnet.roninchain.com/rpc |
| Ronin Mainnet RPC | https://api.roninchain.com/rpc |
| Ronin Testnet Explorer | https://saigon-explorer.roninchain.com |
| Ronin Mainnet Explorer | https://explorer.roninchain.com |
| Ronin Faucet | https://faucet.roninchain.com |

---

## 📖 Documentation Links

| Document | Purpose |
|----------|---------|
| [SETUP.md](SETUP.md) | Setup & installation |
| [GAME_DESIGN.md](GAME_DESIGN.md) | Game mechanics |
| [CONTRACT_API.md](CONTRACT_API.md) | Smart contract API |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Project overview |

---

## 💡 Pro Tips

1. **Always test on Saigon testnet first** before deploying to mainnet
2. **Keep private keys secure** - Never commit to git
3. **Use environment variables** for all sensitive data
4. **Run MongoDB** before starting backend
5. **Clear browser cache** if wallet issues occur
6. **Check gas prices** before deploying contracts
7. **Backup database** regularly
8. **Use TypeScript strict mode** for better type safety
9. **Test API endpoints** with Postman or Thunder Client
10. **Monitor contract events** in Ronin Explorer

---

## 📞 Quick Help

### Get Test RON Tokens
1. Go to https://faucet.roninchain.com
2. Connect Ronin Wallet
3. Switch to Saigon Testnet
4. Request test RON

### Deploy Contracts Step-by-Step
```bash
# 1. Navigate to contracts folder
cd contracts

# 2. Create .env file
cp .env.example .env

# 3. Add your private key to .env
# PRIVATE_KEY=your_private_key_here

# 4. Compile contracts
npm run compile

# 5. Deploy to testnet
npx hardhat run scripts/deploy.ts --network saigon

# 6. Copy contract addresses from output
# 7. Update .env files with addresses
```

### Connect Frontend to Contracts
```typescript
// In your component
import { ethers } from "ethers";

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  signer
);
```

---

**⚔️ Keep this guide handy for quick reference! 🏰✨**
