'use client';

import Link from 'next/link';
import { useWallet, type WalletType } from '@/hooks/useWallet';
import { useState, useEffect } from 'react';

export default function Header() {
  const { address, connect, disconnect } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConnectWallet = async (walletType: WalletType) => {
    try {
      setError('');
      await connect(walletType);
      setShowWalletModal(false);
    } catch (error: any) {
      console.error('Failed to connect:', error);
      setError(error.message || 'Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowAccountDropdown(false);
  };

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-yellow-500/30' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Mobile/Tablet Only (Desktop uses Sidebar) */}
            <Link href="/" className="flex items-center gap-3 group lg:hidden">
              <div className="text-4xl group-hover:scale-110 transition-transform">⚔️</div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Aeloria
                </h1>
                <p className="text-xs text-gray-400">Guardians</p>
              </div>
            </Link>

            {/* Spacer for desktop */}
            <div className="hidden lg:block flex-1"></div>

            {/* Wallet Connection - Always visible */}
            <div className="flex items-center gap-4">
              {address ? (
                /* Connected Account */
                <div className="relative">
                  <button
                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-4 py-2 rounded-lg border-2 border-yellow-500/50 transition-all"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-mono text-sm">{shortAddress}</span>
                  </button>

                  {/* Dropdown */}
                  {showAccountDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-900 border-2 border-yellow-500/30 rounded-lg shadow-xl overflow-hidden">
                      <div className="p-4 border-b border-gray-700">
                        <p className="text-xs text-gray-400 mb-1">Connected Wallet</p>
                        <p className="text-sm font-mono text-white break-all">{address}</p>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setShowAccountDropdown(false)}
                        className="block px-4 py-3 hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                      >
                        � Dashboard
                      </Link>
                      
                      <button
                        onClick={handleDisconnect}
                        className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors text-red-400 hover:text-red-300"
                      >
                        🚪 Disconnect
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Connect Wallet Button */
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
                >
                  🔗 Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-yellow-500 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-400">Connect a Wallet</h2>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-400 mb-4">Installed</p>
              
              {/* Ronin Wallet */}
              <button
                onClick={() => handleConnectWallet('ronin')}
                className="w-full bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-yellow-500 rounded-lg p-4 flex items-center gap-4 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">
                  🦊
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-white group-hover:text-yellow-400">Ronin Wallet</p>
                  <p className="text-xs text-gray-400">Connect to Ronin Network</p>
                </div>
              </button>

              <p className="text-sm text-gray-400 mt-6 mb-2">Recent</p>
              
              {/* Ronin Waypoint */}
              <button
                onClick={() => handleConnectWallet('ronin-waypoint')}
                className="w-full bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-yellow-500 rounded-lg p-4 flex items-center gap-4 transition-all group"
              >
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-2xl">
                  🌉
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-white group-hover:text-yellow-400">Ronin Waypoint</p>
                  <p className="text-xs text-gray-400">Ronin Browser Wallet</p>
                </div>
              </button>

              {/* MetaMask */}
              <button
                onClick={() => handleConnectWallet('metamask')}
                className="w-full bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-yellow-500 rounded-lg p-4 flex items-center gap-4 transition-all group"
              >
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-2xl">
                  🦊
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-white group-hover:text-yellow-400">MetaMask</p>
                  <p className="text-xs text-gray-400">Popular Web3 Wallet</p>
                </div>
              </button>

              {/* WalletConnect */}
              <button
                onClick={() => handleConnectWallet('walletconnect')}
                className="w-full bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-yellow-500 rounded-lg p-4 flex items-center gap-4 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
                  🔗
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-white group-hover:text-yellow-400">WalletConnect</p>
                  <p className="text-xs text-gray-400">Scan with your mobile wallet</p>
                </div>
              </button>
              
              {error && (
                <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>            <p className="text-xs text-gray-500 text-center mt-6">
              By connecting, you agree to our Terms of Service
            </p>
          </div>
        </div>
      )}
    </>
  );
}
