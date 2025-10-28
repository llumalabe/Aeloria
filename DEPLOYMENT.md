# Aeloria: Guardians of the Eternal Sigils - Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
- GitHub account connected to Vercel
- Vercel account (free tier works)

### Quick Deploy

1. **Push to GitHub** (Already done! ✅)
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   
   **Option A: Using Vercel CLI**
   ```bash
   npm i -g vercel
   vercel
   ```

   **Option B: Using Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Import your GitHub repository: `llumalabe/Aeloria`
   - Vercel will auto-detect Next.js
   - Click "Deploy"

### Environment Variables Setup

After deployment, add these environment variables in Vercel Dashboard:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_RONIN_CHAIN_ID=2021
NEXT_PUBLIC_CHARACTER_CONTRACT=0x...
NEXT_PUBLIC_ITEM_CONTRACT=0x...
NEXT_PUBLIC_TOKEN_CONTRACT=0x...
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0x...
```

### Post-Deployment Steps

1. **Deploy Smart Contracts**
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.ts --network roninTestnet
   ```

2. **Update Contract Addresses**
   - Add deployed contract addresses to Vercel environment variables
   - Redeploy to apply changes

3. **Deploy Backend API**
   - Deploy backend to Railway, Heroku, or VPS
   - Update `NEXT_PUBLIC_API_URL` with backend URL

4. **Setup MongoDB**
   - Create MongoDB Atlas cluster (free tier)
   - Update backend `.env` with connection string

## 📦 Project Structure

```
aeloria-guardians/
├── src/                  # Next.js frontend
├── contracts/           # Solidity smart contracts
├── backend/            # Express.js API
└── vercel.json         # Vercel configuration
```

## 🔧 Local Development

```bash
# Frontend
npm run dev

# Backend
cd backend
npm run dev

# Smart Contracts
cd contracts
npx hardhat compile
```

## 🌐 Live URLs (After Deployment)

- **Frontend**: https://aeloria.vercel.app
- **Backend API**: (Deploy separately)
- **Smart Contracts**: Ronin Saigon Testnet

## ⚙️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Blockchain**: Solidity, Hardhat, Ronin Network
- **Deployment**: Vercel (Frontend), MongoDB Atlas (Database)

## 📝 Notes

- Frontend is serverless on Vercel
- Backend needs separate deployment
- Smart contracts deploy to Ronin Network
- Free tier supports up to 100GB bandwidth/month

---

**Ready to play!** 🎮 Visit your Vercel URL after deployment.
