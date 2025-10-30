# เพิ่ม Transactions Endpoint ใน Backend

## ปัญหา
Frontend พยายามเรียก:
```
GET /api/users/:address/transactions?limit=50
```
แต่ backend ยังไม่มี endpoint นี้ → Error 404

## วิธีแก้

### 1. เพิ่ม Route ใน `user.routes.ts`

```typescript
// GET /api/users/:address/transactions
router.get('/:address/transactions', async (req, res) => {
  try {
    const { address } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const user = await User.findOne({ 
      walletAddress: address.toLowerCase() 
    });

    if (!user) {
      return res.json({ transactions: [] }); // Return empty array instead of 404
    }

    // Get transactions from user model
    const transactions = user.transactions || [];
    
    // Sort by timestamp descending (newest first)
    const sortedTx = transactions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    res.json({ transactions: sortedTx });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});
```

### 2. Update User Model (ถ้ายังไม่มี transactions field)

```typescript
// user.model.ts
const userSchema = new Schema({
  walletAddress: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  gold: { type: Number, default: 1000 },
  aethTokens: { type: Number, default: 0 },
  ronTokens: { type: Number, default: 0 },
  
  // Add transactions array
  transactions: [{
    txHash: { type: String, required: true },
    type: { type: String, enum: ['deposit', 'withdraw'], required: true },
    tokenType: { type: String, enum: ['AETH', 'RON'], required: true },
    amount: { type: String, required: true },
    fee: { type: String, default: '0' },
    status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'confirmed' },
    timestamp: { type: Date, default: Date.now },
    blockNumber: { type: Number },
    verified: { type: Boolean, default: false }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 3. Update Deposit/Withdraw Endpoints

เมื่อมีการ deposit/withdraw ให้บันทึก transaction:

```typescript
// POST /api/users/:address/wallet/deposit
router.post('/:address/wallet/deposit', async (req, res) => {
  try {
    const { address } = req.params;
    const { txHash, tokenType } = req.body;

    // Verify transaction on blockchain (optional but recommended)
    // const verified = await blockchainService.verifyTransaction(txHash);

    const user = await User.findOne({ 
      walletAddress: address.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add transaction to history
    user.transactions.push({
      txHash,
      type: 'deposit',
      tokenType,
      amount: '0', // You can parse amount from blockchain
      fee: '0',
      status: 'confirmed',
      timestamp: new Date(),
      verified: false // Set to true after blockchain verification
    });

    await user.save();

    res.json({ 
      message: 'Deposit recorded',
      transaction: user.transactions[user.transactions.length - 1]
    });
  } catch (error) {
    console.error('Error recording deposit:', error);
    res.status(500).json({ error: 'Failed to record deposit' });
  }
});
```

## ทดสอบ

1. เพิ่ม route ตามข้างบน
2. Restart backend server
3. ทดสอบ:
```bash
curl https://aeloria-backend.onrender.com/api/users/0x40c078f1665677d3918ec47f382fb9f581fade56/transactions?limit=50
```

ควรได้:
```json
{
  "transactions": []
}
```
หรือ
```json
{
  "transactions": [
    {
      "txHash": "0x...",
      "type": "deposit",
      "tokenType": "AETH",
      "amount": "100",
      "status": "confirmed",
      "timestamp": "2025-10-30T10:00:00.000Z"
    }
  ]
}
```

## หมายเหตุ

- ตอนนี้ผม **comment Transaction History ใน frontend แล้ว** เพื่อไม่ให้เกิด error
- เมื่อเพิ่ม endpoint ใน backend เสร็จแล้ว ให้ uncomment ใน `town/page.tsx`
- ถ้าต้องการ blockchain verification แบบเต็ม ให้ตามคู่มือใน `BACKEND_VERIFICATION_GUIDE.md`
