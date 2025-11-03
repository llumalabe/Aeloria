export async function register() {
  // Polyfill indexedDB for server-side rendering with mock implementation
  if (typeof globalThis !== 'undefined' && typeof globalThis.indexedDB === 'undefined') {
    // Create mock indexedDB that prevents errors during SSR
    (globalThis as any).indexedDB = {
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

  // Polyfill window.localStorage if needed
  if (typeof window !== 'undefined' && typeof window.localStorage === 'undefined') {
    (window as any).localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };
  }
}
