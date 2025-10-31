'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { address, disconnect } = useWallet();

  const menuItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/town', label: 'Town', icon: '🏰' },
    { href: '/dungeon', label: 'Dungeon', icon: '⚔️' },
    { href: '/pvp', label: 'PvP Arena', icon: '⚔️' },
    { href: '/gacha', label: 'Summon', icon: '🎲' },
    { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Hamburger Button - Mobile Only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-purple-900/90 backdrop-blur-sm p-3 rounded-lg border-2 border-yellow-500/50 hover:bg-purple-800 transition-all"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className={`block h-0.5 w-6 bg-yellow-400 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-yellow-400 transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-yellow-400 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </div>
      </button>

      {/* Overlay - Mobile Only */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-900 via-indigo-900 to-black border-r-2 border-yellow-500/30 z-40 transform transition-transform duration-300 ease-in-out
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

          {/* User Info & Disconnect */}
          {address && (
            <div className="p-4 border-t border-yellow-500/30">
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
            </div>
          )}
        </div>
      </aside>

      {/* Spacer for desktop to prevent content from hiding under sidebar */}
      <div className="hidden lg:block w-64" />
    </>
  );
}
