# 📱 Mobile Wallet Connection Guide

## ✅ อัพเดทเสร็จแล้ว!

ตอนนี้เกมรองรับการเชื่อมต่อกระเป๋าเงินบนมือถือแล้ว! 🎉

---

## 📱 วิธีใช้งานบนมือถือ

### วิธีที่ 1: เปิดจากแอพ Ronin Wallet (แนะนำ!)

1. **เปิดแอพ Ronin Wallet** บนมือถือ
2. **กดที่ Browser/DApp Browser** ในแอพ
3. **พิมพ์ URL เกม** (เช่น https://your-game.vercel.app)
4. **เกมจะเชื่อมต่อกระเป๋าอัตโนมัติ!** ✅

### วิธีที่ 2: เปิดจาก Mobile Browser

1. **เปิด Chrome/Safari** บนมือถือ
2. **เข้าเว็บเกม** (https://your-game.vercel.app)
3. **กดปุ่ม "Connect Wallet"**
4. **กด OK** เมื่อเห็นข้อความ "Mobile Wallet Connection"
5. **จะถูกส่งไปยังแอพ Ronin Wallet อัตโนมัติ**
6. **กด "Connect"** ในแอพ Ronin Wallet
7. **กลับมาที่ Browser** → เชื่อมต่อสำเร็จ! ✅

---

## 🔧 การทำงานของระบบ

### Desktop (คอมพิวเตอร์)
```
User คลิก "Connect Wallet"
  ↓
ตรวจสอบ window.ethereum (Extension)
  ↓
เชื่อมต่อผ่าน Browser Extension
  ↓
✅ เชื่อมต่อสำเร็จ!
```

### Mobile (มือถือ)
```
User คลิก "Connect Wallet"
  ↓
ตรวจสอบ User Agent (Mobile?)
  ↓
ถ้ามี window.ethereum → ใช้ทันที (เปิดจากแอพ Ronin)
  ↓
ถ้าไม่มี → แสดง Confirm Dialog
  ↓
User กด OK
  ↓
เปิด Deep Link: roninwallet://wc?uri=...
  ↓
Ronin Wallet App เปิดขึ้น
  ↓
User กด "Connect" ในแอพ
  ↓
กลับมา Browser
  ↓
✅ เชื่อมต่อสำเร็จ!
```

---

## 🎯 ฟีเจอร์ใหม่ที่เพิ่มเข้ามา

### 1. Auto-detect Mobile
```typescript
function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
```

### 2. Deep Link Integration
```typescript
// เปิดแอพ Ronin Wallet ด้วย Deep Link
const deepLink = `roninwallet://wc?uri=${callbackUrl}`;
window.location.href = deepLink;

// Fallback: เปิด App Store ถ้ายังไม่ได้ติดตั้ง
setTimeout(() => {
  const storeUrl = isIOS 
    ? 'https://apps.apple.com/app/ronin-wallet/id1592675001'
    : 'https://play.google.com/store/apps/details?id=com.skymavis.genesis';
  window.open(storeUrl, '_blank');
}, 2000);
```

### 3. Connection Polling
```typescript
// รอให้ user กลับมาจากแอพ
const checkConnection = setInterval(async () => {
  if ((window as any).ethereum) {
    // เชื่อมต่อสำเร็จ!
    clearInterval(checkConnection);
    await initializeWallet();
  }
}, 1000);
```

### 4. User-Friendly Messages
```typescript
const shouldContinue = confirm(
  '📱 Mobile Wallet Connection\n\n' +
  '1. You will be redirected to Ronin Wallet app\n' +
  '2. Approve the connection request\n' +
  '3. Return to this page\n\n' +
  'Click OK to continue'
);
```

---

## 📋 ขั้นตอนการทดสอบ

### บน Android:

1. **ติดตั้งแอพ Ronin Wallet**
   ```
   Play Store → Search "Ronin Wallet" → Install
   ```

2. **สร้าง/Import กระเป๋า** ในแอพ

3. **ทดสอบวิธีที่ 1: เปิดจากแอพ**
   ```
   Ronin Wallet → Browser → พิมพ์ URL เกม
   → เชื่อมต่ออัตโนมัติ ✅
   ```

4. **ทดสอบวิธีที่ 2: เปิดจาก Chrome**
   ```
   Chrome → เข้าเว็บเกม → Connect Wallet
   → กด OK → แอพ Ronin เปิด → กด Connect
   → กลับ Chrome → เชื่อมต่อสำเร็จ ✅
   ```

### บน iOS (iPhone/iPad):

1. **ติดตั้งแอพ Ronin Wallet**
   ```
   App Store → Search "Ronin Wallet" → Install
   ```

2. **สร้าง/Import กระเป๋า** ในแอพ

3. **ทดสอบวิธีที่ 1: เปิดจากแอพ**
   ```
   Ronin Wallet → DApp Browser → พิมพ์ URL เกม
   → เชื่อมต่ออัตโนมัติ ✅
   ```

4. **ทดสอบวิธีที่ 2: เปิดจาก Safari**
   ```
   Safari → เข้าเว็บเกม → Connect Wallet
   → กด OK → แอพ Ronin เปิด → กด Connect
   → กลับ Safari → เชื่อมต่อสำเร็จ ✅
   ```

---

## 🐛 Troubleshooting

### ปัญหา: "Ronin Wallet extension not found"
**สาเหตุ**: เปิดบนมือถือแต่ระบบไม่ detect
**แก้ไข**: Refresh หน้าเว็บ → ระบบจะ auto-detect mobile ใหม่

### ปัญหา: กด OK แล้วไม่เปิดแอพ Ronin
**สาเหตุ**: Deep link ไม่ทำงาน หรือยังไม่ติดตั้งแอพ
**แก้ไข**: 
1. ตรวจสอบว่าติดตั้งแอพ Ronin Wallet แล้ว
2. ถ้ายังไม่ได้ติดตั้ง → กด OK อีกครั้ง → จะเปิด App Store อัตโนมัติ

### ปัญหา: กด Connect ในแอพแล้วกลับมาแต่ยังไม่เชื่อมต่อ
**สาเหตุ**: Browser ปิด tab หรือ session หาย
**แก้ไข**: 
1. อย่าปิด Browser tab ตอนไปที่แอพ Ronin
2. ถ้าปิดไปแล้ว → เปิดเกมใหม่ → ใช้วิธีที่ 1 (เปิดจากแอพ Ronin)

### ปัญหา: Connection timeout (30 วินาที)
**สาเหตุ**: รอนานเกินไป ไม่กลับมา Browser
**แก้ไข**: 
1. กดปุ่ม "Connect Wallet" ใหม่อีกครั้ง
2. หรือใช้วิธีที่ 1: เปิดเกมจากใน Browser ของแอพ Ronin

---

## 📊 Compatibility

| Platform | Browser | Status |
|----------|---------|--------|
| Android  | Chrome  | ✅ Supported |
| Android  | Firefox | ✅ Supported |
| Android  | Samsung Browser | ✅ Supported |
| Android  | Ronin Wallet Browser | ✅ Recommended! |
| iOS      | Safari  | ✅ Supported |
| iOS      | Chrome  | ✅ Supported |
| iOS      | Ronin Wallet Browser | ✅ Recommended! |
| Desktop  | Chrome + Extension | ✅ Supported |
| Desktop  | Edge + Extension | ✅ Supported |
| Desktop  | Brave + Extension | ✅ Supported |

---

## 🔐 Security Notes

### Desktop
- ใช้ Ronin Wallet Extension
- Private key เก็บในเครื่อง
- Transaction ต้อง approve ใน popup

### Mobile
- ใช้ Ronin Wallet App
- Private key เก็บในแอพ
- Transaction ต้อง approve ในแอพ
- Deep Link ปลอดภัย (โดเมนตรงกับ roninchain.com)

---

## 💡 คำแนะนำ

### สำหรับผู้เล่น:

1. **วิธีที่ดีที่สุด**: เปิดเกมจากใน Browser ของแอพ Ronin Wallet
   - เชื่อมต่อเร็วที่สุด
   - ไม่ต้องกดหลายครั้ง
   - ไม่มีปัญหา deep link

2. **วิธีสำรอง**: เปิดจาก Chrome/Safari
   - ใช้ได้ แต่ช้ากว่า
   - ต้องกด OK และรอ
   - บางครั้งต้องลองหลายครั้ง

### สำหรับผู้พัฒนา:

1. **ทดสอบบนมือถือจริง** - emulator อาจไม่เหมือนของจริง
2. **เช็ค console logs** - ดู error messages
3. **ทดสอบทั้ง iOS และ Android** - behavior ต่างกัน
4. **เตรียม fallback** - เช่น QR code, WalletConnect

---

## 🎉 สรุป

**ตอนนี้เกมรองรับทั้ง Desktop และ Mobile แล้ว!**

- ✅ Desktop: Browser Extension
- ✅ Mobile: Deep Link + In-App Browser
- ✅ Auto-detect platform
- ✅ User-friendly instructions
- ✅ Fallback to App Store

**วิธีที่ดีที่สุดสำหรับมือถือ:**
เปิดเกมจาก Browser ในแอพ Ronin Wallet โดยตรง! 🚀

---

## 🔗 Links

- Ronin Wallet (Android): https://play.google.com/store/apps/details?id=com.skymavis.genesis
- Ronin Wallet (iOS): https://apps.apple.com/app/ronin-wallet/id1592675001
- Ronin Wallet Extension: https://wallet.roninchain.com/
- Deep Link Scheme: `roninwallet://`

---

**หากมีปัญหาหรือข้อสงสัย กรุณา:**
1. ตรวจสอบว่าติดตั้งแอพ Ronin Wallet แล้ว
2. ลองใช้วิธีที่ 1 (เปิดจากแอพ) แทน
3. Refresh หน้าเว็บและลองใหม่
4. ดู console logs (F12 → Console)
