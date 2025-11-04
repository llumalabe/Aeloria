import { defineChain } from 'viem';

// Ronin Mainnet (Chain ID: 2020)
export const ronin = defineChain({
  id: 2020,
  name: 'Ronin',
  nativeCurrency: {
    decimals: 18,
    name: 'RON',
    symbol: 'RON',
  },
  rpcUrls: {
    default: {
      http: ['https://api.roninchain.com/rpc'],
      webSocket: ['wss://api.roninchain.com/rpc'],
    },
    public: {
      http: ['https://api.roninchain.com/rpc'],
      webSocket: ['wss://api.roninchain.com/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ronin Explorer',
      url: 'https://app.roninchain.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 26023535,
    },
  },
});

// Saigon Testnet (Chain ID: 2021)
export const saigon = defineChain({
  id: 2021,
  name: 'Saigon Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'RON',
    symbol: 'RON',
  },
  rpcUrls: {
    default: {
      http: ['https://saigon-testnet.roninchain.com/rpc'],
      webSocket: ['wss://saigon-testnet.roninchain.com/rpc'],
    },
    public: {
      http: ['https://saigon-testnet.roninchain.com/rpc'],
      webSocket: ['wss://saigon-testnet.roninchain.com/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Saigon Explorer',
      url: 'https://saigon-app.roninchain.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 26023535,
    },
  },
  testnet: true,
});
