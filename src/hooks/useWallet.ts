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
      // Check for wallet providers in order of preference
      let provider = null;
      
      // 1. Check Ronin Wallet (Desktop & Mobile)
      if (window.ronin?.provider) {
        provider = window.ronin.provider;
        console.log('Using Ronin Wallet');
      }
      // 2. Check MetaMask or other injected wallets
      else if (window.ethereum) {
        provider = window.ethereum;
        console.log('Using injected wallet (MetaMask/etc)');
      }
      
      if (!provider) {
        // Detect mobile and provide specific instructions
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          throw new Error('Please open this page in Ronin Wallet or MetaMask app browser');
        } else {
          throw new Error('Please install Ronin Wallet or MetaMask extension');
        }
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
