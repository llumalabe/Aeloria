# 🚀 Deploy Backend to Render.com (FREE)

## Why Render.com?
- ✅ **Free Tier** - ไม่ต้องใส่บัตรเครดิต
- ✅ รองรับ Node.js + MongoDB Atlas (free)
- ✅ Auto-deploy จาก GitHub
- ✅ ได้ HTTPS URL ฟรี
- ⚠️ Free tier จะ sleep หลังไม่ใช้งาน 15 นาที (ใช้งานครั้งแรกจะช้านิดหนึ่ง)

---

## 📝 ขั้นตอนการ Deploy

### 1. สร้าง MongoDB (MongoDB Atlas - Free)

1. ไปที่ https://www.mongodb.com/cloud/atlas/register
2. Sign up ฟรี (ใช้ Google account ได้)
3. เลือก **Free Tier (M0)** - 512 MB ฟรี
4. เลือก Provider: **AWS**
5. Region: เลือกใกล้ๆ (Singapore หรือ Tokyo)
6. Cluster Name: `Aeloria`
7. คลิก **Create Deployment** → รอ 3-5 นาที

#### 1.1 สร้าง Database User

1. Security → **Database Access** → **Add New Database User**
2. Username: `aeloriaadmin`
3. Password: Generate → **คัดลอกรหัสผ่านไว้!**
4. Database User Privileges: **Read and write to any database**
5. Add User

#### 1.2 Allow Access from Anywhere

1. Security → **Network Access** → **Add IP Address**
2. เลือก **Allow Access from Anywhere** (`0.0.0.0/0`)
3. Confirm

#### 1.3 Get Connection String

1. กลับไป **Database** → คลิก **Connect**
2. เลือก **Drivers** → Node.js
3. Copy connection string:
```
mongodb+srv://aeloriaadmin:<password>@aeloria.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
4. **แทนที่ `<password>`** ด้วยรหัสผ่านที่คัดลอกไว้
5. **เก็บ connection string นี้ไว้!**

---

### 2. Deploy Backend to Render.com

#### 2.1 Sign Up Render

1. ไปที่ https://render.com
2. Sign up with GitHub (ง่ายที่สุด)
3. Authorize Render

#### 2.2 Create Web Service

1. Dashboard → คลิก **"New +"** → **"Web Service"**
2. Connect repository: `llumalube/Aeloria`
3. ตั้งค่า:

**Basic Settings:**
- **Name**: `aeloria-backend`
- **Region**: Singapore (หรือใกล้ๆ)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: 
  ```
  npm install && npm run build
  ```
- **Start Command**: 
  ```
  npm run start
  ```

**Instance Type:**
- เลือก **Free** ($0/month)

#### 2.3 Environment Variables

เลื่อนลงหา **Environment Variables** → คลิก **"Add Environment Variable"**

เพิ่ม variables เหล่านี้:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://aeloriaadmin:YOUR_PASSWORD@aeloria.xxxxx.mongodb.net/aeloria?retryWrites=true&w=majority` |
| `FRONTEND_URL` | `https://aeloria-two.vercel.app` |
| `RONIN_RPC_URL` | `https://saigon-testnet.roninchain.com/rpc` |
| `JWT_SECRET` | `aeloria_jwt_secret_2025_super_secure` |
| `NODE_ENV` | `production` |

**⚠️ สำคัญ:** แทนที่ `YOUR_PASSWORD` ใน `MONGODB_URI` ด้วยรหัสผ่าน MongoDB จริง

#### 2.4 Deploy!

1. คลิก **"Create Web Service"**
2. Render จะเริ่ม build อัตโนมัติ (5-10 นาที)
3. ดู logs ได้ในหน้า dashboard

---

### 3. รอ Deployment สำเร็จ

#### ดู Build Logs

1. จะเห็น logs แบบนี้:
```
==> Cloning from https://github.com/llumalabe/Aeloria...
==> Running 'npm install && npm run build' in /backend
==> Build successful
==> Starting service with 'npm run start'
```

2. เมื่อเห็น:
```
✅ Live
Your service is live at https://aeloria-backend.onrender.com
```

แปลว่า **สำเร็จแล้ว!** 🎉

---

### 4. ทดสอบ Backend

เปิด browser ไปที่:
```
https://aeloria-backend.onrender.com/health
```

**ถ้าเห็น:**
```json
{
  "status": "OK",
  "mongodb": "Connected"
}
```

แปลว่า **Backend ทำงานแล้ว!** ✅

---

### 5. อัพเดท Vercel

1. ไปที่ **Vercel Dashboard** → `aeloria-two`
2. **Settings** → **Environment Variables**
3. แก้ `NEXT_PUBLIC_API_URL`:
```
https://aeloria-backend.onrender.com
```
4. **Save**
5. **Deployments** → **Redeploy**

---

## ⚠️ ข้อควรรู้เกี่ยวกับ Free Tier

### Render Free Tier
- ✅ ฟรีตลอดชีพ
- ⚠️ Service จะ **sleep หลังไม่ใช้งาน 15 นาที**
- ⚠️ เมื่อมีคนเข้าใช้ครั้งแรก จะใช้เวลา **30-60 วินาที** ในการ wake up
- ✅ 750 ชั่วโมง/เดือน ฟรี (พอสำหรับ development)

### MongoDB Atlas Free Tier
- ✅ ฟรีตลอดชีพ
- ✅ 512 MB storage
- ✅ ไม่ sleep

---

## 🔧 แก้ปัญหาที่อาจเจอ

### ❌ Build Failed

**ดูใน Logs:**
```
Error: Cannot find module
```

**แก้:**
1. ตรวจสอบ Root Directory = `backend` ✅
2. ตรวจสอบ package.json อยู่ใน `/backend`
3. Manual Deploy ใหม่ (Dashboard → Manual Deploy → Deploy latest commit)

### ❌ MongoDB Connection Failed

**ดูใน Logs:**
```
MongoServerError: Authentication failed
```

**แก้:**
1. ตรวจสอบ password ใน connection string ถูกต้อง
2. ตรวจสอบ IP whitelist = `0.0.0.0/0`
3. ลอง restart service (Settings → Manual Deploy)

### ❌ Service Crashes

**ดูใน Logs:**
```
Error: listen EADDRINUSE
```

**แก้:**
1. ตรวจสอบ environment variable `PORT=5000`
2. Restart service

---

## 🎮 ทดสอบเกมหลัง Deploy

1. เปิด https://aeloria-two.vercel.app
2. Connect Wallet
3. Register → ได้ Starter Warrior อัตโนมัติ
4. ลอง Gacha → สุ่มตัวละคร
5. ลอง Dungeon

**ทุกอย่างควรทำงานแล้ว!** 🎉

---

## 💡 เปรียบเทียบ Hosting

| Service | Free Tier | Sleep? | Deploy Speed | Best For |
|---------|-----------|--------|--------------|----------|
| **Render** | ✅ ฟรี | ⚠️ 15 min | ⭐⭐⭐⭐ | Development |
| Railway | ❌ Trial จำกัด | ❌ | ⭐⭐⭐⭐⭐ | Production (paid) |
| Vercel | ✅ ฟรี | ❌ | ⭐⭐⭐⭐⭐ | Frontend only |

---

**แนะนำ: ใช้ Render.com สำหรับ development ก่อน เมื่อเกมพร้อม launch ค่อยย้ายไป Railway/AWS!** 🚀
