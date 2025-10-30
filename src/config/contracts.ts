// Contract addresses on Ronin Saigon Testnet
export const CONTRACTS = {
  AETH_TOKEN: '0x6e937B8dF644fbbD663058323337179863866d41',
  WALLET_MANAGER: '0x9fDF58EAf8197237b432e4901391D804E156e4c9',
} as const;

// Ronin Network Configuration
export const RONIN_TESTNET = {
  chainId: 2021,
  chainIdHex: '0x7e5',
  name: 'Ronin Saigon Testnet',
  rpcUrl: 'https://saigon-testnet.roninchain.com/rpc',
  blockExplorer: 'https://saigon-app.roninchain.com',
} as const;

export const RONIN_MAINNET = {
  chainId: 2020,
  chainIdHex: '0x7e4',
  name: 'Ronin Mainnet',
  rpcUrl: 'https://api.roninchain.com/rpc',
  blockExplorer: 'https://app.roninchain.com',
} as const;
