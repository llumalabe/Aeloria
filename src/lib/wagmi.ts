import { getDefaultConfig } from '@sky-mavis/tanto-widget';
import { ronin, saigon } from 'viem/chains';
import { createStorage, noopStorage } from 'wagmi';
import type { Chain } from 'viem';
import './polyfills'; // Import polyfills for SSR

// Ensure chains are properly defined - use type assertion for safety
const supportedChains: readonly [Chain, ...Chain[]] = [ronin, saigon] as const;

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

// Tanto Widget Configuration for Aeloria
export const wagmiConfig = getDefaultConfig({
  // App metadata
  appMetadata: {
    appName: 'Aeloria: Guardians of the Eternal Sigils',
    appIcon: 'https://aeloria-two.vercel.app/icon.png',
    appDescription: 'Web3 Fantasy RPG on Ronin Network - Explore dungeons, battle bosses, and earn AETH tokens',
    appUrl: typeof window !== 'undefined' ? window.location.origin : 'https://aeloria-two.vercel.app',
  },

  // Supported chains: Ronin Mainnet (2020) and Saigon Testnet (2021)
  chains: supportedChains,

  // WalletConnect configuration
  walletConnectConfig: {
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    enable: !!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, // Only enable if projectId exists
  },

  // Ronin Waypoint (keyless wallet) configuration - Saigon Testnet for testing
  keylessWalletConfig: process.env.NEXT_PUBLIC_WAYPOINT_CLIENT_ID
    ? {
        chainId: 2021, // Saigon Testnet
        clientId: process.env.NEXT_PUBLIC_WAYPOINT_CLIENT_ID,
        waypointOrigin: 'https://waypoint.roninchain.com',
        popupCloseDelay: 1000,
        enable: true,
      }
    : {
        chainId: 2021, // Default to Testnet
        clientId: '',
        enable: false, // Disable if no clientId
      },

  // Coinbase Wallet (not needed for Ronin)
  coinbaseWalletConfig: {
    enable: false,
  },

  // Enable multi-injected provider discovery (EIP-6963)
  multiInjectedProviderDiscovery: true,

  // Use safe storage that works in SSR
  storage: safeStorage,

  // Disable SSR completely
  ssr: false,
});
