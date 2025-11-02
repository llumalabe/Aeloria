# Aeloria Backend - Render Deployment

## Current Status
- ✅ MongoDB Atlas connected
- ✅ Character system complete
- ⚠️ Backend running on localhost only

## Deploy to Render.com (FREE)

### 1. Create Render Account
Go to: https://render.com/

### 2. Deploy Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub: llumalabe/Aeloria
3. Configure:
   - **Name**: aeloria-backend
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: npm install && npm run build
   - **Start Command**: npm start
   - **Instance Type**: Free

### 3. Environment Variables
Add these in Render dashboard:

```
MONGODB_URI=mongodb+srv://aeloria:2Bicoshock@cluster0.3j86yue.mongodb.net/aeloria?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://aeloria-two.vercel.app
RONIN_RPC_URL=https://saigon-testnet.roninchain.com/rpc
AETH_TOKEN_CONTRACT=0x61F434B602C5e561A5Fd2Ad7850B7bB2A91dd797
WALLET_MANAGER_CONTRACT=0xc566e86C2C992aD98071ab66fd8aa2f6993b9a91
JWT_SECRET=aeloria_super_secret_key_change_this_in_production
```

### 4. Update Vercel Environment Variable

Go to: https://vercel.com/llumalabe/aeloria-two/settings/environment-variables

Change:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

To:
```
NEXT_PUBLIC_API_URL=https://aeloria-backend.onrender.com
```

(Replace with your actual Render URL)

### 5. Redeploy Vercel

After updating environment variable, trigger a new deployment.

## Alternative: Railway.app

If Render is slow, try Railway.app:
- https://railway.app/
- Click "Start a New Project" → Deploy from GitHub
- Same configuration as Render

## Note
- Free tier may sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading for production use
