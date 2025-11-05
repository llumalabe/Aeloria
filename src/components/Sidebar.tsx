'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RoninWalletButton from './RoninWalletButton';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  // For now, show all menu items (will be filtered based on wallet connection later)
  const menuItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/town', label: 'Town', icon: '🏰' },
    { href: '/characters', label: 'Inventory', icon: '🎒' },
    { href: '/gacha', label: 'Summon', icon: '🎲' },
    { href: '/crafting', label: 'Craft', icon: '🔨' },
    { href: '/rewards', label: 'Rewards', icon: '🎁' },
    { href: '/ranking', label: 'Leaderboard', icon: '🏆' },
    { href: '/vip', label: 'VIP', icon: '👑' },
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
            <RoninWalletButton />
          </div>
        </div>
      </aside>

      {/* Spacer for desktop to prevent content from hiding under sidebar */}
      <div className="hidden lg:block w-64" />
    </>
  );
}
