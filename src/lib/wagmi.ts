import { createConfig, http } from 'wagmi';
import { ronin, saigon } from './chains'; // Import custom Ronin chains
import { createStorage, noopStorage } from 'wagmi';
import { injected } from 'wagmi/connectors';
import './polyfills'; // Import polyfills for SSR

// Create safe storage that works in SSR
const safeStorage = typeof window !== 'undefined'
  ? createStorage({
      storage: window.localStorage,
    })
  : noopStorage;

// Validate chains before creating config
if (!ronin || !saigon) {
  console.error('CRITICAL: Custom chains not loaded properly!', { ronin, saigon });
  throw new Error('Failed to load Ronin chains');
}

// Wagmi Configuration for Aeloria - Simple config with only injected connector
export const wagmiConfig = createConfig({
  chains: [saigon, ronin], // Saigon first for testing
  connectors: [
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [saigon.id]: http('https://saigon-testnet.roninchain.com/rpc'),
    [ronin.id]: http('https://api.roninchain.com/rpc'),
  },
  storage: safeStorage,
  ssr: false,
});

// Validate config after creation
if (!wagmiConfig || !wagmiConfig.chains) {
  console.error('CRITICAL: wagmiConfig has no chains!', wagmiConfig);
  throw new Error('Wagmi config invalid - no chains');
}

console.log('โœ… Wagmi config initialized successfully', {
  chains: wagmiConfig.chains.map(c => ({ id: c.id, name: c.name })),
});
