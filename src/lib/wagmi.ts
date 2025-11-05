import { createConfig, http } from 'wagmi';
import { ronin, saigon } from './chains'; // Import custom Ronin chains
import { createStorage, noopStorage } from 'wagmi';
import { injected } from 'wagmi/connectors';
import './polyfills'; // Import polyfills for SSR

// Create safe storage that works in SSR
const safeStorage = typeof window !== 'undefined'
  ? createStorage({
      storage: typeof window.localStorage !== 'undefined'
        ? window.localStorage
        : ({
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
            clear: () => {},
            length: 0,
            key: () => null,
          } as Storage),
    })
  : noopStorage;

// Validate chains before creating config
if (!ronin || !saigon) {
  console.error('CRITICAL: Custom chains not loaded properly!', { ronin, saigon });
  throw new Error('Failed to load Ronin chains');
}

// Create connectors array with validation
const createConnectors = () => {
  try {
    return [injected({ shimDisconnect: true })];
  } catch (error) {
    console.error('Failed to create connectors:', error);
    return [];
  }
};

// Wagmi Configuration for Aeloria - Simple config with only injected connector
export const wagmiConfig = createConfig({
  chains: [saigon, ronin], // Saigon first for testing
  connectors: createConnectors(),
  transports: {
    [saigon.id]: http('https://saigon-testnet.roninchain.com/rpc'),
    [ronin.id]: http('https://api.roninchain.com/rpc'),
  },
  storage: safeStorage,
  ssr: false,
});

// Validate config after creation
if (!wagmiConfig.chains || wagmiConfig.chains.length === 0) {
  console.error('CRITICAL: wagmiConfig has no chains!', wagmiConfig);
  throw new Error('Wagmi config invalid - no chains');
}

console.log('โœ… Wagmi config initialized successfully', {
  chains: wagmiConfig.chains.map(c => ({ id: c.id, name: c.name })),
  connectorsCount: (wagmiConfig as any)._internal?.connectors?.setup?.().length || 'unknown',
});
