'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

interface UserData {
  walletAddress: string;
  username: string;
  gold: number;
  premium: number;
  tokens: number;
  level: number;
  exp: number;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | null;
  blockchainBalances: { aethBalance: string; ronBalance: string };
  signer: ethers.Signer | null;
  provider: ethers.BrowserProvider | null;
  address: string | null;
  onDeposit: (amount: string) => Promise<void>;
  onConvert: (amount: string) => Promise<void>;
  onWithdraw: (amount: string) => Promise<void>;
}

export default function WalletModal({
  isOpen,
  onClose,
  userData,
  blockchainBalances,
  signer,
  provider,
  address,
  onDeposit,
  onConvert,
  onWithdraw
}: WalletModalProps) {
  const [step, setStep] = useState<'select' | 'deposit' | 'convert' | 'withdraw'>('select');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      if (step === 'deposit') await onDeposit(amount);
      else if (step === 'convert') await onConvert(amount);
      else if (step === 'withdraw') await onWithdraw(amount);
      
      setAmount('');
      setStep('select');
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl border-2 border-purple-500/50 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {step === 'select' ? '💰 Wallet' :
             step === 'deposit' ? '📥 Deposit RON' :
             step === 'convert' ? '🔄 Convert AETH' : '📤 Withdraw AETH'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'select' && (
            <div className="space-y-3">
              {/* Balances */}
              <div className="bg-black/30 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">In-Game AETH</span>
                  <span className="text-lg font-bold text-blue-400">{userData?.tokens || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Withdrawable AETH</span>
                  <span className="text-lg font-bold text-green-400">{parseFloat(blockchainBalances.aethBalance).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">RON Balance</span>
                  <span className="text-lg font-bold text-cyan-400">{parseFloat(blockchainBalances.ronBalance).toFixed(4)}</span>
                </div>
              </div>

              {/* Actions */}
              <button onClick={() => setStep('deposit')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-all">
                📥 Deposit RON
                <div className="text-xs opacity-75">For Shop purchases</div>
              </button>
              <button onClick={() => setStep('convert')} disabled={!userData?.tokens || userData.tokens <= 0} className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white font-bold py-4 rounded-lg transition-all">
                🔄 Convert AETH
                <div className="text-xs opacity-75">In-Game → Withdrawable</div>
              </button>
              <button onClick={() => setStep('withdraw')} disabled={parseFloat(blockchainBalances.aethBalance) <= 0} className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white font-bold py-4 rounded-lg transition-all">
                📤 Withdraw AETH
                <div className="text-xs opacity-75">To Ronin Wallet</div>
              </button>
            </div>
          )}

          {step !== 'select' && (
            <div className="space-y-4">
              {/* Info Box */}
              <div className={`rounded-lg p-3 text-sm ${
                step === 'deposit' ? 'bg-blue-900/20 border border-blue-500/30 text-blue-200' :
                step === 'convert' ? 'bg-purple-900/20 border border-purple-500/30 text-purple-200' :
                'bg-green-900/20 border border-green-500/30 text-green-200'
              }`}>
                {step === 'deposit' && `💰 Deposit RON to use in Shop`}
                {step === 'convert' && `🔄 Convert in-game AETH (${userData?.tokens || 0} available) to withdrawable`}
                {step === 'withdraw' && `📤 Withdraw AETH (${parseFloat(blockchainBalances.aethBalance).toFixed(2)} available) to wallet`}
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => { setStep('select'); setAmount(''); }} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg">
                  ← Back
                </button>
                <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg">
                  {loading ? '⏳ Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
