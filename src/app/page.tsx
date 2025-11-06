'use client';

import { useWaypoint } from '@/hooks/useWaypoint';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, isConnecting, error, connect, disconnect } = useWaypoint();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-orange-500 to-red-800">
            Dead Zone
          </h1>
          <p className="text-2xl md:text-3xl mb-4 text-red-300 font-semibold">
            Survival of the Fittest
          </p>
          <p className="text-gray-400 text-lg">
            Web3 Zombie Survival Game on Ronin Network
          </p>
        </div>

        <div className="bg-black/60 backdrop-blur-sm border border-red-800/50 rounded-2xl p-8 shadow-2xl shadow-red-900/20">
          {!isConnected ? (
            <div>
              <h2 className="text-3xl font-bold text-center mb-6 text-red-500">
                Connect Your Wallet
              </h2>

              <p className="text-gray-300 text-center mb-8">
                Connect your Ronin Wallet to survive the apocalypse
              </p>
              
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center">
                  {error}
                </div>
              )}
              
              <button
                onClick={connect}
                disabled={isConnecting}
                className="w-full py-4 px-6 bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-xl rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-600/50"
              >
                {isConnecting ? 'Connecting...' : 'Connect & Survive'}
              </button>

              <div className="mt-8 pt-6 border-t border-red-800/30">
                <p className="text-gray-400 text-sm text-center mb-4">
                  New to Ronin Wallet?
                </p>
                <a
                  href="https://wallet.roninchain.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-center"
                >
                  Download Ronin Wallet
                </a>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/50 border border-red-500/50 rounded-full mb-4">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-400 text-sm font-medium">Survivor Online</span>
                </div>
                <p className="text-2xl font-bold text-white font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>

              <div className="space-y-4">
                <button className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-xl rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-600/50">
                  🧟 Enter Dead Zone
                </button>

                <button
                  onClick={disconnect}
                  className="w-full py-3 px-6 bg-gray-800 hover:bg-red-900 text-white font-medium rounded-lg transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-400 text-sm text-center font-semibold">
                  ⚠️ Survival Mode Coming Soon
                </p>
                <p className="text-gray-400 text-xs text-center mt-1">
                  Scavenge, fight, survive the apocalypse
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 Dead Zone | Survive or Die</p>
        </div>
      </div>
    </div>
  );
}
