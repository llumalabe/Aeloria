# Backend Blockchain Verification & Transaction History

## Files to Create/Modify

### 1. Backend Blockchain Service

Create `backend/src/services/blockchain.service.ts`:

```typescript
import { ethers } from 'ethers';
import AeloriaTokenABI from './abis/AeloriaToken.json';
import WalletManagerABI from './abis/WalletManager.json';

// Contract addresses from environment
const AETH_TOKEN_ADDRESS = process.env.AETH_TOKEN_ADDRESS || '0x6e937B8dF644fbbD663058323337179863866d41';
const WALLET_MANAGER_ADDRESS = process.env.WALLET_MANAGER_ADDRESS || '0x9fDF58EAf8197237b432e4901391D804E156e4c9';
const RONIN_RPC_URL = process.env.RONIN_RPC_URL || 'https://saigon-testnet.roninchain.com/rpc';

/**
 * Blockchain verification service
 * Verifies transactions and balances on Ronin Network
 */
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private aethContract: ethers.Contract;
  private walletContract: ethers.Contract;

  constructor() {
    // Initialize provider
    this.provider = new ethers.JsonRpcProvider(RONIN_RPC_URL);

    // Initialize contracts (read-only)
    this.aethContract = new ethers.Contract(
      AETH_TOKEN_ADDRESS,
      AeloriaTokenABI,
      this.provider
    );

    this.walletContract = new ethers.Contract(
      WALLET_MANAGER_ADDRESS,
      WalletManagerABI,
      this.provider
    );
  }

  /**
   * Verify transaction exists and is confirmed
   */
  async verifyTransaction(txHash: string): Promise<{
    success: boolean;
    receipt?: ethers.TransactionReceipt;
    error?: string;
  }> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        return { success: false, error: 'Transaction not found' };
      }

      if (receipt.status === 0) {
        return { success: false, error: 'Transaction failed on blockchain' };
      }

      return { success: true, receipt };
    } catch (error: any) {
      console.error('Transaction verification error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's on-chain balances
   */
  async getOnChainBalances(address: string): Promise<{
    aethBalance: string;
    ronBalance: string;
  } | null> {
    try {
      const balances = await this.walletContract.getBalances(address);
      
      return {
        aethBalance: ethers.formatEther(balances.aethBalance),
        ronBalance: ethers.formatEther(balances.ronBalance),
      };
    } catch (error) {
      console.error('Failed to get on-chain balances:', error);
      return null;
    }
  }

  /**
   * Parse transaction receipt to extract event data
   */
  parseTransactionEvents(receipt: ethers.TransactionReceipt): Array<{
    eventName: string;
    args: any;
  }> {
    const events: Array<{ eventName: string; args: any }> = [];

    for (const log of receipt.logs) {
      try {
        // Try to parse with WalletManager ABI
        const parsed = this.walletContract.interface.parseLog({
          topics: log.topics as string[],
          data: log.data,
        });

        if (parsed) {
          events.push({
            eventName: parsed.name,
            args: parsed.args,
          });
        }
      } catch (e) {
        // Log doesn't match WalletManager events, skip
      }
    }

    return events;
  }

  /**
   * Verify deposit transaction
   */
  async verifyDepositTransaction(txHash: string, expectedUser: string, tokenType: 'AETH' | 'RON'): Promise<{
    success: boolean;
    amount?: string;
    error?: string;
  }> {
    try {
      const { success, receipt, error } = await this.verifyTransaction(txHash);
      
      if (!success || !receipt) {
        return { success: false, error };
      }

      const events = this.parseTransactionEvents(receipt);
      const expectedEvent = tokenType === 'AETH' ? 'AethDeposited' : 'RonDeposited';
      
      const depositEvent = events.find(e => e.eventName === expectedEvent);
      
      if (!depositEvent) {
        return { success: false, error: `No ${expectedEvent} event found` };
      }

      // Verify the user address matches
      const eventUser = depositEvent.args.user.toLowerCase();
      if (eventUser !== expectedUser.toLowerCase()) {
        return { success: false, error: 'User address mismatch' };
      }

      const amount = ethers.formatEther(depositEvent.args.amount);
      
      return { success: true, amount };
    } catch (error: any) {
      console.error('Deposit verification error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify withdrawal transaction
   */
  async verifyWithdrawalTransaction(txHash: string, expectedUser: string, tokenType: 'AETH' | 'RON'): Promise<{
    success: boolean;
    amount?: string;
    fee?: string;
    error?: string;
  }> {
    try {
      const { success, receipt, error } = await this.verifyTransaction(txHash);
      
      if (!success || !receipt) {
        return { success: false, error };
      }

      const events = this.parseTransactionEvents(receipt);
      const expectedEvent = tokenType === 'AETH' ? 'AethWithdrawn' : 'RonWithdrawn';
      
      const withdrawEvent = events.find(e => e.eventName === expectedEvent);
      
      if (!withdrawEvent) {
        return { success: false, error: `No ${expectedEvent} event found` };
      }

      // Verify the user address matches
      const eventUser = withdrawEvent.args.user.toLowerCase();
      if (eventUser !== expectedUser.toLowerCase()) {
        return { success: false, error: 'User address mismatch' };
      }

      const amount = ethers.formatEther(withdrawEvent.args.amount);
      const fee = withdrawEvent.args.fee ? ethers.formatEther(withdrawEvent.args.fee) : '0';
      
      return { success: true, amount, fee };
    } catch (error: any) {
      console.error('Withdrawal verification error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
```

