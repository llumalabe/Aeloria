// Polyfill for indexedDB in server-side environment
if (typeof globalThis !== 'undefined' && typeof globalThis.indexedDB === 'undefined') {
  // @ts-ignore
  globalThis.indexedDB = null;
}

export {};
