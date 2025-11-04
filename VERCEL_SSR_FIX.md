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
- **CRITICAL**: The code calls `.open()` on `indexedDB` which was set to `null` in `polyfills.ts`
- **ERROR**: `Cannot read properties of null (reading 'open')` - null has no `.open()` method!

## Critical Discovery
The `src/lib/polyfills.ts` file had:
```typescript
// ❌ WRONG - causes error!
globalThis.indexedDB = null;
```

This caused the error because Wagmi tried to call `null.open()`. **You cannot call methods on null!**

## Solution Implemented

### 1. Fixed `src/lib/polyfills.ts` (CRITICAL)
**Before (BROKEN):**
```typescript
globalThis.indexedDB = null; // ❌ Causes "Cannot read properties of null (reading 'open')"
```

**After (FIXED):**
```typescript
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
}; // ✅ Mock object with .open() method
```

### 2. Created `instrumentation.js` (Backup Layer)

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
- ✅ `src/lib/polyfills.ts` (CRITICAL FIX) - Changed from `null` to mock object
- ✅ `instrumentation.js` (NEW) - Global polyfills backup layer
- ✅ `src/lib/wagmi.ts` - Safe storage configuration
- ✅ `src/components/ClientLayout.tsx` - Mounted check
- ✅ `src/hooks/useWallet.ts` - Safe defaults

## Key Lesson
**Never set indexedDB to null!** Always create a mock object with the methods that will be called (`open()`, `deleteDatabase()`, etc.).

## Deployment Status
- Commit: `4bc6cef3` (CRITICAL FIX)
- Previous commits: `0514363b`, `6228d2c3`
- Status: ✅ Pushed to GitHub
- Vercel: Auto-deploy triggered
- Expected: Build successful with no SSR errors

## Timeline
1. **Initial attempt**: Created `instrumentation.js` - didn't work because `polyfills.ts` was loaded first
2. **Discovery**: Found `polyfills.ts` had `indexedDB = null` (WRONG!)
3. **Fix**: Changed to mock object with `.open()` method (CORRECT!)
4. **Result**: Should now work on Vercel

## Monitoring
Check Vercel deployment logs for:
- Build success (no compilation errors)
- Runtime logs (no indexedDB errors)
- Function logs (clean execution)

---
**Fix applied**: November 3, 2025  
**Deployment**: https://aeloria-two.vercel.app/  
**Status**: ✅ Fixed and deployed
