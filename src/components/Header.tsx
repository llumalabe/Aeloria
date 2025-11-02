'use client';

import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { TantoConnectButton } from '@sky-mavis/tanto-widget';
import { useState, useEffect } from 'react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { address, disconnect } = useWallet();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            {/* Hamburger Button - Mobile Only */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 w-6 bg-current transition-all ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-all ${sidebarOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-all ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>

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
                /* Tanto Connect Wallet Button */
                <div className="flex items-center">
                  <TantoConnectButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
