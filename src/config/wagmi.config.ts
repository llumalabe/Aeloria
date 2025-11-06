import { http, createConfig } from 'wagmi'
import { defineChain } from 'viem'
import { walletConnect, injected } from 'wagmi/connectors'

// Define Ronin Mainnet
export const ronin = defineChain({
  id: 2020,
  name: 'Ronin',
  nativeCurrency: { name: 'RON', symbol: 'RON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.roninchain.com/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Ronin Explorer', url: 'https://app.roninchain.com' },
  },
})

// Define Saigon Testnet
export const saigon = defineChain({
  id: 2021,
  name: 'Saigon Testnet',
  nativeCurrency: { name: 'RON', symbol: 'RON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://saigon-testnet.roninchain.com/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Saigon Explorer', url: 'https://saigon-app.roninchain.com' },
  },
  testnet: true,
})

// WalletConnect Project ID - get from cloud.walletconnect.com
const projectId = 'FWH2ducl0Ur5fFSAOeNdXS0p8LmWGD6j'

export const config = createConfig({
  chains: [ronin, saigon],
  connectors: [
    injected(), // For Ronin Wallet browser extension
    walletConnect({ 
      projectId,
      metadata: {
        name: 'Aeloria: Guardians of the Eternal Sigils',
        description: 'Web3 Fantasy RPG on Ronin Network',
        url: 'https://aeloria-two.vercel.app',
        icons: ['https://aeloria-two.vercel.app/logo.png']
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [ronin.id]: http(),
    [saigon.id]: http(),
  },
})
