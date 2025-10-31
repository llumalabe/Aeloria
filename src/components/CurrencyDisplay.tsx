'use client';

import { useGameState } from '@/hooks/useGameState';
import RonIcon from './RonIcon';

export default function CurrencyDisplay() {
  const { user } = useGameState();

  if (!user) return null;

  return (
    <div className="flex gap-4 items-center bg-slate-800/80 px-6 py-3 rounded-lg border-2 border-amber-600/30">
      <div className="flex items-center gap-2">
        <span className="text-2xl">💰</span>
        <div>
          <p className="text-xs text-amber-300">Gold</p>
          <p className="text-lg font-bold text-amber-100">{user.gold.toLocaleString()}</p>
        </div>
      </div>

      <div className="w-px h-10 bg-amber-600/30"></div>

      <div className="flex items-center gap-2">
        <span className="text-2xl">💎</span>
        <div>
          <p className="text-xs text-purple-300">Premium</p>
          <p className="text-lg font-bold text-purple-100">{user.premium.toLocaleString()}</p>
        </div>
      </div>

      <div className="w-px h-10 bg-amber-600/30"></div>

      <div className="flex items-center gap-2">
        <span className="text-2xl">🪙</span>
        <div>
          <p className="text-xs text-emerald-300">AETH</p>
          <p className="text-lg font-bold text-emerald-100">{user.tokens.toLocaleString()}</p>
        </div>
      </div>

      <div className="w-px h-10 bg-amber-600/30"></div>

      <div className="flex items-center gap-2">
        <span className="text-2xl">⭐</span>
        <div>
          <p className="text-xs text-blue-300">Level</p>
          <p className="text-lg font-bold text-blue-100">{user.level}</p>
        </div>
      </div>
    </div>
  );
}
