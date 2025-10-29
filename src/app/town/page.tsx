'use client';

import { useWallet } from '@/hooks/useWallet';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TownPage() {
  const { address } = useWallet();
  const { userData, isLoading, refreshUserData } = useAuth();
  const router = useRouter();
  const [energy, setEnergy] = useState(30);
  const [maxEnergy, setMaxEnergy] = useState(30);
  const [showWallet, setShowWallet] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      router.push('/');
    }
  }, [address, router]);

  // Fetch energy on load
  useEffect(() => {
    if (address) {
      fetchEnergy();
    }
  }, [address]);

  const fetchEnergy = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${address}/energy`);
      const data = await res.json();
      if (data.success) {
        setEnergy(data.energy);
        setMaxEnergy(data.maxEnergy);
      }
    } catch (error) {
      console.error('Failed to fetch energy:', error);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setWalletLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${address}/wallet/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(depositAmount) }),
      });
      
      const data = await res.json();
      if (data.success) {
        alert(`✅ ${data.message}`);
        setDepositAmount('');
        refreshUserData();
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Failed to deposit tokens');
    } finally {
      setWalletLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setWalletLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${address}/wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(withdrawAmount) }),
      });
      
      const data = await res.json();
      if (data.success) {
        alert(`✅ ${data.message}`);
        setWithdrawAmount('');
        refreshUserData();
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Withdraw error:', error);
      alert('Failed to withdraw tokens');
    } finally {
      setWalletLoading(false);
    }
  };

  if (!address) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <p className="text-xl text-gray-300">Loading your town...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-8 text-yellow-400">
          🏰 Town of Aeloria
        </h1>

        {/* User Info Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-2 border-yellow-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{userData?.username || 'Adventurer'}</h2>
                <p className="text-sm text-gray-400">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-400">Lv. {userData?.level || 1}</div>
                <p className="text-sm text-gray-400">Total Power: {userData?.totalPower || 0}</p>
              </div>
            </div>

            {/* Energy Display */}
            <div className="mb-4 bg-black/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span className="text-white font-bold">Energy</span>
                </div>
                <span className="text-xl font-bold text-green-400">{energy}/{maxEnergy}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all"
                  style={{ width: `${(energy / maxEnergy) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Resets daily at 9:00 AM (Thailand Time)</p>
            </div>

            {/* Currency Display */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-1">🪙</div>
                <div className="text-2xl font-bold text-yellow-400">{userData?.gold?.toLocaleString() || 0}</div>
                <div className="text-xs text-gray-400">Gold</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-1">💎</div>
                <div className="text-2xl font-bold text-purple-400">{userData?.premiumCurrency || 0}</div>
                <div className="text-xs text-gray-400">Premium</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-1">🔮</div>
                <div className="text-2xl font-bold text-blue-400">{userData?.tokenBalance || 0}</div>
                <div className="text-xs text-gray-400">AETH Token</div>
              </div>
            </div>

            {/* Wallet Button */}
            <button
              onClick={() => setShowWallet(!showWallet)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all"
            >
              {showWallet ? '🔼 Hide Wallet' : '💰 Manage AETH Wallet'}
            </button>

            {/* Wallet Panel */}
            {showWallet && (
              <div className="mt-4 bg-black/40 rounded-lg p-6 border border-blue-500/30">
                <h3 className="text-xl font-bold text-white mb-4">💰 AETH Token Wallet</h3>
                
                {/* Deposit */}
                <div className="mb-6">
                  <label className="text-sm text-gray-400 mb-2 block">Deposit AETH (From Ronin Wallet)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Amount to deposit"
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      disabled={walletLoading}
                    />
                    <button
                      onClick={handleDeposit}
                      disabled={walletLoading}
                      className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white font-bold px-6 py-2 rounded-lg transition-all"
                    >
                      {walletLoading ? '...' : 'Deposit'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Move AETH from blockchain to in-game wallet</p>
                </div>

                {/* Withdraw */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Withdraw AETH (To Ronin Wallet)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Amount to withdraw"
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      disabled={walletLoading}
                    />
                    <button
                      onClick={handleWithdraw}
                      disabled={walletLoading}
                      className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white font-bold px-6 py-2 rounded-lg transition-all"
                    >
                      {walletLoading ? '...' : 'Withdraw'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Move AETH from in-game wallet to blockchain</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Town Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Characters */}
          <Link
            href="/characters"
            className="bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-2 border-blue-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">⚔️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Characters</h2>
            <p className="text-gray-300">View and manage your heroes</p>
          </Link>

          {/* Dungeon */}
          <Link
            href="/dungeon"
            className="bg-gradient-to-br from-red-900/80 to-red-800/80 border-2 border-red-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🗿</div>
            <h2 className="text-2xl font-bold text-white mb-2">Dungeon</h2>
            <p className="text-gray-300">Explore dangerous dungeons</p>
          </Link>

          {/* Shop */}
          <Link
            href="/shop"
            className="bg-gradient-to-br from-green-900/80 to-green-800/80 border-2 border-green-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏪</div>
            <h2 className="text-2xl font-bold text-white mb-2">Shop</h2>
            <p className="text-gray-300">Buy items and equipment</p>
          </Link>

          {/* Marketplace */}
          <Link
            href="/marketplace"
            className="bg-gradient-to-br from-purple-900/80 to-purple-800/80 border-2 border-purple-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏛️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Marketplace</h2>
            <p className="text-gray-300">Trade with other players</p>
          </Link>

          {/* Crafting */}
          <Link
            href="/crafting"
            className="bg-gradient-to-br from-orange-900/80 to-orange-800/80 border-2 border-orange-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">⚒️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Crafting</h2>
            <p className="text-gray-300">Craft and enhance equipment</p>
          </Link>

          {/* Gacha */}
          <Link
            href="/gacha"
            className="bg-gradient-to-br from-pink-900/80 to-pink-800/80 border-2 border-pink-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎰</div>
            <h2 className="text-2xl font-bold text-white mb-2">Gacha</h2>
            <p className="text-gray-300">Summon new heroes</p>
          </Link>

          {/* Rewards */}
          <Link
            href="/rewards"
            className="bg-gradient-to-br from-yellow-900/80 to-yellow-800/80 border-2 border-yellow-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎁</div>
            <h2 className="text-2xl font-bold text-white mb-2">Rewards</h2>
            <p className="text-gray-300">Claim daily rewards</p>
          </Link>

          {/* Ranking */}
          <Link
            href="/ranking"
            className="bg-gradient-to-br from-cyan-900/80 to-cyan-800/80 border-2 border-cyan-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
            <h2 className="text-2xl font-bold text-white mb-2">Ranking</h2>
            <p className="text-gray-300">View leaderboards</p>
          </Link>

          {/* Guild */}
          <Link
            href="/guild"
            className="bg-gradient-to-br from-teal-900/80 to-teal-800/80 border-2 border-teal-500/50 rounded-xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🛡️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Guild</h2>
            <p className="text-gray-300">Join or create a guild</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
