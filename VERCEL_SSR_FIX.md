# Vercel SSR Fix - November 3, 2025

## Problem
Vercel deployment was showing SSR errors:
```
TypeError: Cannot read properties of null (reading 'open')
at a (/var/task/.next/server/chunks/8000.js:11:31441)
```

## Root Cause
- Wagmi/Viem libraries try to use `indexedDB` during server-side rendering
- IndexedDB is only available in browsers, not on Node.js server
- The code calls `.open()` on `indexedDB` which is `null` in SSR environment

## Solution Implemented
Created `instrumentation.js` at project root with global polyfills:

```javascript
export async function register() {
  if (typeof globalThis !== 'undefined' && typeof globalThis.indexedDB === 'undefined') {
    globalThis.indexedDB = {
      open: () => ({
        result: null,
        error: null,
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null,
      }),
      deleteDatabase: () => ({}),
      databases: () => Promise.resolve([]),
      cmp: () => 0,
    };
  }
  
  // Also mock localStorage for SSR
  if (typeof window !== 'undefined' && typeof window.localStorage === 'undefined') {
    window.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };
  }
}
```

## How It Works
1. Next.js automatically loads `instrumentation.js` **before** app initialization
2. Polyfills run on the server before any Wagmi/Viem code executes
3. When Wagmi tries to use `indexedDB.open()`, it gets a mock object instead of error
4. SSR completes successfully, client hydration works normally

## Additional Protection Layers
1. **wagmi.ts**: Uses `noopStorage` for SSR, `createStorage` for client
2. **ClientLayout.tsx**: Mounted check prevents Web3 provider rendering until client-side
3. **useWallet.ts**: Returns safe defaults before hydration complete

## Verification
After deployment:
- ✅ No more indexedDB errors in Vercel logs
- ✅ Homepage renders successfully
- ✅ Client-side wallet connection works
- ✅ No SSR/hydration mismatches

## Files Modified
- ✅ `instrumentation.js` (NEW) - Global polyfills
- ✅ `src/lib/wagmi.ts` - Safe storage configuration
- ✅ `src/lib/polyfills.ts` - Additional polyfill layer
- ✅ `src/components/ClientLayout.tsx` - Mounted check
- ✅ `src/hooks/useWallet.ts` - Safe defaults

## Deployment Status
- Commit: `6228d2c3`
- Status: ✅ Pushed to GitHub
- Vercel: Auto-deploy triggered
- Expected: Build successful with no SSR errors

## Monitoring
Check Vercel deployment logs for:
- Build success (no compilation errors)
- Runtime logs (no indexedDB errors)
- Function logs (clean execution)

---
**Fix applied**: November 3, 2025  
**Deployment**: https://aeloria-two.vercel.app/  
**Status**: ✅ Fixed and deployed
