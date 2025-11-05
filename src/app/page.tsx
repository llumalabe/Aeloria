'use client';

import { useRoninWallet } from '@/hooks/useRoninWallet';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const {
    address,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
  } = useRoninWallet();

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
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-600">
            Aeloria
          </h1>
          <p className="text-2xl md:text-3xl mb-4 text-purple-200 font-semibold">
            Guardians of the Eternal Sigils
          </p>
          <p className="text-gray-400 text-lg">
            Web3 Fantasy RPG on Ronin Network
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
          {!isConnected ? (
            <div>
              <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
                Connect Your Wallet
              </h2>
              <p className="text-gray-300 text-center mb-8">
                Connect your Ronin Wallet to start your adventure in Aeloria
              </p>
              
              <button
                onClick={connect}
                disabled={isConnecting}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-xl rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
              >
                {isConnecting ? 'Connecting...' : 'Connect Ronin Wallet'}
              </button>

              {error && (
                <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                  {error.includes('not installed') && (
                    <a
                      href="https://wallet.roninchain.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-3 text-center text-blue-400 hover:text-blue-300 underline"
                    >
                      Install Ronin Wallet Extension
                    </a>
                  )}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-purple-500/30">
                <p className="text-gray-400 text-sm text-center mb-4">
                  New to Ronin Wallet?
                </p>
                <a
                  href="https://wallet.roninchain.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-center"
                >
                  Get Ronin Wallet
                </a>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/50 border border-green-500/50 rounded-full mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Connected</span>
                </div>
                <p className="text-2xl font-bold text-white font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>

              <div className="space-y-4">
                <button className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-xl rounded-lg transition-all duration-200 shadow-lg hover:shadow-yellow-500/50">
                  Enter Aeloria
                </button>

                <button
                  onClick={disconnect}
                  className="w-full py-3 px-6 bg-gray-800 hover:bg-red-900 text-white font-medium rounded-lg transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Powered by Ronin Network</p>
        </div>
      </div>
    </div>
  );
}
