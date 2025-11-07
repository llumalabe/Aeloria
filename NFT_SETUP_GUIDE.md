# NFT Metadata API Setup Guide

## ✅ สิ่งที่สร้างเสร็จแล้ว:

### Backend:
1. **Model**: `SurvivorNFT.model.ts` - MongoDB schema สำหรับเก็บข้อมูล NFT
2. **Routes**: `nft.routes.ts` - API endpoints สำหรับ NFT metadata
3. **Integration**: เพิ่ม route ใน `index.ts` แล้ว

### Frontend:
1. **Config**: `src/config/contracts.ts` - Contract addresses และ network config

---

## 🚀 ขั้นตอนการ Deploy:

### Step 1: Deploy Smart Contract (บน Ronin Developer Console)

1. ไปที่ https://developers.skymavis.com/console/smart-contracts
2. เลือก **"ERC721 Common"**
3. กรอกข้อมูล:
   ```
   Name: Dead Zone Survivors
   Symbol: DZS
   Base URI: https://aeloria-two.vercel.app/api/nft/metadata/
   ```
   > ⚠️ **สำคัญ**: ต้องลงท้ายด้วย `/` เสมอ!

4. คลิก **Deploy** (ฟรี ไม่เสียค่า gas)
5. รอซักครู่ จะได้ **Contract Address** เช่น: `0x1234...abcd`
6. **คัดลอก Contract Address ไว้!**

---

### Step 2: ตั้งค่า Contract Address

**Frontend** (`aeloria-guardians/.env.local`):
```env
NEXT_PUBLIC_SURVIVOR_NFT_ADDRESS=0xYOUR_CONTRACT_ADDRESS_HERE
NEXT_PUBLIC_API_URL=https://aeloria-two.vercel.app
NEXT_PUBLIC_CHAIN_ID=2021
```

**Backend** (`aeloria-guardians/backend/.env`):
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/deadzone
FRONTEND_URL=https://aeloria-two.vercel.app
CDN_URL=https://aeloria-two.vercel.app/images
SURVIVOR_NFT_CONTRACT=0xYOUR_CONTRACT_ADDRESS_HERE
```

---

### Step 3: เริ่ม Backend Server

```bash
cd backend
npm install
npm run dev
```

Server จะรันที่ `http://localhost:3001`

---

### Step 4: ทดสอบ API

**Test metadata endpoint:**
```bash
curl http://localhost:3001/api/nft/metadata/1
```

**Expected Response (ถ้ายังไม่มีข้อมูล):**
```json
{
  "error": "NFT not found",
  "message": "Survivor #1 does not exist"
}
```

---

### Step 5: Mint NFT ตัวแรก

#### Option A: ใช้ Ronin Developer Console (แนะนำ)

1. ไปที่หน้า Contract Functions
2. เลือก **"mint"**
3. กรอกข้อมูล:
   ```
   to: YOUR_WALLET_ADDRESS (เช่น 0x742d...)
   tokenId: 1
   ```
4. คลิก **Execute**
5. รอ transaction confirm

#### Option B: ใช้ Backend API

```bash
curl -X POST http://localhost:3001/api/nft/mint \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 1,
    "ownerAddress": "0xYOUR_WALLET_ADDRESS",
    "class": "Soldier",
    "rarity": "Common"
  }'
```

---

### Step 6: ตรวจสอบ Metadata

```bash
curl http://localhost:3001/api/nft/metadata/1
```

**Expected Response:**
```json
{
  "name": "Survivor #1",
  "description": "A Common Soldier who survived the zombie apocalypse",
  "image": "https://aeloria-two.vercel.app/images/survivors/soldier-common.png",
  "external_url": "https://aeloria-two.vercel.app/nft/1",
  "attributes": [
    {
      "trait_type": "Class",
      "value": "Soldier"
    },
    {
      "trait_type": "Rarity",
      "value": "Common"
    },
    {
      "trait_type": "Level",
      "value": 1,
      "display_type": "number"
    },
    {
      "trait_type": "HP",
      "value": 150,
      "max_value": 150,
      "display_type": "boost_number"
    },
    {
      "trait_type": "Strength",
      "value": 20,
      "display_type": "boost_number"
    }
  ]
}
```

---

## 📍 API Endpoints:

### GET `/api/nft/metadata/:tokenId`
ดึง metadata ของ NFT (OpenSea standard format)

### POST `/api/nft/mint`
สร้าง metadata หลัง mint on-chain
```json
{
  "tokenId": 1,
  "ownerAddress": "0x...",
  "class": "Soldier",
  "rarity": "Common"
}
```

### GET `/api/nft/owner/:address`
ดึง NFT ทั้งหมดของ address

### PATCH `/api/nft/:tokenId/stats`
อัปเดต stats (level up, equipment, etc.)

---

## 🎨 Survivor Classes & Stats:

### Soldier (ทหาร)
- HP: 150, STR: 20, AGI: 12, INT: 10, LUK: 8, VIT: 18
- Skills: Headshot, Last Stand
- เหมาะสำหรับ: Combat, Tank

### Medic (หมอ)
- HP: 100, STR: 8, AGI: 12, INT: 20, LUK: 15, VIT: 12
- Skills: First Aid, Revive
- เหมาะสำหรับ: Support, Healing

### Engineer (ช่าง)
- HP: 120, STR: 12, AGI: 10, INT: 18, LUK: 12, VIT: 14
- Skills: Repair, Build Trap
- เหมาะสำหรับ: Crafting, Defense

### Scout (ลาดตระเวน)
- HP: 110, STR: 10, AGI: 20, INT: 12, LUK: 18, VIT: 10
- Skills: Scavenge, Stealth
- เหมาะสำหรับ: Exploration, Loot

---

## 🔥 Rarity Multipliers:

- Common: 1x
- Uncommon: 1.2x
- Rare: 1.5x
- Epic: 2x
- Legendary: 3x

---

## ❓ FAQ:

### Q: Base URI ควรเป็นอะไร?
A: `https://aeloria-two.vercel.app/api/nft/metadata/` (ต้องมี `/` ท้าย!)

### Q: NFT ไม่แสดงรูป?
A: ต้องเพิ่มรูป survivor ที่ `public/images/survivors/`

### Q: ทดสอบบน Testnet หรือ Mainnet?
A: แนะนำ Saigon Testnet ก่อน (ฟรี ไม่เสีย RON)

### Q: Contract Address ใส่ที่ไหน?
A: ไฟล์ `.env.local` (frontend) และ `.env` (backend)

---

## 🎮 Next Steps:

1. ✅ Deploy ERC721 contract
2. ✅ Set Base URI
3. ✅ Configure contract address
4. ⏳ Mint first NFT
5. ⏳ Test metadata endpoint
6. ⏳ Create survivor images
7. ⏳ Integrate with frontend game UI

---

**มีปัญหา?** แจ้งได้เลยครับ! 🚀
