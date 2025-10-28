import { create } from 'zustand';
import { ethers } from 'ethers';

// Extend Window interface for Ronin Wallet
declare global {
  interface Window {
    ronin?: {
      provider?: any;
    };
    ethereum?: any;
  }
}

interface WalletState {
  address: string | null;
  isConnected: boolean;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWallet = create<WalletState>((set) => ({
  address: null,
  isConnected: false,
  provider: null,
  signer: null,
  chainId: null,

  connect: async () => {
    try {
      // Support both Ronin Wallet and MetaMask
      const provider = window.ronin?.provider || window.ethereum;
      
      if (!provider) {
        throw new Error('Please install Ronin Wallet or MetaMask');
      }

      const ethersProvider = new ethers.BrowserProvider(provider);
      const accounts = await ethersProvider.send('eth_requestAccounts', []);
      const signer = await ethersProvider.getSigner();
      const network = await ethersProvider.getNetwork();

      set({
        address: accounts[0],
        isConnected: true,
        provider: ethersProvider,
        signer,
        chainId: Number(network.chainId),
      });

      // Listen for account changes (both Ronin and MetaMask)
      const activeProvider = window.ronin?.provider || window.ethereum;
      if (activeProvider?.on) {
        activeProvider.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            set({
              address: null,
              isConnected: false,
              provider: null,
              signer: null,
              chainId: null,
            });
          } else {
            set({ address: accounts[0] });
          }
        });

        // Listen for chain changes
        activeProvider.on('chainChanged', () => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  },

  disconnect: () => {
    set({
      address: null,
      isConnected: false,
      provider: null,
      signer: null,
      chainId: null,
    });
  },
}));
