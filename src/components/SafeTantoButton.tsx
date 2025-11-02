'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import TantoConnectButton to prevent SSR issues
const TantoConnectButton = dynamic(
  () => import('@sky-mavis/tanto-widget').then((mod) => ({ default: mod.TantoConnectButton })),
  { 
    ssr: false,
    loading: () => (
      <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold">
        Connect Wallet
      </button>
    ),
  }
);

export default function SafeTantoButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold">
        Connect Wallet
      </button>
    );
  }

  return <TantoConnectButton />;
}
