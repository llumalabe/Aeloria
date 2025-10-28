import { create } from 'zustand';
import { ethers } from 'ethers';

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
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask or Ronin Wallet');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      set({
        address: accounts[0],
        isConnected: true,
        provider,
        signer,
        chainId: Number(network.chainId),
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
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
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
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
