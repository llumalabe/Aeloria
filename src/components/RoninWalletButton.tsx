'use client';

import { useRoninWallet } from '@/hooks/useRoninWallet';

export default function RoninWalletButton() {
  const {
    address,
    isConnected,
    isConnecting,
    isInstalled,
    error,
    connect,
    disconnect,
  } = useRoninWallet();

  if (!isInstalled) {
    return (
      <a
        href="https://wallet.roninchain.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
      >
        Install Ronin Wallet
      </a>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-green-900/50 border border-green-500/50 rounded-lg">
          <div className="text-xs text-green-400 mb-1">Connected</div>
          <div className="text-sm font-mono text-white">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={connect}
        disabled={isConnecting}
        className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-colors"
      >
        {isConnecting ? 'Connecting...' : 'Connect Ronin Wallet'}
      </button>
      {error && (
        <div className="text-sm text-red-400 bg-red-900/20 border border-red-500/50 rounded p-2">
          {error}
        </div>
      )}
    </div>
  );
}
