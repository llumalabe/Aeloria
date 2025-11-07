'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'bunker', label: 'Bunker', icon: '🏚️', href: '/game' },
  { id: 'map', label: 'Map', icon: '🗺️', href: '/game/map' },
  { id: 'bag', label: 'Bag', icon: '🎒', href: '/game/inventory' },
  { id: 'character', label: 'Character', icon: '👤', href: '/game/character' },
  { id: 'wallet', label: 'Wallet', icon: '💰', href: '/game/wallet' },
];

export default function GameNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-red-800/50 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-red-900/50 text-red-400 shadow-lg shadow-red-900/30'
                    : 'text-gray-400 hover:text-red-300 hover:bg-gray-800/50'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 w-8 h-0.5 bg-red-500 rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
