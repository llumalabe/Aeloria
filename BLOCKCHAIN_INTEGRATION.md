# Ronin Blockchain Integration Guide

## ✅ Deployment Status
Contracts successfully deployed to **Ronin Saigon Testnet**:

- **AETH Token**: `0x6e937B8dF644fbbD663058323337179863866d41`
- **WalletManager**: `0x9fDF58EAf8197237b432e4901391D804E156e4c9`
- **Network**: Ronin Saigon Testnet (chainId: 2021)
- **Initial Supply**: 1,000,000,000 AETH

## 📦 What's Integrated

### Smart Contracts
- ✅ `AeloriaToken.sol` - ERC-20 token with mint/burn
- ✅ `WalletManager.sol` - Deposit/Withdraw manager with fees
- ✅ Deployed on Ronin Saigon Testnet
- ✅ Contract addresses saved in `.env`

### Frontend Integration
- ✅ `src/config/contracts.ts` - Contract addresses and network config
- ✅ `src/lib/abis/` - Contract ABIs extracted from artifacts
- ✅ `src/lib/blockchain.ts` - BlockchainWallet utility class
- ✅ `src/app/town/page.tsx` - Updated to use blockchain transactions

## 🔧 How It Works

### 1. Deposit AETH
```typescript
// User flow:
// 1. Connect Ronin Wallet (popup appears)
// 2. Approve AETH spending (transaction 1)
// 3. Deposit AETH to contract (transaction 2)

const result = await blockchainWallet.depositAeth("100");
// Contract stores: deposits[userAddress].aethBalance += 100
// User's AETH wallet balance decreases by 100
```

### 2. Withdraw AETH (with 5% fee)
```typescript
// User withdraws 100 AETH
const result = await blockchainWallet.withdrawAeth("100");
// Fee: 5 AETH (kept in contract)
// User receives: 95 AETH
// Contract balance decreases: -100 AETH
```

### 3. Deposit RON
```typescript
// Direct transfer (no approval needed)
const result = await blockchainWallet.depositRon("1");
// Contract stores: deposits[userAddress].ronBalance += 1
```

### 4. Withdraw RON (no fee)
```typescript
// No fees for RON withdrawals
const result = await blockchainWallet.withdrawRon("1");
// User receives exactly 1 RON
```

## 🎮 User Experience

### In Town Page:
1. **Connect Wallet**: Click "Connect Wallet" → Ronin Wallet popup → Approve connection
2. **View Balances**: See "On-Chain AETH" and "On-Chain RON" in wallet panel
3. **Deposit**:
   - Click "Deposit" → Select AETH/RON → Enter amount
   - Ronin Wallet popup: Approve transaction
   - Wait for confirmation (~5 seconds)
   - Balance updates automatically
4. **Withdraw**:
   - Click "Withdraw" → Select AETH/RON → Enter amount
   - See fee calculation (AETH: 5%, RON: 0%)
   - Ronin Wallet popup: Approve transaction
   - Receive tokens in wallet

## 🔐 Security Features

### Smart Contract
- ✅ ReentrancyGuard on all deposit/withdraw functions
- ✅ Owner-only emergency withdrawal
- ✅ Fee collection separated from user balances
- ✅ No way to steal user funds

### Frontend
- ✅ Validates amount > 0
- ✅ Checks blockchain connection before transactions
- ✅ Shows real-time fee calculation
- ✅ Displays transaction hash for verification

## 📱 Testing on Testnet

### Prerequisites
1. Install **Ronin Wallet** extension
2. Get testnet RON from faucet: https://faucet.roninchain.com/
3. Get testnet AETH (contact owner: 0x40c078F1665677d3918Ec47F382fb9F581fADE56)

### Test Deposit Flow
```bash
1. Open https://your-game.com/town
2. Connect Ronin Wallet
3. Click "Deposit" → "AETH" → Enter "10"
4. Approve in Ronin Wallet (2 transactions)
5. Check "On-Chain AETH" balance increases
```

### Test Withdraw Flow
```bash
1. Click "Withdraw" → "AETH" → Enter "10"
2. See: "You'll receive 9.5 AETH after 5% fee"
3. Approve in Ronin Wallet
4. Check wallet AETH balance increases by 9.5
```

## 🚀 Next Steps (Not Yet Implemented)

### Backend Verification
Currently, the backend stores balances in MongoDB without verifying blockchain state.

**TODO**: Update backend to verify transactions:
```typescript
// backend/src/routes/user.routes.ts
router.post('/:walletAddress/wallet/deposit', async (req, res) => {
  const { txHash, amount, tokenType } = req.body;
  
  // Verify transaction on blockchain
  const verified = await verifyTransaction(txHash);
  
  if (verified) {
    // Update database
    await User.updateBalance(walletAddress, amount, tokenType);
  }
});
```

### Event Listening
Monitor contract events to automatically sync balances:
```typescript
walletContract.on('AethDeposited', (user, amount) => {
  console.log(`${user} deposited ${amount} AETH`);
  // Update database
});
```

### Mainnet Deployment
When ready for production:
```bash
cd contracts
npm run deploy:mainnet
```

## 🛠️ Troubleshooting

### "Ronin Wallet not found"
- Install Ronin Wallet extension from Chrome Web Store

### "Wrong network"
- The app will automatically prompt to switch to Ronin Saigon

### "Insufficient funds"
- Get testnet RON from faucet
- Contact owner for testnet AETH tokens

### "Transaction failed"
- Check you have enough RON for gas fees (~0.001 RON)
- For AETH deposits, ensure you have enough AETH in wallet

## 📊 Contract Info

### View on Explorer
- Testnet: https://saigon-app.roninchain.com/address/0x9fDF58EAf8197237b432e4901391D804E156e4c9
- Mainnet: (not deployed yet)

### Contract Functions
```solidity
// Read-only
getBalances(address user) → (aethBalance, ronBalance)
deposits(address) → (aethBalance, ronBalance)
WITHDRAWAL_FEE_PERCENT() → 500 (5%)

// Write
depositAeth(uint256 amount)
withdrawAeth(uint256 amount)
depositRon() payable
withdrawRon(uint256 amount)
```

## 💡 Tips

1. **Gas Fees**: Always keep at least 0.01 RON for gas
2. **Approvals**: AETH deposits require 2 transactions (approve + deposit)
3. **Fees**: Only AETH withdrawals have 5% fee, RON withdrawals are free
4. **Testnet**: All transactions are free (testnet RON has no value)
5. **Verification**: Check transaction hash on Ronin explorer for proof
