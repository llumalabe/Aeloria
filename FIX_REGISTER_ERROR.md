# 🔧 แก้ไข Register Error 500

## ปัญหา
```
POST /api/users/register → 500 Internal Server Error
```

## สาเหตุ
Backend crash เพราะ Character schema หรือ missing fields

---

## วิธีแก้ (ใน c:\Users\User\aeloria-guardians)

### 1. แก้ `backend/src/routes/user.routes.ts`

เปิดไฟล์ `backend/src/routes/user.routes.ts` แล้วแก้ตรง register route:

**แก้จาก:**
```typescript
// POST /api/users/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { walletAddress, username } = req.body;

    const normalizedAddress = walletAddress.toLowerCase();

    // Check if user exists
    const existingUser = await User.findOne({ walletAddress: normalizedAddress });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create new user
    const user = new User({
      walletAddress: normalizedAddress,
      username,
    });

    await user.save();

    // Auto-create starter Warrior character
    const starterStats = getWarriorStats();
    const starterCharacter = new Character({
      walletAddress: normalizedAddress,
      characterName: 'Starter Warrior',
      characterClass: CharacterClass.WARRIOR,
      level: 1,
      exp: 0,
      ...starterStats,
      isNFT: false,
      isBoundToAccount: true,
      tokenId: null,
    });

    await starterCharacter.save();

    res.json({ 
      success: true, 
      user,
      starterCharacter,
      message: 'User registered with starter character'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

**เป็น (เพิ่ม logging และ validation):**
```typescript
// POST /api/users/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { walletAddress, username } = req.body;

    // Validate input
    if (!walletAddress) {
      return res.status(400).json({ success: false, error: 'Wallet address is required' });
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Check if user exists
    const existingUser = await User.findOne({ walletAddress: normalizedAddress });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create new user (username is optional)
    const user = new User({
      walletAddress: normalizedAddress,
      username: username || `Player_${normalizedAddress.slice(0, 6)}`,
    });

    await user.save();
    console.log('✅ User created:', normalizedAddress);

    // Auto-create starter Warrior character
    const starterStats = getWarriorStats();
    const starterCharacter = new Character({
      walletAddress: normalizedAddress,
      characterName: 'Starter Warrior',
      characterClass: CharacterClass.WARRIOR,
      level: 1,
      exp: 0,
      ...starterStats,
      isNFT: false,
      isBoundToAccount: true,
      tokenId: null,
    });

    await starterCharacter.save();
    console.log('✅ Starter character created for:', normalizedAddress);

    res.json({ 
      success: true, 
      user,
      starterCharacter,
      message: 'User registered with starter character'
    });
  } catch (error: any) {
    console.error('❌ Register Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
```

**สิ่งที่เปลี่ยน:**
- ✅ Validate `walletAddress` ก่อนใช้งาน
- ✅ สร้าง default username ถ้าไม่ได้ส่งมา
- ✅ เพิ่ม console.log เพื่อ debug
- ✅ Return error details ใน development mode

---

### 2. แก้ GET user route (แก้ 404 error)

ในไฟล์เดียวกัน หาตรง:

```typescript
// GET /api/users/:walletAddress - Get user profile
router.get('/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

**แก้เป็น:**
```typescript
// GET /api/users/:walletAddress - Get user profile
router.get('/:walletAddress', async (req, res) => {
  try {
    const normalizedAddress = req.params.walletAddress.toLowerCase();
    console.log('🔍 Looking for user:', normalizedAddress);
    
    const user = await User.findOne({ walletAddress: normalizedAddress });
    
    if (!user) {
      console.log('❌ User not found:', normalizedAddress);
      return res.status(404).json({ 
        success: false, 
        error: 'User not found',
        walletAddress: normalizedAddress 
      });
    }

    console.log('✅ User found:', normalizedAddress);
    res.json({ success: true, user });
  } catch (error: any) {
    console.error('❌ Get User Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

### 3. เช็ค Character Model

เปิดไฟล์ `backend/src/models/Character.model.ts` และตรวจสอบว่ามี fields ครบ:

```typescript
const CharacterSchema = new Schema({
  walletAddress: { type: String, required: true },
  characterName: { type: String, required: true },
  characterClass: { type: Number, required: true },
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  hp: { type: Number, required: true },
  maxHp: { type: Number, required: true },
  str: { type: Number, required: true },
  agi: { type: Number, required: true },
  int: { type: Number, required: true },
  luk: { type: Number, required: true },
  vit: { type: Number, required: true },
  isNFT: { type: Boolean, default: false },
  isBoundToAccount: { type: Boolean, default: false },
  tokenId: { type: Number, default: null },
  // ... rest of fields
});
```

**ถ้าขาดฟิลด์ใดๆ ให้เพิ่มเข้าไป**

---

### 4. Deploy ใหม่

ใน terminal ที่ `c:\Users\User\aeloria-guardians`:

```powershell
cd c:\Users\User\aeloria-guardians
git add -A
git commit -m "Fix register 500 error and add logging"
git push
```

Render จะ auto-deploy ใหม่ (รอ 2-3 นาที)

---

### 5. ทดสอบใน Browser Console

เปิด https://aeloria-two.vercel.app

F12 → Console → พิมพ์:

```javascript
// Test register
fetch('https://aeloria-backend.onrender.com/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: '0xYOUR_WALLET_ADDRESS',
    username: 'TestPlayer'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**ผลลัพธ์ที่ต้องการ:**
```json
{
  "success": true,
  "user": { ... },
  "starterCharacter": { ... },
  "message": "User registered with starter character"
}
```

---

### 6. เช็ค Render Logs

ไปที่ Render Dashboard → Logs

ควรเห็น:
```
✅ User created: 0x...
✅ Starter character created for: 0x...
```

**ถ้ายังเจอ error:**
- ดู error message ใน logs
- เช็ค MongoDB ว่า connect สำเร็จ
- ตรวจสอบ environment variables

---

## 🔍 Debug Checklist

- [ ] `walletAddress` validate แล้ว
- [ ] Default username ถ้าไม่มี
- [ ] Character schema มี fields ครบ
- [ ] MongoDB connection string ถูกต้อง
- [ ] Render logs ไม่มี error
- [ ] Git push สำเร็จ
- [ ] Auto-deploy เสร็จ (Render status = Live)

---

## 💡 Tips

### ดู Real-time Logs ใน Render
1. Render Dashboard → aeloria-backend
2. Tab **Logs**
3. เปิดทิ้งไว้ แล้วลอง register ใหม่
4. จะเห็น error ทันที

### Test API ด้วย Postman/Thunder Client
```
POST https://aeloria-backend.onrender.com/api/users/register
Content-Type: application/json

{
  "walletAddress": "0x1234567890abcdef",
  "username": "TestUser"
}
```
