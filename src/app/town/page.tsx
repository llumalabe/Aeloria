'use client';

import { useWallet } from '@/hooks/useWallet';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import TransactionHistory from '@/components/TransactionHistory';
import WalletModal from '@/components/WalletModal';
import RonIcon from '@/components/RonIcon';
import SuccessModal from '@/components/SuccessModal';

export default function TownPage() {
  const { address, provider, signer, reconnect } = useWallet();
  const { userData, isLoading, refreshUserData } = useAuth();
  const router = useRouter();
  const [energy, setEnergy] = useState(30);
  const [maxEnergy, setMaxEnergy] = useState(30);
  const [showWallet, setShowWallet] = useState(false);
  
  // Success Modal state
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    amount?: string;
    tokenType?: string;
    txHash?: string;
    type: 'deposit' | 'withdraw' | 'convert' | 'claim';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'deposit'
  });
  
  // Blockchain balances with auto-refresh
  const [blockchainBalances, setBlockchainBalances] = useState({ aethBalance: '0', ronBalance: '0' });
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  
  // Wallet states
  const [walletStep, setWalletStep] = useState<'select-action' | 'deposit-select' | 'withdraw-select' | 'deposit' | 'deposit-aeth' | 'withdraw' | 'withdraw-ron'>('select-action');
  const [selectedToken, setSelectedToken] = useState<'AETH' | 'RON'>('AETH');
  const [amount, setAmount] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);
  const [amountAfterFee, setAmountAfterFee] = useState<number | null>(null);

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

  // Calculate withdrawal fee in real-time (only for AETH withdrawal)
  useEffect(() => {
    if (walletStep === 'withdraw' && amount) {
      const amountNum = parseFloat(amount);
      if (!isNaN(amountNum) && amountNum > 0) {
        setAmountAfterFee(amountNum * 0.95); // 5% fee for AETH
      } else {
        setAmountAfterFee(null);
      }
    } else {
      setAmountAfterFee(null);
    }
  }, [walletStep, amount]);

  // Auto-refresh balances every 10 seconds
  useEffect(() => {
    if (address && provider && signer) {
      fetchEnergy();
      fetchBlockchainBalances();
      
      const interval = setInterval(() => {
        fetchBlockchainBalances();
      }, 10000); // 10 seconds

      return () => clearInterval(interval);
    }
  }, [address, provider, signer]);

  const fetchBlockchainBalances = useCallback(async () => {
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
      setLastRefresh(Date.now());
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    }
  }, [address, provider]);

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

    setWalletLoading(true);
    try {
      const { ethers } = await import('ethers');
      const WalletManagerABI = (await import('@/lib/abis/WalletManager.json')).default;
      const { CONTRACTS } = await import('@/config/contracts');
      
      // Deposit RON only
      const walletManager = new ethers.Contract(CONTRACTS.WALLET_MANAGER, WalletManagerABI.abi, signer);
      const amountWei = ethers.parseEther(amount);
      
      const depositTx = await walletManager.depositRon({ value: amountWei });
      const receipt = await depositTx.wait();
      const txHash: string = receipt.hash;

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
            // Show success modal
            setSuccessModal({
              isOpen: true,
              title: 'Deposit Successful!',
              message: 'Your RON has been deposited to the game',
              amount: amount,
              tokenType: 'RON',
              txHash: txHash,
              type: 'deposit'
            });
            
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

  const handleDepositAeth = async () => {
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
      const AethTokenABI = (await import('@/lib/abis/AeloriaToken.json')).default;
      const WalletManagerABI = (await import('@/lib/abis/WalletManager.json')).default;
      const { CONTRACTS } = await import('@/config/contracts');
      
      const aethToken = new ethers.Contract(CONTRACTS.AETH_TOKEN, AethTokenABI.abi, signer);
      const walletManager = new ethers.Contract(CONTRACTS.WALLET_MANAGER, WalletManagerABI.abi, signer);
      const amountWei = ethers.parseEther(amount);

      // Step 1: Check wallet balance
      const walletBalance = await aethToken.balanceOf(address);
      if (walletBalance < amountWei) {
        alert(`❌ Insufficient AETH in wallet!\n\nYou have: ${ethers.formatEther(walletBalance)} AETH\nNeed: ${amount} AETH`);
        setWalletLoading(false);
        return;
      }

      // Step 2: Check allowance
      const currentAllowance = await aethToken.allowance(address, CONTRACTS.WALLET_MANAGER);
      
      if (currentAllowance < amountWei) {
        // Silently approve - user will see wallet confirmation
        const approveTx = await aethToken.approve(CONTRACTS.WALLET_MANAGER, amountWei);
        await approveTx.wait();
      }

      // Step 3: Deposit to WalletManager
      const depositTx = await walletManager.depositAeth(amountWei);
      const receipt = await depositTx.wait();
      const txHash: string = receipt.hash;

      if (txHash) {
        // Show success modal
        setSuccessModal({
          isOpen: true,
          title: 'AETH Deposit Successful!',
          message: 'Your AETH has been deposited. You can now withdraw or use it in-game!',
          amount: amount,
          tokenType: 'AETH',
          txHash: txHash,
          type: 'deposit'
        });
        
        // Refresh balances
        await fetchBlockchainBalances();
        await refreshUserData();
        
        setAmount('');
        setWalletStep('select-action');
      }
    } catch (error: any) {
      console.error('❌ Deposit AETH error:', error);
      
      let errorMessage = '';
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction was rejected by user';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient RON for gas fees';
      } else {
        errorMessage = error.message || 'Unknown error';
      }
      
      alert(`❌ Deposit failed: ${errorMessage}`);
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
              ? ` (Fee: ${backendData.fee} AETH)`
              : '';
            
            // Show success modal
            setSuccessModal({
              isOpen: true,
              title: 'Withdrawal Successful!',
              message: `Your AETH has been withdrawn to your wallet${feeMsg}`,
              amount: amount,
              tokenType: 'AETH',
              txHash: txHash,
              type: 'withdraw'
            });
            
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

  const handleWithdrawRon = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!signer || !address) {
      alert('Please connect your Ronin Wallet first');
      return;
    }

    // Check if user has enough RON on-chain
    const onChainBalance = parseFloat(blockchainBalances.ronBalance);
    
    if (onChainBalance < parseFloat(amount)) {
      alert(`❌ Insufficient RON!\n\nYou have ${onChainBalance.toFixed(4)} RON deposited.\nYou need to deposit first.`);
      return;
    }

    setWalletLoading(true);
    try {
      const { ethers } = await import('ethers');
      const WalletManagerABI = (await import('@/lib/abis/WalletManager.json')).default;
      const { CONTRACTS } = await import('@/config/contracts');

      const walletManager = new ethers.Contract(CONTRACTS.WALLET_MANAGER, WalletManagerABI.abi, signer);
      const amountWei = ethers.parseEther(amount);
      
      console.log('🔹 Withdrawing RON:', amount);
      const withdrawTx = await walletManager.withdrawRon(amountWei);
      console.log('🔹 TX sent:', withdrawTx.hash);
      const receipt = await withdrawTx.wait();
      console.log('🔹 TX confirmed:', receipt);

      // Show success modal
      setSuccessModal({
        isOpen: true,
        title: 'RON Withdrawal Successful!',
        message: 'Your RON has been withdrawn to your wallet (No fees!)',
        amount: amount,
        tokenType: 'RON',
        txHash: receipt.hash,
        type: 'withdraw'
      });

      setAmount('');
      setWalletStep('select-action');

      // Refresh balances
      await fetchBlockchainBalances();
      await refreshUserData();
    } catch (error: any) {
      console.error('❌ Withdraw RON error:', error);
      
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

  // Wrapper functions for WalletModal
  const handleModalDeposit = async (modalAmount: string) => {
    setAmount(modalAmount);
    await handleDeposit();
  };

  const handleModalConvert = async (modalAmount: string) => {
    setAmount(modalAmount);
    await handleConvert();
  };

  const handleModalWithdraw = async (modalAmount: string) => {
    setAmount(modalAmount);
    await handleWithdraw();
  };

  if (!address) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center lg:pl-64">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <p className="text-xl text-gray-300">Loading your town...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black lg:pl-64">
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
            <div className="grid grid-cols-2 gap-4 mb-4">
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
                          <div className="text-xs text-gray-400">� AETH Balance</div>
                          <div className="text-2xl font-bold text-cyan-400">{parseFloat(blockchainBalances.aethBalance).toFixed(2)} AETH</div>
                          <div className="text-xs text-gray-500 mt-1">Deposit & withdraw anytime</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <RonIcon size={12} /> RON Balance
                          </div>
                          <div className="text-2xl font-bold text-blue-400">{parseFloat(blockchainBalances.ronBalance).toFixed(4)} RON</div>
                          <div className="text-xs text-gray-500 mt-1">For gas fees & Shop purchases</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-blue-400 bg-blue-900/20 rounded p-2">
                        ℹ️ Deposit tokens to use in-game, withdraw anytime to your Ronin wallet
                      </div>
                    </>
                  )}
                </div>

                {/* Step 1: Select Action */}
                {walletStep === 'select-action' && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white mb-4">💰 Wallet</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setWalletStep('deposit-select')}
                        disabled={!signer || !provider}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all"
                      >
                        � Deposit
                      </button>
                      <button
                        onClick={() => setWalletStep('withdraw-select')}
                        disabled={!signer || !provider}
                        className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all"
                      >
                        � Withdraw
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2a: Select Token for Deposit */}
                {walletStep === 'deposit-select' && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white mb-2">📥 Deposit</h3>
                    <p className="text-sm text-gray-400 mb-4">Select token to deposit</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setWalletStep('deposit-aeth');
                          setSelectedToken('AETH');
                        }}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-6 rounded-lg transition-all flex flex-col items-center justify-center"
                      >
                        <div className="text-4xl mb-2">💎</div>
                        <div className="text-lg">AETH</div>
                      </button>
                      <button
                        onClick={() => {
                          setWalletStep('deposit');
                          setSelectedToken('RON');
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 rounded-lg transition-all flex flex-col items-center justify-center"
                      >
                        <div className="mb-2"><RonIcon size={40} /></div>
                        <div className="text-lg">RON</div>
                      </button>
                    </div>

                    <button
                      onClick={() => setWalletStep('select-action')}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition-all mt-2"
                    >
                      ← Back
                    </button>
                  </div>
                )}

                {/* Step 2b: Select Token for Withdraw */}
                {walletStep === 'withdraw-select' && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white mb-2">📤 Withdraw</h3>
                    <p className="text-sm text-gray-400 mb-4">Select token to withdraw</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setWalletStep('withdraw');
                          setSelectedToken('AETH');
                        }}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-6 rounded-lg transition-all flex flex-col items-center justify-center"
                      >
                        <div className="text-4xl mb-2">💎</div>
                        <div className="text-lg">AETH</div>
                        <div className="text-xs text-yellow-300 mt-1">5% fee</div>
                      </button>
                      <button
                        onClick={() => {
                          setWalletStep('withdraw-ron');
                          setSelectedToken('RON');
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 rounded-lg transition-all flex flex-col items-center justify-center"
                      >
                        <div className="mb-2"><RonIcon size={40} /></div>
                        <div className="text-lg">RON</div>
                        <div className="text-xs text-green-300 mt-1">No fee</div>
                      </button>
                    </div>

                    <button
                      onClick={() => setWalletStep('select-action')}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition-all mt-2"
                    >
                      ← Back
                    </button>
                  </div>
                )}

                {/* Step 3: Deposit/Withdraw Form */}
                {(walletStep === 'deposit' || walletStep === 'deposit-aeth' || walletStep === 'withdraw' || walletStep === 'withdraw-ron') && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">
                        {walletStep === 'deposit' ? '📥 Deposit RON' : 
                         walletStep === 'deposit-aeth' ? '💎 Deposit AETH' :
                         walletStep === 'withdraw-ron' ? '� Withdraw RON' : 
                         '� Withdraw AETH'}
                      </h3>
                      <button
                        onClick={() => {
                          // Back to token selection
                          if (walletStep === 'deposit' || walletStep === 'deposit-aeth') {
                            setWalletStep('deposit-select');
                          } else {
                            setWalletStep('withdraw-select');
                          }
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

                    {walletStep === 'deposit-aeth' && (
                      <div className="bg-cyan-900/20 border border-cyan-500/30 rounded p-3 text-sm text-cyan-200">
                        💎 Deposit AETH from your wallet into the game
                      </div>
                    )}

                    {walletStep === 'withdraw' && (
                      <div className="bg-green-900/20 border border-green-500/30 rounded p-3 text-sm text-green-200">
                        � Withdraw AETH from game to your Ronin wallet (5% fee)
                        <div className="mt-2 text-xs">
                          Available: <span className="font-bold">{parseFloat(blockchainBalances.aethBalance).toFixed(2)} AETH</span>
                        </div>
                      </div>
                    )}

                    {walletStep === 'withdraw-ron' && (
                      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-3 text-sm text-yellow-200">
                        � Withdraw RON from game to your Ronin wallet (No fee)
                        <div className="mt-2 text-xs">
                          Available: <span className="font-bold">{parseFloat(blockchainBalances.ronBalance).toFixed(4)} RON</span>
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

                    {/* Fee Info (only for AETH withdrawal) */}
                    {walletStep === 'withdraw' && (
                      <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
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
                      </div>
                    )}

                    {walletStep === 'withdraw-ron' && (
                      <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                        <p className="text-green-400 text-sm">✅ No withdrawal fee for RON</p>
                      </div>
                    )}

                    {/* Confirm Button */}
                    <button
                      onClick={
                        walletStep === 'deposit' ? handleDeposit : 
                        walletStep === 'deposit-aeth' ? handleDepositAeth :
                        walletStep === 'withdraw-ron' ? handleWithdrawRon : 
                        handleWithdraw
                      }
                      disabled={walletLoading || !amount || parseFloat(amount) <= 0}
                      className={`w-full font-bold py-4 rounded-lg transition-all ${
                        walletStep === 'deposit'
                          ? 'bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600'
                          : walletStep === 'deposit-aeth'
                          ? 'bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600'
                          : walletStep === 'withdraw-ron'
                          ? 'bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600'
                          : 'bg-green-600 hover:bg-green-500 disabled:bg-gray-600'
                      } text-white`}
                    >
                      {walletLoading ? '⏳ Processing...' : 
                       `Confirm ${
                         walletStep === 'deposit' ? 'Deposit RON' : 
                         walletStep === 'deposit-aeth' ? 'Deposit AETH' :
                         walletStep === 'withdraw-ron' ? 'Withdraw RON' : 
                         'Withdraw AETH'
                       }`}
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

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        title={successModal.title}
        message={successModal.message}
        amount={successModal.amount}
        tokenType={successModal.tokenType}
        txHash={successModal.txHash}
        type={successModal.type}
      />
    </div>
  );
}
