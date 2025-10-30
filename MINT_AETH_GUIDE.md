# 🎁 วิธี Mint AETH Testnet Tokens

## ปัญหา
- AETH contract ยัง empty (ไม่มี balance)
- User ไม่สามารถ mint ได้เอง (only owner)
- ต้องการ AETH เพื่อทดสอบ deposit/withdraw

## วิธีแก้ (แบบด่วน)

### 1. Mint ผ่าน Hardhat Script

สร้างไฟล์ `contracts/scripts/mint-aeth.js`:

```javascript
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const aethAddress = '0x6e937B8dF644fbbD663058323337179863866d41';
  const recipientAddress = '0x40c078f1665677d3918ec47f382fb9f581fade56'; // Your wallet
  const amount = ethers.parseEther('1000'); // 1000 AETH
  
  const AETH = await ethers.getContractAt('AeloriaToken', aethAddress);
  
  console.log('Minting', ethers.formatEther(amount), 'AETH to', recipientAddress);
  
  const tx = await AETH.mint(recipientAddress, amount);
  await tx.wait();
  
  console.log('✅ Minted successfully!');
  console.log('TX:', tx.hash);
  
  const balance = await AETH.balanceOf(recipientAddress);
  console.log('New balance:', ethers.formatEther(balance), 'AETH');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 2. Run Script

```bash
cd contracts
npx hardhat run scripts/mint-aeth.js --network ronin-testnet
```

### 3. ผลลัพธ์

```
Minting 1000 AETH to 0x40c078f1665677d3918ec47f382fb9f581fade56
✅ Minted successfully!
TX: 0x...
New balance: 1000.0 AETH
```

## วิธีทดสอบในเกม

หลังจาก mint แล้ว:

1. **Refresh หน้าเกม**
2. **Login → Town → Wallet**
3. ดู On-Chain AETH → ควรเห็น 1000 AETH
4. **ทดสอบ Deposit**: 
   - กรอก 100 AETH
   - Approve → Deposit
   - ✅ สำเร็จ!
5. **ทดสอบ Withdraw**:
   - กรอก 50 AETH
   - Withdraw
   - ✅ รับ 47.5 AETH (หัก fee 5%)

## หมายเหตุ

- Script ต้อง run ด้วย **deployer wallet** (owner)
- ถ้า error "Only owner" → เช็คว่าใช้ private key ถูกต้องใน `.env`
- Mint ได้ไม่จำกัด (testnet)
- Production: ต้องสร้าง Faucet Contract แยก
