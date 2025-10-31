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
  
  // Blockchain balances
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

  // Reconnect wallet on page load if address exists but no provider/signer
  useEffect(() => {
    const initWallet = async () => {
      if (address && (!provider || !signer)) {
        try {
          await reconnect();
          console.log('✅ Wallet reconnected');
        } catch (error) {
          console.error('Failed to reconnect wallet:', error);
        }
      }
    };
    initWallet();
  }, [address, provider, signer, reconnect]);

  // Fetch energy and balances when wallet is ready
  useEffect(() => {
    if (address && provider && signer) {
      fetchEnergy();
      fetchBlockchainBalances();
    }
  }, [address, provider, signer]);

  const fetchBlockchainBalances = async () => {
    if (!address || !provider) {
      console.log('❌ Cannot fetch balances - missing address or provider:', { address, provider: !!provider });
      return;
    }

    console.log('🔍 Fetching blockchain balances for:', address);

    try {
      const { ethers } = await import('ethers');
      const WalletManagerABI = (await import('@/lib/abis/WalletManager.json')).default;
      const { CONTRACTS } = await import('@/config/contracts');

      console.log('📍 WalletManager address:', CONTRACTS.WALLET_MANAGER);

      // Get AETH deposit in WalletManager (not wallet balance)
      let aethBalance = '0';
      try {
        const walletManager = new ethers.Contract(CONTRACTS.WALLET_MANAGER, WalletManagerABI.abi, provider);
        const deposit = await walletManager.aethDeposits(address);
        aethBalance = ethers.formatEther(deposit || 0);
        console.log('✅ AETH deposit:', aethBalance);
      } catch (error) {
        console.warn('Failed to fetch AETH deposit, defaulting to 0:', error);
        aethBalance = '0';
      }

      // Get RON deposit in WalletManager (not wallet balance)
      let ronBalance = '0';
      try {
        const walletManager = new ethers.Contract(CONTRACTS.WALLET_MANAGER, WalletManagerABI.abi, provider);
        const deposit = await walletManager.ronDeposits(address);
        ronBalance = ethers.formatEther(deposit || 0);
        console.log('✅ RON deposit:', ronBalance);
      } catch (error) {
        console.warn('Failed to fetch RON deposit, defaulting to 0:', error);
        ronBalance = '0';
      }

      console.log('💰 Setting balances:', { aethBalance, ronBalance });
      setBlockchainBalances({
        aethBalance,
        ronBalance
      });
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    }
  };  const fetchEnergy = async () => {
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

    setWalletLoading(true);
    try {
      const { ethers } = await import('ethers');
      const WalletManagerABI = (await import('@/lib/abis/WalletManager.json')).default;
      const { CONTRACTS } = await import('@/config/contracts');
      
      let txHash: string;
      
      // Deposit RON only
      const walletManager = new ethers.Contract(CONTRACTS.WALLET_MANAGER, WalletManagerABI.abi, signer);
      const amountWei = ethers.parseEther(amount);
      
      const depositTx = await walletManager.depositRon({ value: amountWei });
      const receipt = await depositTx.wait();
      const txHash = receipt.hash;

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
                tokenType: 'RON',
                amount: parseFloat(amount),
              }),
            }
          );

          const backendData = await backendRes.json();

          if (backendData.success) {
            alert(`✅ Deposit successful!\nAmount: ${amount} RON\nTransaction: ${txHash}`);
            
            // Refresh balances immediately
            await fetchBlockchainBalances();
            await refreshUserData();
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

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!signer || !address) {
      alert('Please connect your Ronin Wallet first');
      return;
    }

    // Check if user has enough in-game AETH
    const inGameBalance = userData?.tokens || 0;
    if (inGameBalance < parseFloat(amount)) {
      alert(`❌ Insufficient in-game AETH!\n\nYou have ${inGameBalance} AETH in-game.\nYou need more to convert.`);
      return;
    }

    setWalletLoading(true);
    try {
      const { ethers } = await import('ethers');
      const WalletManagerABI = (await import('@/lib/abis/WalletManager.json')).default;
      const AeloriaTokenABI = (await import('@/lib/abis/AeloriaToken.json')).default;
      const { CONTRACTS } = await import('@/config/contracts');

      // First, deduct from in-game balance via backend
      const backendRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${address}/wallet/convert`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: parseFloat(amount),
          }),
        }
      );

      const backendData = await backendRes.json();

      if (!backendData.success) {
        alert(`❌ Conversion failed: ${backendData.error}`);
        setWalletLoading(false);
        return;
      }

      // Then deposit to WalletManager using owner's AETH
      const aethContract = new ethers.Contract(CONTRACTS.AETH_TOKEN, AeloriaTokenABI.abi, signer);
      const walletManager = new ethers.Contract(CONTRACTS.WALLET_MANAGER, WalletManagerABI.abi, signer);
      
      const amountWei = ethers.parseEther(amount);
      
      // Approve
      const approveTx = await aethContract.approve(CONTRACTS.WALLET_MANAGER, amountWei);
      await approveTx.wait();
      
      // Deposit
      const depositTx = await walletManager.depositAeth(amountWei);
      const receipt = await depositTx.wait();
      const txHash = receipt.hash;

      alert(`✅ Conversion successful!\n\nConverted ${amount} AETH from in-game to withdrawable.\n\nTransaction: ${txHash}`);

      setAmount('');
      setWalletStep('select-action');

      // Refresh balances
      await fetchBlockchainBalances();
      await refreshUserData();
    } catch (error: any) {
      console.error('Convert error:', error);
      alert(`❌ Conversion failed: ${error.message || 'Unknown error'}\n\nYour in-game AETH was not deducted.`);
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

    // Check if user has enough AETH on-chain
    const onChainBalance = parseFloat(blockchainBalances.aethBalance);
    
    if (onChainBalance < parseFloat(amount)) {
      alert(`❌ Insufficient AETH!\n\nYou have ${onChainBalance.toFixed(4)} AETH mined.\nYou can only withdraw what you've mined.`);
      return;
    }

    setWalletLoading(true);
    try {
      const { ethers } = await import('ethers');
      const WalletManagerABI = (await import('@/lib/abis/WalletManager.json')).default;
      const { CONTRACTS } = await import('@/config/contracts');

      const walletManager = new ethers.Contract(CONTRACTS.WALLET_MANAGER, WalletManagerABI.abi, signer);
      const amountWei = ethers.parseEther(amount);
      
      console.log('🔹 Withdrawing AETH:', amount);
      const withdrawTx = await walletManager.withdrawAeth(amountWei);
      console.log('🔹 TX sent:', withdrawTx.hash);
      const receipt = await withdrawTx.wait();
      console.log('🔹 TX confirmed:', receipt);
      const txHash = receipt.hash;

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
                tokenType: 'AETH',
                amount: parseFloat(amount),
              }),
            }
          );

          const backendData = await backendRes.json();

          if (backendData.success) {
            const feeMsg = backendData.fee && parseFloat(backendData.fee) > 0 
              ? `\nFee: ${backendData.fee} AETH`
              : '';
            alert(`✅ Withdrawal successful!\nAmount: ${amount} AETH${feeMsg}\nTransaction: ${txHash}`);
            
            // Refresh balances immediately
            await fetchBlockchainBalances();
            await refreshUserData();
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
      console.error('❌ Withdraw error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        data: error.data,
        reason: error.reason
      });
      
      let errorMessage = '';
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction was rejected by user';
      } else if (error.message?.includes('Insufficient balance')) {
        errorMessage = 'Insufficient balance in WalletManager contract';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient RON for gas fees';
      } else {
        errorMessage = error.message || 'Unknown error';
      }
      
      alert(`❌ Withdrawal failed: ${errorMessage}`);
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
                <div className="text-2xl font-bold text-blue-400">{userData?.tokens || 0}</div>
                <div className="text-xs text-gray-400">AETH (Mined)</div>
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
                      <div className={`w-3 h-3 rounded-full ${(!!signer && !!provider) ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm text-gray-400">
                        {(!!signer && !!provider) ? '🔗 Connected to Ronin' : '⚠️ Not Connected'}
                      </span>
                    </div>
                  </div>
                  
                  {(!!signer && !!provider) && (
                    <>
                      <div className="mt-3 bg-black/30 rounded p-4 space-y-3">
                        <div className="border-b border-gray-600 pb-3">
                          <div className="text-xs text-gray-400">🔮 In-Game AETH</div>
                          <div className="text-2xl font-bold text-blue-400">{userData?.tokens || 0} AETH</div>
                          <div className="text-xs text-gray-500 mt-1">Use for minting characters & in-game purchases</div>
                        </div>
                        <div className="border-b border-gray-600 pb-3">
                          <div className="text-xs text-gray-400">💎 Withdrawable AETH</div>
                          <div className="text-2xl font-bold text-green-400">{parseFloat(blockchainBalances.aethBalance).toFixed(2)} AETH</div>
                          <div className="text-xs text-gray-500 mt-1">Can be withdrawn to your wallet</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">💰 RON Balance</div>
                          <div className="text-2xl font-bold text-cyan-400">{parseFloat(blockchainBalances.ronBalance).toFixed(4)} RON</div>
                          <div className="text-xs text-gray-500 mt-1">Deposit to buy packs in Shop</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-yellow-400 bg-yellow-900/20 rounded p-2">
                        ℹ️ <strong>In-Game AETH</strong> for minting. <strong>Withdrawable AETH</strong> can be sent to wallet. <strong>RON</strong> for Shop purchases.
                      </div>
                    </>
                  )}
                </div>

                {/* Step 1: Select Action */}
                {walletStep === 'select-action' && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white mb-4">💰 Wallet</h3>
                    <button
                      onClick={() => setWalletStep('deposit')}
                      disabled={!signer || !provider}
                      className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all"
                    >
                      📥 Deposit RON (For Shop)
                    </button>
                    <button
                      onClick={() => setWalletStep('convert')}
                      disabled={!signer || !provider || !userData?.tokens || userData.tokens <= 0}
                      className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all"
                    >
                      🔄 Convert to Withdrawable AETH
                    </button>
                    <button
                      onClick={() => setWalletStep('withdraw')}
                      disabled={!signer || !provider}
                      className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all"
                    >
                      📤 Withdraw AETH (To Ronin Wallet)
                    </button>
                  </div>
                )}

                {/* Step 2 & 3: Deposit/Withdraw/Convert Form */}
                {(walletStep === 'deposit' || walletStep === 'withdraw' || walletStep === 'convert') && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">
                        {walletStep === 'deposit' ? '📥 Deposit RON' : walletStep === 'convert' ? '🔄 Convert AETH' : '📤 Withdraw AETH'}
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

                    {walletStep === 'deposit' && (
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3 text-sm text-blue-200">
                        💰 Deposit RON to use in Shop for buying packs and items
                      </div>
                    )}

                    {walletStep === 'convert' && (
                      <div className="bg-purple-900/20 border border-purple-500/30 rounded p-3 text-sm text-purple-200">
                        🔄 Convert in-game AETH to withdrawable AETH (deposits to smart contract)
                        <div className="mt-2 text-xs">
                          Available: <span className="font-bold">{userData?.tokens || 0} AETH</span>
                        </div>
                      </div>
                    )}

                    {walletStep === 'withdraw' && (
                      <div className="bg-green-900/20 border border-green-500/30 rounded p-3 text-sm text-green-200">
                        🔮 Withdraw your AETH to your Ronin wallet
                        <div className="mt-2 text-xs">
                          Available: <span className="font-bold">{parseFloat(blockchainBalances.aethBalance).toFixed(2)} AETH</span>
                        </div>
                      </div>
                    )}

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
                      onClick={walletStep === 'deposit' ? handleDeposit : walletStep === 'convert' ? handleConvert : handleWithdraw}
                      disabled={walletLoading || !amount || parseFloat(amount) <= 0}
                      className={`w-full font-bold py-4 rounded-lg transition-all ${
                        walletStep === 'deposit'
                          ? 'bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600'
                          : walletStep === 'convert'
                          ? 'bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600'
                          : 'bg-green-600 hover:bg-green-500 disabled:bg-gray-600'
                      } text-white`}
                    >
                      {walletLoading ? '⏳ Processing...' : `Confirm ${walletStep === 'deposit' ? 'Deposit' : walletStep === 'convert' ? 'Convert' : 'Withdraw'}`}
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
