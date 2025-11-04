// Polyfill for indexedDB in server-side environment
// CRITICAL: Must create mock object with .open() method, NOT null!
if (typeof globalThis !== 'undefined' && typeof globalThis.indexedDB === 'undefined') {
  // @ts-ignore - Create full mock to prevent ".open()" errors
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

// Polyfill for localStorage in server-side environment
if (typeof window !== 'undefined' && typeof window.localStorage === 'undefined') {
  // @ts-ignore
  window.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };
}

export {};
