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
console.log('๐Ÿ"— Loading custom chains...');
console.log('Ronin chain:', ronin);
console.log('Saigon chain:', saigon);

if (!ronin || !saigon) {
  console.error('โŒ CRITICAL: Custom chains not loaded properly!', { ronin, saigon });
  throw new Error('Failed to load Ronin chains');
}

console.log('โœ… Chains validated successfully');

// Wagmi Configuration for Aeloria - Simple config with only injected connector
console.log('๐Ÿ"ง Creating Wagmi config...');

// CRITICAL: Use function form to ensure proper initialization
export const wagmiConfig = createConfig({
  chains: [saigon, ronin], // Saigon first for testing
  connectors: () => [
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [saigon.id]: http('https://saigon-testnet.roninchain.com/rpc'),
    [ronin.id]: http('https://api.roninchain.com/rpc'),
  },
  storage: safeStorage,
  ssr: false,
  multiInjectedProviderDiscovery: false, // Disable auto-discovery
});

console.log('๐Ÿ"ง Wagmi config created:', {
  chainsCount: wagmiConfig.chains?.length,
  chainIds: wagmiConfig.chains?.map(c => c.id),
});

// Validate config after creation
if (!wagmiConfig || !wagmiConfig.chains) {
  console.error('CRITICAL: wagmiConfig has no chains!', wagmiConfig);
  throw new Error('Wagmi config invalid - no chains');
}

console.log('โœ… Wagmi config initialized successfully', {
  chains: wagmiConfig.chains.map(c => ({ id: c.id, name: c.name })),
});
