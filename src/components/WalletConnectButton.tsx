'use client';

import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-4 py-2 bg-purple-900/50 border border-yellow-500/50 rounded-lg text-yellow-400 font-medium">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-700 border border-red-500/50 rounded-lg text-white font-medium transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        const injectedConnector = connectors.find((c) => c.id === 'injected');
        if (injectedConnector) {
          connect({ connector: injectedConnector });
        }
      }}
      disabled={isPending}
      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 border-2 border-yellow-500/50 rounded-lg text-white font-bold shadow-lg shadow-purple-500/50 transition-all transform hover:scale-105 disabled:scale-100"
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
