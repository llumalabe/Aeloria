'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi';
import Footer from './Footer';
import { WagmiErrorBoundary } from './WagmiErrorBoundary';

// Lazy load components to prevent SSR issues
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });
const WalletReconnect = dynamic(() => import('./WalletReconnect'), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasWagmiError, setHasWagmiError] = useState(false);
  const [wagmiReady, setWagmiReady] = useState(false);
  
  // Create QueryClient inside component to prevent SSR issues
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Disable automatic refetching during SSR
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  }));

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true);
    
    // Check if Wagmi can be initialized safely
    try {
      if (!wagmiConfig || !wagmiConfig.chains || !wagmiConfig.connectors) {
        console.warn('Wagmi config incomplete, using fallback mode');
        setHasWagmiError(true);
        setWagmiReady(true);
        return;
      }
    } catch (error) {
      console.error('Error checking Wagmi config:', error);
      setHasWagmiError(true);
      setWagmiReady(true);
      return;
    }
    
    // Give Wagmi time to initialize - increased delay
    setTimeout(() => {
      setWagmiReady(true);
    }, 500);
  }, []);

  // Don't render Web3 providers until mounted AND wagmiReady
  if (!mounted || !wagmiReady) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Aeloria...</p>
        </div>
      </div>
    );
  }

  // If Wagmi has error, render without Web3 features but WITH menu
  if (hasWagmiError) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Hamburger for Mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 right-4 z-50 bg-purple-900/90 backdrop-blur-sm p-3 rounded-lg border-2 border-yellow-500/50 hover:bg-purple-800 transition-all"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 w-6 bg-yellow-400 transition-all ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-yellow-400 transition-all ${sidebarOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-yellow-400 transition-all ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
        
        <div className="p-4 bg-yellow-900/50 text-yellow-200 text-center">
          ⚠️ Web3 wallet features are temporarily unavailable. You can still browse the game.
        </div>
        
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  // Skip validation checks - already done in useEffect

  return (
    <WagmiErrorBoundary onError={() => setHasWagmiError(true)}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-black text-white">
            <WalletReconnect />
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Hamburger for Mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden fixed top-4 right-4 z-50 bg-purple-900/90 backdrop-blur-sm p-3 rounded-lg border-2 border-yellow-500/50 hover:bg-purple-800 transition-all"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 w-6 bg-yellow-400 transition-all ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-yellow-400 transition-all ${sidebarOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-yellow-400 transition-all ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>

            {/* Main Content */}
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </QueryClientProvider>
      </WagmiProvider>
    </WagmiErrorBoundary>
  );
}