---

### 2. Update User Model for Transaction History

Modify `backend/src/models/User.model.ts`:

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction {
  type: 'deposit' | 'withdraw';
  tokenType: 'AETH' | 'RON';
  amount: string;
  fee?: string;
  txHash: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface IUser extends Document {
  walletAddress: string;
  username: string;
  level: number;
  exp: number;
  gold: number;
  premiumCurrency: number;
  tokenBalance: number; // AETH in-game balance
  ronTokens: number; // RON in-game balance
  totalPower: number;
  energy: number;
  maxEnergy: number;
  lastEnergyReset: Date;
  lastLogin: Date;
  createdAt: Date;
  // NEW: Transaction history
  transactions: ITransaction[];
}

const TransactionSchema = new Schema({
  type: { type: String, enum: ['deposit', 'withdraw'], required: true },
  tokenType: { type: String, enum: ['AETH', 'RON'], required: true },
  amount: { type: String, required: true },
  fee: { type: String, default: '0' },
  txHash: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
});

const UserSchema = new Schema({
  walletAddress: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, required: true },
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  gold: { type: Number, default: 0 },
  premiumCurrency: { type: Number, default: 0 },
  tokenBalance: { type: Number, default: 0 },
  ronTokens: { type: Number, default: 0 },
  totalPower: { type: Number, default: 0 },
  energy: { type: Number, default: 30 },
  maxEnergy: { type: Number, default: 30 },
  lastEnergyReset: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  transactions: [TransactionSchema], // NEW
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
```

---

### 3. Update Wallet Routes with Verification

Modify `backend/src/routes/user.routes.ts`:

```typescript
import { Router } from 'express';
import User from '../models/User.model';
import { blockchainService } from '../services/blockchain.service';

const router = Router();

/**
 * POST /api/users/:walletAddress/wallet/deposit
 * Verify and record deposit transaction
 */
router.post('/:walletAddress/wallet/deposit', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { txHash, tokenType } = req.body;

    if (!txHash || !tokenType) {
      return res.status(400).json({ 
        success: false, 
        error: 'txHash and tokenType are required' 
      });
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Verify transaction on blockchain
    console.log(`Verifying ${tokenType} deposit: ${txHash}`);
    const verification = await blockchainService.verifyDepositTransaction(
      txHash,
      normalizedAddress,
      tokenType
    );

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        error: `Transaction verification failed: ${verification.error}`,
      });
    }

    // Get user
    const user = await User.findOne({ walletAddress: normalizedAddress });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check if transaction already recorded
    const existingTx = user.transactions.find(tx => tx.txHash === txHash);
    if (existingTx) {
      return res.status(400).json({
        success: false,
        error: 'Transaction already recorded',
      });
    }

    // Update balances and add transaction record
    const amount = parseFloat(verification.amount!);
    
    if (tokenType === 'AETH') {
      user.tokenBalance += amount;
    } else {
      user.ronTokens += amount;
    }

    user.transactions.push({
      type: 'deposit',
      tokenType,
      amount: verification.amount!,
      txHash,
      timestamp: new Date(),
      status: 'confirmed',
    } as any);

    await user.save();

    res.json({
      success: true,
      message: `Successfully deposited ${verification.amount} ${tokenType}`,
      amount: verification.amount,
      newBalance: tokenType === 'AETH' ? user.tokenBalance : user.ronTokens,
    });
  } catch (error: any) {
    console.error('Deposit error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/users/:walletAddress/wallet/withdraw
 * Verify and record withdrawal transaction
 */
router.post('/:walletAddress/wallet/withdraw', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { txHash, tokenType } = req.body;

    if (!txHash || !tokenType) {
      return res.status(400).json({ 
        success: false, 
        error: 'txHash and tokenType are required' 
      });
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Verify transaction on blockchain
    console.log(`Verifying ${tokenType} withdrawal: ${txHash}`);
    const verification = await blockchainService.verifyWithdrawalTransaction(
      txHash,
      normalizedAddress,
      tokenType
    );

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        error: `Transaction verification failed: ${verification.error}`,
      });
    }

    // Get user
    const user = await User.findOne({ walletAddress: normalizedAddress });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check if transaction already recorded
    const existingTx = user.transactions.find(tx => tx.txHash === txHash);
    if (existingTx) {
      return res.status(400).json({
        success: false,
        error: 'Transaction already recorded',
      });
    }

    // Update balances and add transaction record
    const amount = parseFloat(verification.amount!);
    
    if (tokenType === 'AETH') {
      user.tokenBalance = Math.max(0, user.tokenBalance - amount);
    } else {
      user.ronTokens = Math.max(0, user.ronTokens - amount);
    }

    user.transactions.push({
      type: 'withdraw',
      tokenType,
      amount: verification.amount!,
      fee: verification.fee || '0',
      txHash,
      timestamp: new Date(),
      status: 'confirmed',
    } as any);

    await user.save();

    res.json({
      success: true,
      message: `Successfully withdrew ${verification.amount} ${tokenType}`,
      amount: verification.amount,
      fee: verification.fee,
      newBalance: tokenType === 'AETH' ? user.tokenBalance : user.ronTokens,
    });
  } catch (error: any) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/users/:walletAddress/transactions
 * Get transaction history
 */
