import { createConfig, http } from 'wagmi';
import { ronin, saigon } from './chains'; // Import custom Ronin chains
import { createStorage, noopStorage } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
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

// Wagmi Configuration for Aeloria
export const wagmiConfig = createConfig({
  chains: [saigon, ronin], // Saigon first for testing
  connectors: [
    injected({ shimDisconnect: true }),
    ...(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
      ? [
          walletConnect({
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
            showQrModal: true,
          }),
        ]
      : []),
  ],
  transports: {
    [saigon.id]: http('https://saigon-testnet.roninchain.com/rpc'),
    [ronin.id]: http('https://api.roninchain.com/rpc'),
  },
  storage: safeStorage,
  ssr: false,
});
