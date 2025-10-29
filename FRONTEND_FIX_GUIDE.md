# 🎨 แก้ไข Frontend - Characters Page

## ปัญหา
Frontend ยังแสดงปุ่ม "Create Your Character" และให้เลือก class เพื่อ mint character

## ระบบใหม่ที่ถูกต้อง
✅ Register แล้วได้ **Starter Warrior** อัตโนมัติ  
✅ หน้า Characters แสดง **2 Tabs**:
- **In-Game Tab**: Starter Warrior + characters ที่ import จาก NFT แล้ว
- **Wallet Tab**: NFT characters ที่ยังไม่ได้ import (มีปุ่ม Import)
✅ **ไม่มีปุ่ม** "Create Character"  
✅ ใช้ **Gacha** ในการสุ่มตัวละคร NFT ใหม่

---

## วิธีแก้

### 1. สร้างหน้า Characters ใหม่

สร้างไฟล์ `src/app/characters/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface Character {
  _id: string;
  characterName: string;
  characterClass: number;
  level: number;
  exp: number;
  hp: number;
  maxHp: number;
  str: number;
  agi: number;
  int: number;
  luk: number;
  vit: number;
  isNFT: boolean;
  isBoundToAccount: boolean;
  tokenId?: number;
}

const CLASS_NAMES = ['Warrior', 'Mage', 'Archer', 'Rogue', 'Cleric', 'Paladin'];
const CLASS_ICONS = ['⚔️', '🔮', '🏹', '🗡️', '✨', '🛡️'];

export default function CharactersPage() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'ingame' | 'wallet'>('ingame');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address) {
      loadCharacters();
    }
  }, [address, activeTab]);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      const filter = activeTab === 'ingame' ? 'ingame' : 'wallet';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/characters/${address}?filter=${filter}`
      );
      const data = await response.json();
      
      if (data.success) {
        setCharacters(data.characters);
      }
    } catch (error) {
      console.error('Failed to load characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportNFT = async (tokenId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/characters/import-nft`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: address,
            tokenId,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert('Character imported successfully!');
        loadCharacters();
      } else {
        alert(data.error || 'Failed to import character');
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import character');
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">⚔️ My Characters</h1>
          <p className="text-gray-300">Please connect your wallet first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">
          ⚔️ My Characters
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('ingame')}
            className={`px-8 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'ingame'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎮 In-Game Characters
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-8 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'wallet'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            👛 Wallet NFTs
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-4 mb-6">
          {activeTab === 'ingame' ? (
            <p className="text-blue-200">
              💡 <strong>In-Game Characters</strong> are bound to your account and can be used in dungeons, PvP, and quests.
            </p>
          ) : (
            <p className="text-blue-200">
              💡 <strong>Wallet NFTs</strong> are owned by you on the blockchain. Click "Import" to use them in-game!
            </p>
          )}
        </div>

        {/* Characters Grid */}
        {loading ? (
          <div className="text-center text-gray-300">Loading characters...</div>
        ) : characters.length === 0 ? (
          <div className="text-center">
            <div className="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg p-12">
              {activeTab === 'ingame' ? (
                <>
                  <p className="text-gray-400 text-lg mb-4">
                    No characters found. You should have a Starter Warrior!
                  </p>
                  <p className="text-gray-500">
                    Try refreshing the page or check if you registered successfully.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-400 text-lg mb-4">
                    No NFT characters in your wallet
                  </p>
                  <p className="text-gray-500 mb-4">
                    Use the <strong>Gacha</strong> to summon new NFT characters!
                  </p>
                  <a
                    href="/gacha"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold"
                  >
                    🎰 Go to Gacha
                  </a>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char) => (
              <div
                key={char._id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-600 rounded-lg p-6 hover:shadow-xl hover:shadow-yellow-500/50 transition-all"
              >
                {/* Character Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">
                      {CLASS_ICONS[char.characterClass]}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-400">
                        {char.characterName}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {CLASS_NAMES[char.characterClass]} • Lv.{char.level}
                      </p>
                    </div>
                  </div>
                </div>

                {/* HP Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-400">HP</span>
                    <span className="text-gray-300">
                      {char.hp}/{char.maxHp}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full"
                      style={{ width: `${(char.hp / char.maxHp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-700/50 rounded px-3 py-2">
                    <span className="text-xs text-gray-400">STR</span>
                    <p className="text-lg font-bold text-red-400">{char.str}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded px-3 py-2">
                    <span className="text-xs text-gray-400">AGI</span>
                    <p className="text-lg font-bold text-green-400">{char.agi}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded px-3 py-2">
                    <span className="text-xs text-gray-400">INT</span>
                    <p className="text-lg font-bold text-blue-400">{char.int}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded px-3 py-2">
                    <span className="text-xs text-gray-400">LUK</span>
                    <p className="text-lg font-bold text-yellow-400">{char.luk}</p>
                  </div>
                </div>

                {/* EXP Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-400">EXP</span>
                    <span className="text-gray-400">{char.exp} / 100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${(char.exp / 100) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Character Type Badge */}
                <div className="flex items-center justify-between">
                  {char.isNFT ? (
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🎫 NFT #{char.tokenId}
                    </span>
                  ) : (
                    <span className="bg-gray-600 text-gray-200 px-3 py-1 rounded-full text-xs font-bold">
                      🔒 Account-Bound
                    </span>
                  )}

                  {/* Import Button (only in Wallet tab for unbound NFTs) */}
                  {activeTab === 'wallet' && !char.isBoundToAccount && (
                    <button
                      onClick={() => handleImportNFT(char.tokenId!)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm"
                    >
                      Import
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            {activeTab === 'ingame' 
              ? 'Use your characters in Dungeon, PvP, and Quests!'
              : 'Import NFTs from your wallet to use them in-game'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

### 2. อัพเดท Navigation/Layout

แก้ไฟล์ที่มี navigation link ให้ชี้ไปที่ `/characters` แทน `/dashboard`

หาไฟล์เช่น:
- `src/app/layout.tsx`
- `src/components/Navigation.tsx` (ถ้ามี)

เปลี่ยนจาก:
```tsx
<Link href="/dashboard">Characters</Link>
```

เป็น:
```tsx
<Link href="/characters">Characters</Link>
```

---

### 3. ลบ CharacterCreationModal (Optional)

ไฟล์ `src/components/CharacterCreationModal.tsx` ไม่ต้องใช้แล้ว แต่ยังไว้ก่อนก็ได้

---

### 4. Deploy to Vercel

```powershell
cd c:\Users\User\aeloria-guardians
git add -A
git commit -m "Update Characters page with In-Game/Wallet tabs"
git push
```

Vercel จะ auto-deploy ใหม่ (2-3 นาที)

---

## ✅ ผลลัพธ์ที่ต้องการ

เมื่อเปิด https://aeloria-two.vercel.app/characters:

**In-Game Tab:**
- ✅ แสดง "Starter Warrior" Lv.1
- ✅ แสดง stats (STR 15, AGI 8, INT 5, LUK 7, VIT 12)
- ✅ แสดง badge "🔒 Account-Bound"
- ❌ ไม่มีปุ่ม "Create Character"

**Wallet Tab:**
- ✅ แสดง NFT characters (ถ้ามี)
- ✅ มีปุ่ม "Import" สำหรับ NFT ที่ยังไม่ได้ import
- ✅ แนะนำให้ไป Gacha ถ้าไม่มี NFT

---

## 🔧 Troubleshooting

### ไม่เห็น Starter Warrior
1. เช็ค API response: `GET /api/characters/{address}?filter=ingame`
2. ตรวจสอบว่า register สำเร็จไหม
3. ดู Render logs ว่ามี error ไหม

### ปุ่ม Import ไม่ทำงาน
1. เช็ค API endpoint: `POST /api/characters/import-nft`
2. ตรวจสอบ tokenId ถูกต้อง
3. ดู Network tab (F12) เพื่อดู error

---

**เมื่อทำเสร็จจะได้ระบบ Characters ที่ถูกต้องแล้ว!** 🎉
