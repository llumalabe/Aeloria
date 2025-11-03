// Global polyfills for SSR (Server-Side Rendering)
// This file runs BEFORE Next.js app initialization
// Prevents "Cannot read properties of null (reading 'open')" errors on Vercel

export async function register() {
  // Mock indexedDB for server-side rendering
  // Wagmi/Viem tries to use indexedDB during SSR, causing errors
  if (typeof globalThis !== 'undefined' && typeof globalThis.indexedDB === 'undefined') {
    globalThis.indexedDB = {
      open: () => ({
        result: null,
        error: null,
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null,
        onblocked: null,
        transaction: null,
      }),
      deleteDatabase: () => ({
        result: null,
        error: null,
        onsuccess: null,
        onerror: null,
      }),
      databases: () => Promise.resolve([]),
      cmp: () => 0,
    };
  }

  // Mock localStorage for server-side rendering
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

  // Mock sessionStorage for server-side rendering
  if (typeof window !== 'undefined' && typeof window.sessionStorage === 'undefined') {
    window.sessionStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };
  }
}
