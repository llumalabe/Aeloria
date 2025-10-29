import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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

export type WalletType = 'ronin' | 'ronin-waypoint' | 'metamask' | 'walletconnect';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  chainId: number | null;
  walletType: WalletType | null;
  connect: (walletType?: WalletType) => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
}

export const useWallet = create<WalletState>()(
  persist(
    (set, get) => ({
      address: null,
      isConnected: false,
      provider: null,
  signer: null,
  chainId: null,
  walletType: null,

  connect: async (walletType?: WalletType) => {
    try {
      let provider = null;
      let selectedWalletType: WalletType | null = null;

      // Connect based on specified wallet type
      if (walletType === 'ronin' || walletType === 'ronin-waypoint') {
        // Ronin Wallet or Ronin Waypoint
        if (window.ronin?.provider) {
          provider = window.ronin.provider;
          selectedWalletType = walletType;
          console.log(`Using ${walletType === 'ronin' ? 'Ronin Wallet' : 'Ronin Waypoint'}`);
        } else {
          throw new Error('Ronin Wallet is not installed. Please install Ronin Wallet extension.');
        }
      } else if (walletType === 'metamask') {
        // MetaMask
        if (window.ethereum && window.ethereum.isMetaMask) {
          provider = window.ethereum;
          selectedWalletType = 'metamask';
          console.log('Using MetaMask');
        } else {
          throw new Error('MetaMask is not installed. Please install MetaMask extension.');
        }
      } else if (walletType === 'walletconnect') {
        // WalletConnect - will be implemented with WalletConnect SDK
        throw new Error('WalletConnect support coming soon!');
      } else {
        // Auto-detect wallet (backward compatibility)
        if (window.ronin?.provider) {
          provider = window.ronin.provider;
          selectedWalletType = 'ronin';
          console.log('Using Ronin Wallet');
        } else if (window.ethereum) {
          provider = window.ethereum;
          selectedWalletType = 'metamask';
          console.log('Using MetaMask');
        }
      }

      if (!provider) {
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
        walletType: selectedWalletType,
      });

      // Listen for account changes
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
              walletType: null,
            });
          } else {
            set({ address: accounts[0] });
          }
        });

        activeProvider.on('chainChanged', () => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  },  disconnect: () => {
    set({
      address: null,
      isConnected: false,
      provider: null,
      signer: null,
      chainId: null,
      walletType: null,
    });
  },

  reconnect: async () => {
    const state = get();
    if (state.walletType && state.address) {
      try {
        let provider = null;
        
        // Get the provider based on stored wallet type
        if (state.walletType === 'ronin' || state.walletType === 'ronin-waypoint') {
          if (window.ronin?.provider) {
            provider = window.ronin.provider;
          }
        } else if (state.walletType === 'metamask') {
          if (window.ethereum && window.ethereum.isMetaMask) {
            provider = window.ethereum;
          }
        }

        if (!provider) {
          throw new Error('Wallet provider not found');
        }

        const ethersProvider = new ethers.BrowserProvider(provider);
        const accounts = await ethersProvider.send('eth_accounts', []); // Use eth_accounts to avoid popup
        
        if (accounts.length === 0) {
          throw new Error('No connected accounts');
        }

        const signer = await ethersProvider.getSigner();
        const network = await ethersProvider.getNetwork();

        set({
          address: accounts[0],
          isConnected: true,
          provider: ethersProvider,
          signer,
          chainId: Number(network.chainId),
        });
      } catch (error) {
        console.error('Failed to reconnect:', error);
        set({
          address: null,
          isConnected: false,
          provider: null,
          signer: null,
          chainId: null,
          walletType: null,
        });
      }
    }
  },
}),
    {
      name: 'aeloria-wallet-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        address: state.address,
        walletType: state.walletType,
        chainId: state.chainId,
        isConnected: state.isConnected,
      }),
    }
  )
);
