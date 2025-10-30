'use client';

import { useWallet } from '@/hooks/useWallet';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import TransactionHistory from '@/components/TransactionHistory';

export default function TownPage() {
  const { address, provider, signer, reconnect } = useWallet();
  const { userData, isLoading, refreshUserData } = useAuth();
  const router = useRouter();
  const [energy, setEnergy] = useState(30);
  const [maxEnergy, setMaxEnergy] = useState(30);
  const [showWallet, setShowWallet] = useState(false);
  
  // Blockchain state - use address as connected indicator
  const blockchainConnected = !!address; // If address exists, wallet is connected
  const [blockchainBalances, setBlockchainBalances] = useState({ aethBalance: '0', ronBalance: '0' });
  
  // Wallet states
  const [walletStep, setWalletStep] = useState<'select-action' | 'deposit' | 'withdraw'>('select-action');
  const [selectedToken, setSelectedToken] = useState<'AETH' | 'RON'>('AETH');
  const [amount, setAmount] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);

  // Calculate amount after fee (for AETH withdrawal only)
  const amountAfterFee = useMemo(() => {
    if (walletStep === 'withdraw' && selectedToken === 'AETH' && amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        const fee = numAmount * 0.05;
        return numAmount - fee;
      }
    }
    return null;
  }, [walletStep, selectedToken, amount]);

  useEffect(() => {
    if (!address) {
      router.push('/');
    }
  }, [address, router]);

  // Reconnect wallet if address exists but no signer
  useEffect(() => {
    const reconnectWallet = async () => {
      if (address && !signer) {
        console.log('Reconnecting wallet...');
        try {
          await reconnect();
        } catch (error) {
          console.error('Failed to reconnect:', error);
        }
      }
    };
    reconnectWallet();
  }, [address, signer, reconnect]);

  // Fetch energy and balances on load
  useEffect(() => {
    if (address) {
      fetchEnergy();
      if (provider) {
        fetchBlockchainBalances();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, provider]);

  const initBlockchain = async () => {
    // Fetch balances
    if (address && provider) {
      fetchBlockchainBalances();
    }
  };

  const fetchBlockchainBalances = async () => {
    if (!address || !provider) return;
    
    try {
      const { ethers } = await import('ethers');
      const AeloriaTokenABI = (await import('@/lib/abis/AeloriaToken.json')).default;
      const { CONTRACTS } = await import('@/config/contracts');
      
      // Get AETH balance
      let aethBalance = '0';
      try {
        const aethContract = new ethers.Contract(CONTRACTS.AETH_TOKEN, AeloriaTokenABI, provider);
        const balance = await aethContract.balanceOf(address);
        aethBalance = ethers.formatEther(balance || 0);
      } catch (error) {
        console.warn('Failed to fetch AETH balance, defaulting to 0:', error);
        aethBalance = '0';
      }
      
      // Get RON balance
      let ronBalance = '0';
      try {
        const balance = await provider.getBalance(address);
        ronBalance = ethers.formatEther(balance || 0);
      } catch (error) {
        console.warn('Failed to fetch RON balance, defaulting to 0:', error);
        ronBalance = '0';
      }
      
      setBlockchainBalances({
        aethBalance,
        ronBalance
      });
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    }
  };

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
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!signer || !address) {
      alert('Please connect your Ronin Wallet first');
      return;
    }

    // Check if user has RON for gas fees
    if (parseFloat(blockchainBalances.ronBalance) < 0.001) {
      alert('⚠️ Insufficient RON for gas fees!\n\nYou need at least 0.001 RON in your wallet to pay for transaction fees.\n\nGet free testnet RON from:\nhttps://faucet.roninchain.com');
      return;
    }

    setWalletLoading(true);
    try {
      const { ethers } = await import('ethers');
      const WalletManagerABI = (await import('@/lib/abis/WalletManager.json')).default;
      const AeloriaTokenABI = (await import('@/lib/abis/AeloriaToken.json')).default;
      const { CONTRACTS } = await import('@/config/contracts');
      
      let txHash: string;
      
      if (selectedToken === 'AETH') {
        // Deposit AETH
        const aethContract = new ethers.Contract(CONTRACTS.AETH_TOKEN, AeloriaTokenABI, signer);
        const walletManager = new ethers.Contract(CONTRACTS.WALLET_MANAGER, WalletManagerABI, signer);
        
        const amountWei = ethers.parseEther(amount);
        
        // Approve
        const approveTx = await aethContract.approve(CONTRACTS.WALLET_MANAGER, amountWei);
        await approveTx.wait();
        
        // Deposit
        const depositTx = await walletManager.depositAeth(amountWei);
        const receipt = await depositTx.wait();
        txHash = receipt.hash;
      } else {
        // Deposit RON
        const walletManager = new ethers.Contract(CONTRACTS.WALLET_MANAGER, WalletManagerABI, signer);
        const amountWei = ethers.parseEther(amount);
        
        const depositTx = await walletManager.depositRon({ value: amountWei });
        const receipt = await depositTx.wait();
        txHash = receipt.hash;
      }

      if (txHash) {
        // Send transaction to backend for verification
        try {
          const backendRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/${address}/wallet/deposit`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                txHash: txHash,
                tokenType: selectedToken,
                amount: parseFloat(amount),
              }),
            }
          );

          const backendData = await backendRes.json();

          if (backendData.success) {
            alert(`✅ Deposit successful!\nAmount: ${amount} ${selectedToken}\nTransaction: ${txHash}`);
          } else {
            alert(`⚠️ Blockchain transaction succeeded but backend verification failed:\n${backendData.error}\n\nYour tokens are safe on-chain. Contact support with this TX: ${txHash}`);
          }
        } catch (backendError) {
          console.error('Backend verification error:', backendError);
          alert(`⚠️ Blockchain transaction succeeded but couldn't sync with backend.\n\nYour tokens are safe on-chain. TX: ${txHash}`);
        }

        setAmount('');
        setWalletStep('select-action');
        
        // Refresh balances
        await fetchBlockchainBalances();
        await refreshUserData();
      }
    } catch (error: any) {
      console.error('Deposit error:', error);
      alert(`❌ Deposit failed: ${error.message || 'Unknown error'}`);
    } finally {
      setWalletLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!signer || !address) {
      alert('Please connect your Ronin Wallet first');
      return;
    }

    // Check if user has RON for gas fees
    if (parseFloat(blockchainBalances.ronBalance) < 0.001) {
      alert('⚠️ Insufficient RON for gas fees!\n\nYou need at least 0.001 RON in your wallet to pay for transaction fees.\n\nGet free testnet RON from:\nhttps://faucet.roninchain.com');
      return;
    }

    setWalletLoading(true);
    try {
      const { ethers } = await import('ethers');
      const WalletManagerABI = (await import('@/lib/abis/WalletManager.json')).default;
      const { CONTRACTS } = await import('@/config/contracts');
      
      const walletManager = new ethers.Contract(CONTRACTS.WALLET_MANAGER, WalletManagerABI, signer);
      const amountWei = ethers.parseEther(amount);
      
      let txHash: string;
      
      if (selectedToken === 'AETH') {
        const withdrawTx = await walletManager.withdrawAeth(amountWei);
        const receipt = await withdrawTx.wait();
        txHash = receipt.hash;
      } else {
        const withdrawTx = await walletManager.withdrawRon(amountWei);
        const receipt = await withdrawTx.wait();
        txHash = receipt.hash;
      }

      if (txHash) {
        // Send transaction to backend for verification
        try {
          const backendRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/${address}/wallet/withdraw`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                txHash: txHash,
                tokenType: selectedToken,
                amount: parseFloat(amount),
              }),
            }
          );

          const backendData = await backendRes.json();

          if (backendData.success) {
            const feeMsg = backendData.fee && parseFloat(backendData.fee) > 0 
              ? `\nFee: ${backendData.fee} ${selectedToken}`
              : '';
            alert(`✅ Withdrawal successful!\nAmount: ${amount} ${selectedToken}${feeMsg}\nTransaction: ${txHash}`);
          } else {
            alert(`⚠️ Blockchain transaction succeeded but backend verification failed:\n${backendData.error}\n\nYour tokens were withdrawn safely. Contact support with this TX: ${txHash}`);
          }
        } catch (backendError) {
          console.error('Backend verification error:', backendError);
          alert(`⚠️ Blockchain transaction succeeded but couldn't sync with backend.\n\nYour tokens were withdrawn safely. TX: ${txHash}`);
        }

        setAmount('');
        setWalletStep('select-action');
        
        // Refresh balances
        await fetchBlockchainBalances();
        await refreshUserData();
      }
    } catch (error: any) {
      console.error('Withdraw error:', error);
      alert(`❌ Withdrawal failed: ${error.message || 'Unknown error'}`);
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
            <div className="grid grid-cols-4 gap-4 mb-4">
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
                <div className="text-xs text-gray-400">AETH</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-1">🔷</div>
                <div className="text-2xl font-bold text-cyan-400">{userData?.ronTokens || 0}</div>
                <div className="text-xs text-gray-400">RON</div>
              </div>
            </div>

            {/* Wallet Button */}
            <button
              onClick={() => {
                setShowWallet(!showWallet);
                if (!showWallet) {
                  setWalletStep('select-action');
                  setAmount('');
                }
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all"
            >
              {showWallet ? '🔼 Hide Wallet' : '💰 Wallet'}
            </button>

            {/* Wallet Panel */}
            {showWallet && (
              <div className="mt-4 bg-black/40 rounded-lg p-6 border border-blue-500/30">
                {/* Blockchain Status */}
                <div className="mb-4 pb-4 border-b border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${blockchainConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm text-gray-400">
                        {blockchainConnected ? '🔗 Connected to Ronin' : '⚠️ Not Connected'}
                      </span>
                    </div>
                    {!blockchainConnected && (
                      <button
                        onClick={initBlockchain}
                        className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded"
                      >
                        Connect Wallet
                      </button>
                    )}
                  </div>
                  
                  {blockchainConnected && (
                    <div className="mt-3 grid grid-cols-2 gap-3 bg-black/30 rounded p-3">
                      <div>
                        <div className="text-xs text-gray-400">On-Chain AETH</div>
                        <div className="text-lg font-bold text-blue-400">{parseFloat(blockchainBalances.aethBalance).toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">On-Chain RON</div>
                        <div className="text-lg font-bold text-cyan-400">{parseFloat(blockchainBalances.ronBalance).toFixed(4)}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 1: Select Action */}
                {walletStep === 'select-action' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">💰 Wallet</h3>
                    <button
                      onClick={() => setWalletStep('deposit')}
                      disabled={!blockchainConnected}
                      className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all"
                    >
                      📥 Deposit (From Ronin Wallet)
                    </button>
                    <button
                      onClick={() => setWalletStep('withdraw')}
                      disabled={!blockchainConnected}
                      className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all"
                    >
                      📤 Withdraw (To Ronin Wallet)
                    </button>
                  </div>
                )}

                {/* Step 2 & 3: Deposit/Withdraw Form */}
                {(walletStep === 'deposit' || walletStep === 'withdraw') && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">
                        {walletStep === 'deposit' ? '📥 Deposit' : '📤 Withdraw'}
                      </h3>
                      <button
                        onClick={() => {
                          setWalletStep('select-action');
                          setAmount('');
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        ← Back
                      </button>
                    </div>

                    {/* Token Selection */}
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Select Token</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedToken('AETH')}
                          className={`py-3 rounded-lg font-bold transition-all ${
                            selectedToken === 'AETH'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          🔮 AETH
                        </button>
                        <button
                          onClick={() => setSelectedToken('RON')}
                          className={`py-3 rounded-lg font-bold transition-all ${
                            selectedToken === 'RON'
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          🔷 RON
                        </button>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Amount</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-blue-500"
                        disabled={walletLoading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Available: {selectedToken === 'AETH' ? (userData?.tokenBalance || 0) : (userData?.ronTokens || 0)} {selectedToken}
                      </p>
                    </div>

                    {/* Fee Info & Realtime Calculation */}
                    {walletStep === 'withdraw' && (
                      <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
                        {selectedToken === 'AETH' ? (
                          <>
                            <p className="text-yellow-400 text-sm mb-2">⚠️ Withdrawal Fee: 5%</p>
                            {amountAfterFee !== null && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-white">
                                  <span>Amount:</span>
                                  <span>{parseFloat(amount).toFixed(2)} AETH</span>
                                </div>
                                <div className="flex justify-between text-red-400">
                                  <span>Fee (5%):</span>
                                  <span>-{(parseFloat(amount) * 0.05).toFixed(2)} AETH</span>
                                </div>
                                <div className="border-t border-yellow-500/30 pt-1 mt-1"></div>
                                <div className="flex justify-between text-green-400 font-bold text-lg">
                                  <span>You'll receive:</span>
                                  <span>{amountAfterFee.toFixed(2)} AETH</span>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-green-400 text-sm">✅ No withdrawal fee for RON</p>
                        )}
                      </div>
                    )}

                    {/* Confirm Button */}
                    <button
                      onClick={walletStep === 'deposit' ? handleDeposit : handleWithdraw}
                      disabled={walletLoading || !amount || parseFloat(amount) <= 0}
                      className={`w-full font-bold py-4 rounded-lg transition-all ${
                        walletStep === 'deposit'
                          ? 'bg-green-600 hover:bg-green-500 disabled:bg-gray-600'
                          : 'bg-red-600 hover:bg-red-500 disabled:bg-gray-600'
                      } text-white`}
                    >
                      {walletLoading ? '⏳ Processing...' : `Confirm ${walletStep === 'deposit' ? 'Deposit' : 'Withdraw'}`}
                    </button>
                  </div>
                )}
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

        {/* Transaction History */}
        {address && (
          <div className="max-w-4xl mx-auto mt-8">
            <TransactionHistory walletAddress={address} />
          </div>
        )}
      </div>
    </div>
  );
}
