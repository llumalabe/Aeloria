# 🎮 Aeloria Smart Contracts

Smart contracts for Aeloria game on Ronin Network

## 📋 Contracts

### 1. **AeloriaToken (AETH)**
- ERC-20 token for in-game currency
- Initial supply: 1 billion tokens
- Mintable and burnable
- Owner can mint new tokens

### 2. **WalletManager**
- Manages deposits and withdrawals
- Supports AETH and RON (native Ronin currency)
- **AETH withdrawal fee: 5%**
- **RON: No fees**

## 🚀 Deployment Guide

### Prerequisites

1. **Install Dependencies**
```bash
cd contracts
npm install
```

2. **Setup Environment**
```bash
cp .env.example .env
```

Edit `.env` and add:
- `PRIVATE_KEY`: Your wallet private key (WITHOUT 0x prefix)
- Get testnet RON from: https://faucet.roninchain.com/

3. **Get Testnet RON**
- Visit: https://faucet.roninchain.com/
- Connect your Ronin Wallet
- Request testnet RON for gas fees

### Deploy to Ronin Saigon Testnet

```bash
# Compile contracts
npm run compile

# Deploy to testnet
npm run deploy:testnet
```

After deployment, you'll see:
```
AETH Token:      0x...
Wallet Manager:  0x...
```

**⚠️ Save these addresses!** You'll need them for frontend/backend integration.

### Verify Contracts (Optional)

Update `.env` with deployed addresses:
```
AETH_TOKEN_ADDRESS=0x...
WALLET_MANAGER_ADDRESS=0x...
```

Then verify:
```bash
npm run verify
```

## 📝 Contract ABIs

After compilation, ABIs are in:
- `artifacts/AeloriaToken.sol/AeloriaToken.json`
- `artifacts/WalletManager.sol/WalletManager.json`

## 🔧 Integration with Frontend

### 1. Install ethers.js (already done)
```bash
npm install ethers@6
```

### 2. Add contract addresses to `.env.local`
```
NEXT_PUBLIC_AETH_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_WALLET_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_RONIN_CHAIN_ID=2021
```

### 3. Contract Functions

**Deposit AETH:**
```javascript
// 1. Approve WalletManager to spend AETH
await aethToken.approve(walletManagerAddress, amount);

// 2. Deposit
await walletManager.depositAeth(amount);
```

**Withdraw AETH (5% fee):**
```javascript
await walletManager.withdrawAeth(amount);
// User receives: amount - (amount * 5%)
```

**Deposit RON:**
```javascript
await walletManager.depositRon({ value: amount });
```

**Withdraw RON (no fee):**
```javascript
await walletManager.withdrawRon(amount);
```

**Check Balances:**
```javascript
const [aethBalance, ronBalance] = await walletManager.getBalances(userAddress);
```

## 🔐 Security Features

- ✅ ReentrancyGuard on all deposit/withdraw functions
- ✅ Owner-only emergency withdraw
- ✅ Fee collection system
- ✅ OpenZeppelin battle-tested contracts

## 🌐 Network Info

**Ronin Saigon Testnet:**
- Chain ID: 2021
- RPC: https://saigon-testnet.roninchain.com/rpc
- Explorer: https://saigon-app.roninchain.com
- Faucet: https://faucet.roninchain.com

**Ronin Mainnet:**
- Chain ID: 2020
- RPC: https://api.roninchain.com/rpc
- Explorer: https://app.roninchain.com

## 📊 Fee Structure

| Action | Token | Fee |
|--------|-------|-----|
| Deposit AETH | AETH | 0% |
| Withdraw AETH | AETH | **5%** |
| Deposit RON | RON | 0% |
| Withdraw RON | RON | 0% |

## 🛠️ Useful Commands

```bash
# Compile contracts
npm run compile

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet
npm run deploy:mainnet

# Verify contracts
npm run verify

# Run tests
npm test
```

## ⚠️ Important Notes

1. **Never commit `.env` file** - Contains private key
2. **Save deployment addresses** - You'll need them for integration
3. **Test on Saigon first** - Before deploying to mainnet
4. **Keep private key secure** - Use hardware wallet for mainnet

## 📞 Support

- Ronin Docs: https://docs.roninchain.com
- Ronin Discord: https://discord.gg/roninnetwork
