'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { address, disconnect, connect } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Menu items based on login status
  const menuItems = address ? [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/town', label: 'Town', icon: '🏰' },
    { href: '/characters', label: 'Inventory', icon: '🎒' },
    { href: '/gacha', label: 'Summon', icon: '🎲' },
    { href: '/crafting', label: 'Craft', icon: '🔨' },
    { href: '/rewards', label: 'Rewards', icon: '🎁' },
    { href: '/ranking', label: 'Leaderboard', icon: '🏆' },
    { href: '/vip', label: 'VIP', icon: '👑' },
  ] : [
    { href: '/', label: 'Home', icon: '🏠' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Hamburger Button - Mobile Only (Moved to Header, keeping this for reference) */}
      {/* Overlay - Mobile Only */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-900 via-indigo-900 to-black border-r-2 border-yellow-500/30 z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-yellow-500/30">
            <Link href="/" className="block">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-600">
                Aeloria
              </h1>
              <p className="text-xs text-gray-400 mt-1">Guardians of the Eternal Sigils</p>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                      ${isActive(item.href)
                        ? 'bg-yellow-500/20 text-yellow-400 border-l-4 border-yellow-500'
                        : 'text-gray-300 hover:bg-purple-800/50 hover:text-white'
                      }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info & Actions */}
          <div className="p-4 border-t border-yellow-500/30">
            {address ? (
              /* Logged In: Show wallet info + Disconnect */
              <>
                <div className="bg-black/30 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-400 mb-1">Connected Wallet</p>
                  <p className="text-sm text-white font-mono">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    disconnect();
                    setIsOpen(false);
                  }}
                  className="w-full bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  🚪 Disconnect
                </button>
              </>
            ) : (
              /* Not Logged In: Show Connect Wallet */
              <button
                onClick={() => setShowWalletModal(true)}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
              >
                🔗 Connect Wallet
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer for desktop to prevent content from hiding under sidebar */}
      <div className="hidden lg:block w-64" />

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div 
          onClick={() => setShowWalletModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-b from-gray-900 to-black border-2 border-yellow-500/50 rounded-xl p-8 max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
            <p className="text-gray-400 mb-6">Choose your wallet to start playing</p>

            <div className="space-y-3">
              {/* Ronin Wallet */}
              <button
                onClick={async () => {
                  try {
                    await connect('ronin');
                    setShowWalletModal(false);
                    setIsOpen(false);
                  } catch (error) {
                    console.error('Failed to connect:', error);
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">🗡️</span>
                  <span>Ronin Wallet</span>
                </span>
                <span className="text-sm opacity-75 group-hover:opacity-100">Recommended</span>
              </button>

              {/* MetaMask */}
              <button
                onClick={async () => {
                  try {
                    await connect('metamask');
                    setShowWalletModal(false);
                    setIsOpen(false);
                  } catch (error) {
                    console.error('Failed to connect:', error);
                  }
                }}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center gap-3"
              >
                <span className="text-2xl">🦊</span>
                <span>MetaMask</span>
              </button>

              {/* WalletConnect */}
              <button
                disabled
                className="w-full bg-gray-700 text-gray-400 font-bold py-4 px-6 rounded-lg cursor-not-allowed flex items-center gap-3"
              >
                <span className="text-2xl">📱</span>
                <span>WalletConnect (Coming Soon)</span>
              </button>
            </div>

            <button
              onClick={() => setShowWalletModal(false)}
              className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
