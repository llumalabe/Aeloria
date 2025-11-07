// Smart Contract Addresses
export const CONTRACTS = {
  survivorNFT: process.env.NEXT_PUBLIC_SURVIVOR_NFT_ADDRESS || '',
  gameToken: process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS || '',
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const NFT_METADATA_BASE_URI = ${API_URL}/api/nft/metadata/;

export const NETWORK = {
  chainId: 2021,
  name: 'Saigon Testnet',
  rpcUrl: 'https://saigon-testnet.roninchain.com/rpc',
  explorer: 'https://saigon-app.roninchain.com',
};
