# Debug Instructions - Vercel Production Error

## ๐Ÿ"ฅ Current Status

**Latest Deploy:** Commit `eea7bf58` (added detailed logging)  
**Issue:** ErrorBoundary catching errors in production  
**Need:** Console logs to identify root cause  

---

## ๐Ÿงช How to Debug

### Step 1: Open Production Site

1. Go to: https://aeloria-two.vercel.app/
2. Open DevTools Console (F12)
3. Look for console messages

---

## ๐Ÿ" What to Look For in Console

### โœ… Success Messages (What You SHOULD See)

```javascript
๐Ÿ"— Loading custom chains...
Ronin chain: { id: 2020, name: 'Ronin', ... }
Saigon chain: { id: 2021, name: 'Saigon Testnet', ... }
โœ… Chains validated successfully
๐Ÿ"ง Creating Wagmi config...
๐Ÿ"ง Wagmi config created: { chainsCount: 2, chainIds: [2021, 2020] }
โœ… Wagmi config initialized successfully { chains: [...] }
```

### โŒ Error Messages (What Might Appear)

**If chains not loaded:**
```javascript
โŒ CRITICAL: Custom chains not loaded properly!
Error: Failed to load Ronin chains
```

**If ErrorBoundary triggered:**
```javascript
โŒ ErrorBoundary caught an error:
Error: [specific error message]
Error message: [detailed message]
Error stack: [stack trace]
Component stack: [component hierarchy]
```

**If connector setup fails:**
```javascript
TypeError: e is not a function
// or
TypeError: Cannot read properties of undefined
```

---

## ๐Ÿ"Š Interpretation Guide

### Scenario 1: Chains Load Successfully

**Console shows:**
```
๐Ÿ"— Loading custom chains...
Ronin chain: { id: 2020, ... }
Saigon chain: { id: 2021, ... }
โœ… Chains validated successfully
```

**Meaning:** `chains.ts` is working correctly  
**Next:** Check if Wagmi config creates successfully

---

### Scenario 2: Wagmi Config Creates Successfully

**Console shows:**
```
๐Ÿ"ง Creating Wagmi config...
๐Ÿ"ง Wagmi config created: { chainsCount: 2, chainIds: [2021, 2020] }
โœ… Wagmi config initialized successfully
```

**Meaning:** `wagmi.ts` initialization works  
**Next:** Check if error happens in components

---

### Scenario 3: ErrorBoundary Catches Error

**Console shows:**
```
โŒ ErrorBoundary caught an error:
Error: [specific error]
```

**Meaning:** Error happens during component render  
**Action:** Share the full error message and stack trace

---

### Scenario 4: No Logs Appear

**Console is empty or only has warnings**

**Possible Causes:**
1. Old build cached - try Ctrl+Shift+R (hard refresh)
2. JavaScript disabled
3. Vercel deploy not finished yet
4. Build broke silently

**Action:** Wait 2 minutes, then hard refresh

---

## ๐Ÿ› ๏ธ Common Error Patterns

### Pattern 1: "e is not a function"

**Cause:** Connector setup issue  
**Fixed in:** Commit 774dcbda  
**If still happening:** connectors array might be wrong  

**Check in console:**
```javascript
๐Ÿ"ง Wagmi config created: { chainsCount: ?, chainIds: ? }
```
- If `chainsCount` is undefined or 0 โ†' chains problem
- If `chainsCount` is 2 but error still happens โ†' connector problem

---

### Pattern 2: "Cannot read properties of undefined"

**Cause:** SSR/hydration mismatch  
**Fixed in:** Commit 36e6b298 (mounted state)  
**If still happening:** Component using Wagmi hooks before mount  

**Look for:**
```javascript
Error message: Cannot read properties of undefined (reading 'length')
Component stack: at WalletConnectButton
```

---

### Pattern 3: Import/Module Errors

**Example:**
```javascript
Error: Cannot find module './chains'
// or
Error: defineChain is not a function
```

**Cause:** Viem/Wagmi version mismatch or build issue  
**Action:** Share full error for investigation

---

## ๐Ÿ"‹ Information Needed

When sharing error, please provide:

### 1. Full Console Output
- Copy ALL console messages (from page load to error)
- Include timestamps if visible
- Include warnings too

### 2. Error Details
If ErrorBoundary shows error screen:
- Take screenshot
- Copy error message shown on screen
- Check console for detailed error

### 3. Network Tab
- Check if any requests failed (red status codes)
- Especially check:
  - JavaScript chunk files (*.js)
  - RPC endpoints
  - API calls

### 4. Browser Info
- Browser: Chrome/Firefox/Safari/Edge
- Version: ?
- Device: Desktop/Mobile
- OS: Windows/Mac/Linux

---

## ๐Ÿš€ Quick Fixes to Try

### Fix 1: Hard Refresh
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### Fix 2: Clear Cache
```
DevTools โ†' Network Tab โ†' Disable cache checkbox
Then refresh
```

### Fix 3: Incognito Mode
```
Windows: Ctrl + Shift + N
Mac: Cmd + Shift + N
```
Open https://aeloria-two.vercel.app/ in incognito

### Fix 4: Different Browser
Try in:
- Chrome (if using Firefox)
- Firefox (if using Chrome)
- Edge

---

## ๐Ÿ"Œ Expected Behavior After Fix

When everything works correctly, you should see:

**Console (in order):**
1. `๐Ÿ"— Loading custom chains...`
2. `Ronin chain: ...` (full object)
3. `Saigon chain: ...` (full object)
4. `โœ… Chains validated successfully`
5. `๐Ÿ"ง Creating Wagmi config...`
6. `๐Ÿ"ง Wagmi config created: { chainsCount: 2, chainIds: [2021, 2020] }`
7. `โœ… Wagmi config initialized successfully`

**Screen:**
- Homepage loads normally
- No error screen
- Wallet button shows "Loading..." briefly, then "Connect Wallet"

**No errors in console** (warnings about @react-native-async-storage are OK)

---

## ๐Ÿ†˜ If Still Failing

### Action Plan:

1. **Capture full console log**
   - Open DevTools before loading page
   - Copy everything from console
   - Paste into text file

2. **Take screenshots**
   - Error screen (if any)
   - Console tab
   - Network tab (showing any red/failed requests)

3. **Share info**
   - Console log text
   - Screenshots
   - Browser/device info
   - What you tried

4. **Additional checks**
   ```bash
   # Verify latest commit deployed
   # Check Vercel dashboard
   # https://vercel.com/dashboard
   
   # Look for:
   # - Deploy status: "Ready"
   # - Build logs: Any errors?
   # - Function logs: Any runtime errors?
   ```

---

## ๐Ÿ"Š Debugging Checklist

- [ ] Opened https://aeloria-two.vercel.app/
- [ ] Opened DevTools Console (F12)
- [ ] Hard refreshed page (Ctrl+Shift+R)
- [ ] Checked for success messages (๐Ÿ"—, โœ…, ๐Ÿ"ง)
- [ ] Checked for error messages (โŒ)
- [ ] Copied full console output
- [ ] Checked Network tab for failed requests
- [ ] Tried incognito mode
- [ ] Waited 5+ minutes after deploy
- [ ] Cleared browser cache

---

**Last Updated:** Commit eea7bf58  
**Added:** Detailed logging for debugging  
**Next Step:** Review console logs and share findings  

**Remember:** The logging will tell us EXACTLY where it's failing! ๐Ÿ"
