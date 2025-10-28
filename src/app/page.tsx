'use client';

import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { useState } from 'react';

export default function Home() {
  const { address, connect } = useWallet();
  const [error, setError] = useState('');

  const handleConnect = async () => {
    try {
      setError('');
      await connect();
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      alert(err.message || 'Failed to connect wallet');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Aeloria
        </h1>
        <p className="text-2xl md:text-3xl text-center mb-4 text-purple-200">
          Guardians of the Eternal Sigils
        </p>
        <p className="text-lg md:text-xl text-center mb-12 text-gray-300 max-w-2xl">
          Embark on an epic Web3 adventure on the Ronin Network.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {address ? (
            <Link href="/dashboard" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-xl font-bold hover:scale-105 transition-transform">
              Enter Game
            </Link>
          ) : (
            <button onClick={handleConnect} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-xl font-bold hover:scale-105 transition-transform">
              Connect Wallet
            </button>
          )}
        </div>
        {error && (
          <p className="mt-4 text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}
