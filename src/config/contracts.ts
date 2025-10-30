// Contract addresses on Ronin Saigon Testnet
export const CONTRACTS = {
  AETH_TOKEN: '0x61F434B602C5e561A5Fd2Ad7850B7bB2A91dd797',
  WALLET_MANAGER: '0xc566e86C2C992aD98071ab66fd8aa2f6993b9a91',
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
