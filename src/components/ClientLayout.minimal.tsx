'use client';

import { useState, useEffect } from 'react';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="flex-grow pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
