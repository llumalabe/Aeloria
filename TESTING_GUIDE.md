# 🎮 Aeloria - Ronin Blockchain Integration Testing Guide

## ✅ What's Been Completed

### Smart Contracts (Deployed to Ronin Saigon Testnet)
- ✅ **AeloriaToken (AETH)**: `0x6e937B8dF644fbbD663058323337179863866d41`
  - ERC-20 token with 1 billion initial supply
  - Mintable and burnable by owner
  
- ✅ **WalletManager**: `0x9fDF58EAf8197237b432e4901391D804E156e4c9`
  - Deposit/Withdraw AETH with 5% withdrawal fee
  - Deposit/Withdraw RON with 0% fee
  - Protected with ReentrancyGuard

### Frontend Integration
- ✅ BlockchainWallet utility class (`src/lib/blockchain.ts`)
- ✅ Contract ABIs extracted (`src/lib/abis/`)
- ✅ Town page updated to use real blockchain transactions
- ✅ Auto-connect to Ronin network with network switching

## 🧪 How to Test

### Step 1: Install Ronin Wallet
1. Install [Ronin Wallet Extension](https://wallet.roninchain.com/)
2. Create or import a wallet
3. Switch to **Saigon Testnet** in settings

### Step 2: Get Test Tokens
1. **Get testnet RON** (for gas fees):
   - Go to https://faucet.roninchain.com/
   - Enter your wallet address
   - Request 1 RON (enough for ~1000 transactions)

2. **Get testnet AETH**:
   - Contact the deployer: `0x40c078F1665677d3918Ec47F382fb9F581fADE56`
   - Or ask in Discord/Telegram

### Step 3: Test Deposit Flow

#### Deposit AETH
```
1. Open game → Go to Town
2. Click "💰 Wallet" to open wallet panel
3. You should see "🔗 Connected to Ronin" (green dot)
4. Click "📥 Deposit (From Ronin Wallet)"
5. Select "AETH" token
6. Enter amount (e.g., "10")
7. Click "Confirm Deposit"
8. Ronin Wallet popup #1: Approve AETH spending → Confirm
9. Wait ~5 seconds
10. Ronin Wallet popup #2: Deposit AETH → Confirm
11. Wait ~5 seconds
12. Success! Check "On-Chain AETH" balance increased
```

#### Deposit RON
```
1. Click "📥 Deposit (From Ronin Wallet)"
2. Select "RON" token
3. Enter amount (e.g., "0.1")
4. Click "Confirm Deposit"
5. Ronin Wallet popup: Deposit RON → Confirm
6. Wait ~5 seconds
7. Success! Check "On-Chain RON" balance increased
```

### Step 4: Test Withdraw Flow

#### Withdraw AETH (with 5% fee)
```
1. Click "📤 Withdraw (To Ronin Wallet)"
2. Select "AETH" token
3. Enter amount (e.g., "10")
4. You'll see: "You'll receive: 9.5 AETH (after 5% fee)"
5. Click "Confirm Withdrawal"
6. Ronin Wallet popup: Withdraw AETH → Confirm
7. Wait ~5 seconds
8. Success! Check your Ronin Wallet AETH balance (+9.5)
```

#### Withdraw RON (no fee)
```
1. Click "📤 Withdraw (To Ronin Wallet)"
2. Select "RON" token
3. Enter amount (e.g., "0.1")
4. You'll see: "You'll receive: 0.1 RON (after 0% fee)"
5. Click "Confirm Withdrawal"
6. Ronin Wallet popup: Withdraw RON → Confirm
7. Wait ~5 seconds
8. Success! Check your Ronin Wallet RON balance (+0.1)
```

## 🔍 Verify Transactions

### On Ronin Explorer
1. Go to https://saigon-app.roninchain.com/
2. Paste transaction hash from alert message
3. View transaction details:
   - Status: Success ✅
   - From: Your wallet address
   - To: WalletManager contract
   - Value: Amount deposited/withdrawn

### Check Contract Balances
```javascript
// Open browser console on game website
const balances = await blockchainWallet.getBalances("YOUR_ADDRESS");
console.log('AETH:', balances.aethBalance);
console.log('RON:', balances.ronBalance);
```

## 🐛 Troubleshooting

### "Ronin Wallet not found"
- **Solution**: Install Ronin Wallet extension from https://wallet.roninchain.com/

### "Not Connected" (red dot)
- **Solution**: Click "Connect Wallet" button
- If still fails: Refresh page and try again

### "Wrong network"
- **Solution**: App will auto-prompt to switch to Ronin Saigon
- Or manually: Ronin Wallet settings → Network → Saigon Testnet

### "Insufficient funds" error
- **For AETH deposits**: Make sure you have AETH in your Ronin Wallet
- **For RON deposits**: Make sure you have RON in your Ronin Wallet
- **For any transaction**: Always keep at least 0.001 RON for gas fees

### "Approval failed"
- **Solution**: This is transaction #1 for AETH deposits
- Check you have enough RON for gas
- Try increasing gas limit in Ronin Wallet settings

### Transaction stuck
- **Solution**: Wait up to 30 seconds
- If still pending: Check Ronin Saigon status (sometimes testnet is slow)
- Last resort: Cancel in Ronin Wallet and try again

## 📊 Expected Gas Costs (Testnet)

| Action | Gas Used | Cost in RON |
|--------|----------|-------------|
| Approve AETH | ~50,000 | ~0.001 RON |
| Deposit AETH | ~80,000 | ~0.0017 RON |
| Withdraw AETH | ~70,000 | ~0.0015 RON |
| Deposit RON | ~60,000 | ~0.0013 RON |
| Withdraw RON | ~65,000 | ~0.0014 RON |

**Total for 1 full cycle** (deposit + withdraw both tokens): ~0.01 RON

## ✨ Features to Test

### 1. Auto Network Switching
- Connect with wrong network (e.g., Ethereum mainnet)
- App should prompt to switch to Ronin Saigon
- Approve → Connected!

### 2. Balance Syncing
- Deposit AETH
- Check "On-Chain AETH" updates immediately
- Refresh page → Balance persists (from blockchain)

### 3. Fee Calculation
- Enter "100" AETH for withdrawal
- Should show "You'll receive: 95 AETH (after 5% fee)"
- Change to RON → Should show "You'll receive: 100 RON (after 0% fee)"

### 4. Transaction Confirmation
- Click deposit/withdraw
- Alert should show transaction hash
- Can copy hash and verify on explorer

### 5. Error Handling
- Try withdrawing more than you have
- Should get "Insufficient balance" error from contract
- App handles gracefully without crashing

## 🎯 Test Scenarios

### Scenario 1: New Player
```
1. Fresh wallet with 1 RON (from faucet)
2. No AETH yet → Contact owner for 100 AETH
3. Deposit 50 AETH to game
4. Play game, earn in-game currency
5. Withdraw 20 AETH (receive 19 after fee)
6. Final state: 30 AETH in contract, 69 AETH in wallet
```

### Scenario 2: RON Deposits
```
1. Wallet has 1 RON
2. Deposit 0.5 RON to game
3. Use for in-game purchases (future feature)
4. Withdraw 0.3 RON (no fee)
5. Final state: 0.2 RON in contract, 0.5 RON in wallet
```

### Scenario 3: Fee Testing
```
1. Deposit 100 AETH
2. Withdraw 100 AETH
3. Expected: Receive 95 AETH (5 AETH fee kept in contract)
4. Check contract fee balance (owner only):
   - Call walletManager.totalAethFees()
   - Should show accumulated fees
```

## 🚨 Known Limitations (Current Version)

1. **Backend Not Synced**: Backend database doesn't verify blockchain transactions yet
   - Game balances (Gold, Premium) are separate from on-chain balances
   - Future: Backend will read from blockchain as source of truth

2. **No Event Listeners**: App doesn't listen to contract events
   - Must manually refresh to see other users' transactions
   - Future: WebSocket connection to monitor events

3. **No Transaction History**: Only shows current balance
   - Can't see past deposits/withdrawals in UI
   - Must check Ronin explorer for history
   - Future: Transaction history table

4. **Testnet Only**: Not deployed to mainnet
   - Test tokens have no real value
   - For production: Deploy to Ronin mainnet

## 📝 Next Steps for Production

1. **Deploy to Mainnet**
   ```bash
   cd contracts
   npm run deploy:mainnet
   ```

2. **Update Frontend Config**
   ```typescript
   // src/config/contracts.ts
   export const CONTRACTS = {
     AETH_TOKEN: 'MAINNET_AETH_ADDRESS',
     WALLET_MANAGER: 'MAINNET_WALLET_ADDRESS',
   };
   ```

3. **Add Backend Verification**
   - Verify all transactions on-chain before updating database
   - Listen to contract events for real-time sync

4. **Implement Transaction Queue**
   - Handle multiple pending transactions
   - Show transaction status (pending, confirmed, failed)

5. **Add Analytics**
   - Track total deposits/withdrawals
   - Monitor fee collection
   - User transaction volume

## 💬 Support

**Having issues?**
- Check troubleshooting section above
- Verify you're on Ronin Saigon Testnet
- Ensure you have testnet RON for gas
- Open browser console (F12) to see detailed errors

**Need testnet AETH?**
- Contact deployer: `0x40c078F1665677d3918Ec47F382fb9F581fADE56`

**Found a bug?**
- Check transaction hash on Ronin explorer
- Take screenshot of error message
- Note steps to reproduce

## 🎉 Success Criteria

You've successfully tested the integration if you can:
- ✅ Connect Ronin Wallet
- ✅ See green "Connected to Ronin" status
- ✅ Deposit AETH (2 transactions)
- ✅ See on-chain balance update
- ✅ Withdraw AETH with 5% fee
- ✅ Deposit RON (1 transaction)
- ✅ Withdraw RON with 0% fee
- ✅ Verify transaction on Ronin explorer

**Congratulations! The blockchain integration is working! 🚀**
