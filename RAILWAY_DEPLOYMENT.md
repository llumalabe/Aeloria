# 🚂 Railway Deployment Guide

## Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Login" → Sign up with GitHub
3. Authorize Railway to access your GitHub

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `llumalabe/Aeloria` repository
4. Select the `backend` folder as root directory

### Step 3: Configure Environment Variables
Add these environment variables in Railway dashboard:

```env
PORT=5000
MONGODB_URI=mongodb+srv://[username]:[password]@cluster.mongodb.net/aeloria
FRONTEND_URL=https://aeloria-two.vercel.app
RONIN_RPC_URL=https://saigon-testnet.roninchain.com/rpc
PRIVATE_KEY=[your_wallet_private_key]
JWT_SECRET=[random_string_here]
```

### Step 4: Add MongoDB Database (Option A - Railway MongoDB)
1. In your Railway project, click "New"
2. Select "Database" → "Add MongoDB"
3. Copy the `MONGO_URL` from MongoDB plugin
4. Update `MONGODB_URI` environment variable

### Step 4: Add MongoDB Database (Option B - MongoDB Atlas)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0)
5. Get connection string
6. Update `MONGODB_URI` environment variable

### Step 5: Deploy
1. Railway will automatically deploy when you push to GitHub
2. Wait for deployment to complete (2-3 minutes)
3. Copy the deployment URL (e.g., `https://aeloria-backend.up.railway.app`)

### Step 6: Update Vercel Environment Variables
1. Go to Vercel dashboard
2. Select your project `aeloria-two`
3. Go to Settings → Environment Variables
4. Update `NEXT_PUBLIC_API_URL` to your Railway URL
5. Redeploy Vercel frontend

---

## Alternative: Deploy to Render.com

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub repository `llumalabe/Aeloria`
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: Free

### Step 3: Add Environment Variables
Same as Railway instructions above

### Step 4: Deploy
Render will auto-deploy and give you a URL like `https://aeloria-backend.onrender.com`

---

## Alternative: Manual Deploy (Vercel Backend)

Vercel can also host the backend:

### Step 1: Create vercel.json in backend folder
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

### Step 2: Deploy
```bash
cd backend
vercel --prod
```

---

## Quick Start (Recommended: Railway)

1. **Railway Account**: https://railway.app (sign up with GitHub)
2. **New Project** → Deploy from GitHub → `llumalabe/Aeloria`
3. **Root Directory**: Set to `backend`
4. **Add MongoDB** (Railway plugin or MongoDB Atlas)
5. **Environment Variables**: Add all required env vars
6. **Deploy** → Copy URL
7. **Update Vercel**: Set `NEXT_PUBLIC_API_URL` to Railway URL
8. **Redeploy Frontend** on Vercel

---

## Testing Backend

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-backend-url.railway.app/health

# API test
curl https://your-backend-url.railway.app/api/dungeon/list
```

---

## MongoDB Atlas Setup (Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free M0 cluster (512 MB)
3. Choose AWS as provider
4. Select region closest to you
5. Cluster name: `Aeloria`
6. Create cluster (takes 3-5 minutes)
7. Security → Database Access → Add user
   - Username: `aeloriaadmin`
   - Password: Generate secure password
8. Security → Network Access → Add IP
   - IP: `0.0.0.0/0` (Allow from anywhere)
9. Connect → Connect your application
   - Driver: Node.js
   - Version: 4.1 or later
   - Copy connection string
10. Replace `<password>` in connection string

Example connection string:
```
mongodb+srv://aeloriaadmin:YOUR_PASSWORD@aeloria.xxxxx.mongodb.net/aeloria?retryWrites=true&w=majority
```

---

## After Backend is Deployed

1. ✅ Backend API running on Railway/Render
2. ✅ MongoDB connected (Railway or Atlas)
3. ✅ Update Vercel env var `NEXT_PUBLIC_API_URL`
4. ✅ Redeploy frontend
5. ✅ Test: Create character, enter dungeon, etc.

---

**Your game will be fully functional after this! 🎮⚔️**
