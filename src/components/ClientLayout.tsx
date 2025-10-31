'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 min-h-screen">
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

        <main className="flex-grow py-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
