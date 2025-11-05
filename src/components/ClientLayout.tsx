'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi';
import Footer from './Footer';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy load components to prevent SSR issues
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });
const WalletReconnect = dynamic(() => import('./WalletReconnect'), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
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
  }, []);

  // Don't render Web3 providers until mounted (client-side only)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="flex-grow pb-16">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  // Validate wagmiConfig before rendering providers
  if (!wagmiConfig || !wagmiConfig.chains || wagmiConfig.chains.length === 0) {
    console.error('Invalid wagmiConfig:', wagmiConfig);
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-black/50 backdrop-blur-sm border-2 border-red-500/50 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-400 mb-4">
            Configuration Error
          </h1>
          <p className="text-gray-300 mb-6">
            Wagmi configuration is invalid. Please check your setup.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
