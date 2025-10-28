'use client';

import { useWallet } from '@/hooks/useWallet';

export default function WalletButton() {
  const { address, isConnected, connect, disconnect } = useWallet();

  const handleClick = async () => {
    if (isConnected) {
      disconnect();
    } else {
      try {
        await connect();
      } catch (error) {
        alert('Failed to connect wallet. Please install Ronin Wallet extension.');
      }
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <button
      onClick={handleClick}
      className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105"
    >
      {isConnected && address ? formatAddress(address) : 'Connect Ronin Wallet'}
    </button>
  );
}
