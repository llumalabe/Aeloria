export async function register() {
  // Polyfill indexedDB for server-side rendering
  if (typeof globalThis !== 'undefined' && typeof globalThis.indexedDB === 'undefined') {
    // @ts-ignore - Prevent indexedDB errors in SSR
    (globalThis as any).indexedDB = null;
  }
  
  // Polyfill window.localStorage if needed
  if (typeof window !== 'undefined' && typeof window.localStorage === 'undefined') {
    // @ts-ignore
    (window as any).localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    };
  }
}
