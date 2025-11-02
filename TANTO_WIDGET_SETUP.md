# Tanto Widget Setup Guide

## Required Environment Variables

To use Tanto Widget (official Ronin wallet SDK), you need to set up 2 environment variables:

### 1. WalletConnect Project ID

**Get from:** https://cloud.walletconnect.com/

1. Create a free account on WalletConnect Cloud
2. Create a new project
3. Copy your Project ID
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

### 2. Ronin Waypoint Client ID (Optional - for Keyless Wallet)

**Get from:** https://developers.skymavis.com/

1. Go to Sky Mavis Developer Portal
2. Register your application
3. Get your Client ID for Ronin Waypoint
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_WAYPOINT_CLIENT_ID=your_client_id_here
   ```

## Vercel Deployment

Add these environment variables in Vercel:

1. Go to: https://vercel.com/dashboard  Your Project  Settings  Environment Variables
2. Add both variables:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_WAYPOINT_CLIENT_ID`
3. Redeploy the project

## What happens without these variables?

- **No WalletConnect Project ID:** WalletConnect will be disabled, but Ronin Wallet extension still works
- **No Waypoint Client ID:** Keyless wallet will be disabled, but other wallet options still work

The app will still function with just the Ronin Wallet browser extension!

## Testing Locally

1. Copy `.env.example` to `.env.local`
2. Fill in your API keys
3. Run `npm run dev`
4. Connect with Ronin Wallet extension or WalletConnect

## Supported Wallets

-  Ronin Wallet Extension (Chrome/Brave)
-  WalletConnect (Mobile wallets) - requires Project ID
-  Ronin Waypoint (Keyless wallet) - requires Client ID
-  Any EIP-6963 compatible wallet
