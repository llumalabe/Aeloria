'use client';
import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import Link from 'next/link';

export default function Dashboard() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const addr = await signer.getAddress();
          setAddress(addr);
        } catch (error) {
          console.log('Wallet not connected');
        }
      }
      setLoading(false);
    };
    checkWallet();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black p-8">
      <h1 className="text-6xl font-bold text-center text-yellow-400 mb-8">Aeloria Dashboard</h1>
      <div className="text-center">
        <Link href="/characters" className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold">Go to Characters</Link>
      </div>
    </div>
  );
}
