'use client';

import { useState, useEffect } from 'react';

interface Transaction {
  type: 'deposit' | 'withdraw' | 'convert' | 'Daily Reward';
  tokenType?: 'AETH' | 'RON';
  amount: string;
  fee?: string;
  txHash?: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed' | 'Completed';
}

interface TransactionHistoryProps {
  walletAddress: string;
}

export default function TransactionHistory({ walletAddress }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdraw'>('all');
  const [tokenFilter, setTokenFilter] = useState<'all' | 'AETH' | 'RON'>('all');

  useEffect(() => {
    if (walletAddress) {
      fetchTransactions();
    }
  }, [walletAddress, filter, tokenFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);
      if (tokenFilter !== 'all') params.append('tokenType', tokenFilter);
      params.append('limit', '50');

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/${walletAddress}/transactions?${params}`;
      console.log('Fetching transactions from:', url);
      
      const res = await fetch(url);
      const data = await res.json();
      console.log('Transactions response:', data);

      // Handle both response formats: { success: true, transactions: [...] } or { transactions: [...] }
      if (data.transactions) {
        console.log('Setting transactions:', data.transactions.length, 'items');
        // Backend already sorts by timestamp descending (newest first)
        setTransactions(data.transactions);
      } else {
        console.warn('No transactions field in response:', data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-green-400';
      case 'withdraw': return 'text-red-400';
      case 'convert': return 'text-purple-400';
      case 'Daily Reward': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '📥';
      case 'withdraw': return '📤';
      case 'convert': return '🔄';
      case 'Daily Reward': return '🎁';
      default: return '💰';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      confirmed: 'bg-green-600',
      pending: 'bg-yellow-600',
      failed: 'bg-red-600',
      Completed: 'bg-green-600',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${colors[status as keyof typeof colors] || 'bg-gray-600'}`}>
        {status}
      </span>
    );
  };

  const openInExplorer = (txHash: string) => {
    window.open(`https://saigon-app.roninchain.com/tx/${txHash}`, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-black/40 rounded-lg p-6">
        <div className="text-center text-gray-400">Loading transaction history...</div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Transaction History</h3>
        <button
          onClick={fetchTransactions}
          className="text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Type</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="deposit">Deposits</option>
            <option value="withdraw">Withdrawals</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Token</label>
          <select
            value={tokenFilter}
            onChange={(e) => setTokenFilter(e.target.value as any)}
            className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="AETH">AETH 🔮</option>
            <option value="RON">RON 🔷</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <div className="text-4xl mb-2">📭</div>
          <p>No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {transactions.map((tx, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => tx.txHash && openInExplorer(tx.txHash)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{getTypeIcon(tx.type)}</span>
                    <span className={`font-bold ${getTypeColor(tx.type)} capitalize`}>
                      {tx.type}
                    </span>
                    {tx.tokenType && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-300">{tx.tokenType}</span>
                        {tx.tokenType === 'AETH' ? '🔮' : '🔷'}
                      </>
                    )}
                  </div>
                  
                  <div className="text-2xl font-bold text-white mb-2">
                    {parseFloat(tx.amount).toFixed(4)} {tx.tokenType || ''}
                  </div>

                  {tx.fee && parseFloat(tx.fee) > 0 && (
                    <div className="text-sm text-red-400 mb-1">
                      Fee: {parseFloat(tx.fee).toFixed(4)} {tx.tokenType}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{formatDate(tx.timestamp)}</span>
                    {tx.txHash && (
                      <>
                        <span>•</span>
                        <span className="font-mono">{tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(tx.status)}
                  {tx.txHash && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInExplorer(tx.txHash!);
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      View on Explorer →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {transactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-gray-400 mb-1">Total</div>
              <div className="text-white font-bold">{transactions.length}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Deposits</div>
              <div className="text-green-400 font-bold">
                {transactions.filter(tx => tx.type === 'deposit').length}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Withdrawals</div>
              <div className="text-red-400 font-bold">
                {transactions.filter(tx => tx.type === 'withdraw').length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
