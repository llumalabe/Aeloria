# Quick Debug Steps - ทำทีละขั้นตอน

## ๐Ÿ"ฅ ขั้นตอนที่ 1: เปิด Console อย่างถูกต้อง

1. เปิด https://aeloria-two.vercel.app/
2. กด `F12` เปิด DevTools
3. ไปที่ Tab **Console**
4. ที่มุมซ้ายบน Console มี dropdown:
   - ถ้าเป็น "Default levels" ให้เปลี่ยนเป็น **"All levels"**
   - ถ้าเป็น "Hide network" ให้**ยกเลิก**
5. กด `Ctrl + L` เพื่อ clear console
6. กด `Ctrl + Shift + R` hard refresh

---

## ๐Ÿ"Ž ขั้นตอนที่ 2: ถ่าย Screenshot

### Screenshot 1: Console Tab (ตั้งแต่บนสุด)
- Scroll console ขึ้นไปบนสุด
- ถ่ายภาพตั้งแต่บรรทัดแรก
- ควรเห็น:
  - Messages เกี่ยวกับ chains (ถ้ามี)
  - Error messages สีแดง (ถ้ามี)
  - Log messages

### Screenshot 2: หน้าจอที่เห็น
- ถ่ายภาพหน้าเว็บที่แสดงอยู่
- เห็น error screen หรือหน้าปกติ?

### Screenshot 3: Network Tab
- เปลี่ยนไปที่ Tab **Network**
- ดูว่ามีไฟล์ไหนโหลดไม่ได้ (สีแดง)
- ถ่ายภาพ

---

## ๐Ÿ" ขั้นตอนที่ 3: Copy Console Text

1. ใน Console Tab คลิกขวา
2. เลือก "Save as..." 
3. บันทึกเป็นไฟล์ console.log
4. ส่งไฟล์มา

**หรือ:**

1. Scroll ไปบนสุดใน Console
2. คลิกที่บรรทัดแรก
3. กด `Ctrl + A` เลือกทั้งหมด
4. กด `Ctrl + C` copy
5. Paste ลงในไฟล์ text หรือ message

---

## ๐Ÿ"Š สิ่งที่ต้องการ

### ข้อมูลที่ต้องส่งมา:

- [ ] Screenshot Console tab (scroll ขึ้นบนสุด)
- [ ] Screenshot หน้าเว็บ
- [ ] Screenshot Network tab (ดูไฟล์ที่โหลดไม่สำเร็จ)
- [ ] Text จาก console (copy ทั้งหมด)

### คำถามให้ตอบ:

1. เห็นข้อความ `๐Ÿ"— Loading custom chains...` ไหม? **(ใช่/ไม่)**
2. เห็นข้อความ `โœ… Wagmi config initialized successfully` ไหม? **(ใช่/ไม่)**
3. หน้าเว็บแสดงอะไร?
   - [ ] Error screen (⚠️ เกิดข้อผิดพลาด)
   - [ ] Blank/white screen
   - [ ] Loading...
   - [ ] หน้าปกติ

4. Console มี error message สีแดงไหม? ถ้ามี **copy มาทั้งหมด**

---

## ๐Ÿ†˜ ถ้ายังไม่เห็นอะไรเลย

### ลอง:

1. **รอ 5 นาที** (Vercel deploy อาจยังไม่เสร็จ)
2. **Clear cache แล้ว refresh:**
   - กด `Ctrl + Shift + Delete`
   - เลือก "Cached images and files"
   - กด "Clear data"
   - Refresh อีกครั้ง

3. **ลองเปิดใน Incognito:**
   - กด `Ctrl + Shift + N`
   - ไปที่ https://aeloria-two.vercel.app/
   - เปิด Console (F12)
   - ดูว่ามี logs ไหม

4. **ตรวจสอบ Vercel Dashboard:**
   - ไปที่ https://vercel.com/dashboard
   - ดู deployment status
   - ควรเป็น "Ready" (เขียว)
   - ถ้ายัง "Building" (เหลือง) = รอก่อน

---

## ๐ŸŽฏ เป้าหมาย

ต้องการดูว่า:

1. **Chains โหลดได้ไหม?** 
   - ถ้าได้ จะเห็น log `๐Ÿ"— Loading custom chains...`
   
2. **Wagmi config สร้างได้ไหม?**
   - ถ้าได้ จะเห็น log `๐Ÿ"ง Creating Wagmi config...`

3. **Error เกิดที่ไหน?**
   - ถ้า error จะมี message สีแดงบอก

**จาก logs เราจะรู้ว่าปัญหาอยู่ตรงไหนพอดี!**

---

**หลังจากทำตามขั้นตอนแล้ว ส่งข้อมูลมาให้ดูนะครับ! ๐Ÿ™**
