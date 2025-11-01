'use client';

import { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  amount?: string;
  tokenType?: string;
  txHash?: string;
  type?: 'deposit' | 'withdraw' | 'convert' | 'claim';
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  amount,
  tokenType,
  txHash,
  type = 'deposit'
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'deposit':
        return '💰';
      case 'withdraw':
        return '💸';
      case 'convert':
        return '🔄';
      case 'claim':
        return '🎁';
      default:
        return '✅';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'deposit':
        return 'from-green-500 to-emerald-500';
      case 'withdraw':
        return 'from-blue-500 to-cyan-500';
      case 'convert':
        return 'from-purple-500 to-pink-500';
      case 'claim':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay with blur */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
      />

      {/* Modal */}
      <div className="relative z-10 animate-scaleIn">
        {/* Confetti/Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A8E6CF', '#FF8B94'][Math.floor(Math.random() * 5)],
                }}
              />
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-4 border-yellow-500/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden">
          {/* Glow Effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${getColor()} opacity-10 animate-pulse`} />

          {/* Success Icon with Animation */}
          <div className="relative text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-bounce-slow shadow-lg">
              <div className="text-6xl animate-wiggle">{getIcon()}</div>
            </div>
            {/* Ring Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-yellow-400/30 animate-ping" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 animate-shimmer">
            {title}
          </h2>

          {/* Message */}
          <p className="text-gray-300 text-center text-lg mb-6">
            {message}
          </p>

          {/* Amount Display */}
          {amount && (
            <div className="bg-black/50 border-2 border-yellow-500/30 rounded-xl p-4 mb-6 animate-slideUp">
              <p className="text-gray-400 text-sm text-center mb-2">Amount</p>
              <p className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                {amount} {tokenType || 'AETH'}
              </p>
            </div>
          )}

          {/* Transaction Hash */}
          {txHash && (
            <div className="bg-black/30 rounded-lg p-3 mb-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <p className="text-gray-400 text-xs mb-1">Transaction Hash</p>
              <p className="text-green-400 text-xs font-mono break-all">{txHash}</p>
              <a
                href={`https://saigon-app.roninchain.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs mt-2 inline-block"
              >
                View on Explorer →
              </a>
            </div>
          )}

          {/* Success Checkmark Animation */}
          <div className="flex justify-center mb-6">
            <svg className="w-16 h-16 animate-drawCheck" viewBox="0 0 52 52">
              <circle
                className="stroke-green-500 fill-none"
                cx="26"
                cy="26"
                r="25"
                strokeWidth="2"
                strokeDasharray="166"
                strokeDashoffset="166"
                style={{
                  animation: 'drawCircle 0.6s ease-out forwards',
                }}
              />
              <path
                className="stroke-green-500 fill-none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="48"
                strokeDashoffset="48"
                style={{
                  animation: 'drawCheck 0.3s 0.6s ease-out forwards',
                }}
              />
            </svg>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Awesome! 🎉
          </button>

          {/* Auto Close Timer */}
          <div className="mt-4">
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-shrink" />
            </div>
            <p className="text-gray-500 text-xs text-center mt-2">Auto-closing in 5 seconds...</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5) translateY(-50px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(720deg);
            opacity: 0;
          }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }

        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }

        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }

        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 2s linear infinite;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }

        .animate-shrink {
          animation: shrink 5s linear;
        }

        .animate-drawCheck {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
        }
      `}</style>
    </div>
  );
}