router.get('/:walletAddress/transactions', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { limit = 50, type, tokenType } = req.query;

    const normalizedAddress = walletAddress.toLowerCase();

    const user = await User.findOne({ walletAddress: normalizedAddress });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    let transactions = user.transactions;

    // Filter by type if specified
    if (type) {
      transactions = transactions.filter(tx => tx.type === type);
    }

    // Filter by token type if specified
    if (tokenType) {
      transactions = transactions.filter(tx => tx.tokenType === tokenType);
    }

    // Sort by timestamp (newest first) and limit
    transactions = transactions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, parseInt(limit as string));

    res.json({
      success: true,
      transactions,
      total: transactions.length,
    });
  } catch (error: any) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/users/:walletAddress/wallet/verify-balances
 * Compare database balances with on-chain balances
 */
router.get('/:walletAddress/wallet/verify-balances', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const normalizedAddress = walletAddress.toLowerCase();

    const user = await User.findOne({ walletAddress: normalizedAddress });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const onChainBalances = await blockchainService.getOnChainBalances(normalizedAddress);
    
    if (!onChainBalances) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch on-chain balances' 
      });
    }

    res.json({
      success: true,
      database: {
        aethBalance: user.tokenBalance,
        ronBalance: user.ronTokens,
      },
      blockchain: {
        aethBalance: parseFloat(onChainBalances.aethBalance),
        ronBalance: parseFloat(onChainBalances.ronBalance),
      },
      synced: {
        aeth: Math.abs(user.tokenBalance - parseFloat(onChainBalances.aethBalance)) < 0.0001,
        ron: Math.abs(user.ronTokens - parseFloat(onChainBalances.ronBalance)) < 0.0001,
      },
    });
  } catch (error: any) {
    console.error('Verify balances error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

---

### 4. Copy Contract ABIs to Backend

Copy these files:
- `contracts/aeth-abi.json` → `backend/src/services/abis/AeloriaToken.json`
- `contracts/wallet-abi.json` → `backend/src/services/abis/WalletManager.json`

---

### 5. Update Backend .env

Add to `backend/.env`:

```env
# Blockchain Configuration
RONIN_RPC_URL=https://saigon-testnet.roninchain.com/rpc
AETH_TOKEN_ADDRESS=0x6e937B8dF644fbbD663058323337179863866d41
WALLET_MANAGER_ADDRESS=0x9fDF58EAf8197237b432e4901391D804E156e4c9
```

---

### 6. Install ethers.js in Backend

```bash
cd backend
npm install ethers@6.9.0
```

---

## How It Works

### Deposit Flow:
1. **Frontend**: User deposits via blockchain → Get txHash
2. **Frontend**: Send txHash to `/api/users/:address/wallet/deposit`
3. **Backend**: Verify transaction on blockchain
4. **Backend**: Parse events to get deposited amount
5. **Backend**: Update database balances
6. **Backend**: Save transaction history

### Withdrawal Flow:
1. **Frontend**: User withdraws via blockchain → Get txHash
2. **Frontend**: Send txHash to `/api/users/:address/wallet/withdraw`
3. **Backend**: Verify transaction on blockchain
4. **Backend**: Parse events to get withdrawn amount + fee
5. **Backend**: Update database balances (deduct amount)
6. **Backend**: Save transaction history

### Security Features:
- ✅ Verifies transaction exists on blockchain
- ✅ Checks transaction status (success/failed)
- ✅ Validates user address matches event
- ✅ Prevents duplicate transaction recording
- ✅ Stores transaction hash for audit trail
- ✅ Can verify database vs blockchain balances anytime

---

## Next: Frontend Integration

Update Town page to send txHash to backend after blockchain transaction completes.
