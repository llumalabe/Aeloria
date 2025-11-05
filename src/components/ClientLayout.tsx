'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi';
import Footer from './Footer';

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
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #581c87, #6b21a8, #000000)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          maxWidth: '28rem',
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          border: '2px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#f87171',
            marginBottom: '1rem'
          }}>
            Configuration Error
          </h1>
          <p style={{
            color: '#d1d5db',
            marginBottom: '1.5rem'
          }}>
            Wagmi configuration is invalid. Please check your setup.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              width: '100%',
              backgroundColor: '#9333ea',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9333ea'}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
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
  );
}
