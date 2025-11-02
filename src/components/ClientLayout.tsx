'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TantoProvider } from '@sky-mavis/tanto-widget';
import { wagmiConfig } from '@/lib/wagmi';
import Footer from './Footer';

// Lazy load components to prevent SSR issues
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });
const WalletReconnect = dynamic(() => import('./WalletReconnect'), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Create QueryClient inside component to prevent SSR issues
  const [queryClient] = useState(() => new QueryClient());

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TantoProvider
          theme="dark"
          config={{
            initialChainId: 2020, // Ronin Mainnet
            hideConnectSuccessPrompt: false, // Show success animation
            disableProfile: false, // Show profile modal
          }}
        >
          <div className="min-h-screen bg-black text-white">
            {/* Only render after mounted to avoid SSR issues */}
            {mounted && <WalletReconnect />}
            {mounted && <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}

            {/* Hamburger for Mobile */}
            {mounted && (
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
            )}

            {/* Main Content */}
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </TantoProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
