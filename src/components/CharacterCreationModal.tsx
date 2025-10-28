'use client';

import { useState } from 'react';
import { CHARACTER_CLASSES } from '@/config/constants';

interface CharacterCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMint: (classId: number, className: string) => Promise<void>;
}

export default function CharacterCreationModal({
  isOpen,
  onClose,
  onMint,
}: CharacterCreationModalProps) {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  if (!isOpen) return null;

  const handleMint = async () => {
    if (selectedClass === null) {
      alert('Please select a character class');
      return;
    }

    setIsMinting(true);
    try {
      const className = CHARACTER_CLASSES[selectedClass].name;
      await onMint(selectedClass, className);
      onClose();
    } catch (error) {
      console.error('Minting failed:', error);
      alert('Failed to mint character');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-amber-600 rounded-lg max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-4xl font-bold text-amber-400 mb-6 text-center">
          Create Your Character
        </h2>
        <p className="text-amber-100 text-center mb-8">
          Choose your class wisely. Each class has unique stats and abilities!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {CHARACTER_CLASSES.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              className={`
                p-6 rounded-lg border-2 transition-all transform hover:scale-105
                ${
                  selectedClass === cls.id
                    ? 'border-amber-500 bg-amber-900/30 shadow-lg shadow-amber-500/50'
                    : 'border-slate-600 bg-slate-800/50 hover:border-amber-600'
                }
              `}
            >
              <div className="text-5xl mb-2">{cls.icon}</div>
              <h3 className="text-xl font-bold text-amber-400 mb-2">{cls.name}</h3>
              <p className="text-sm text-amber-100/80">{cls.description}</p>
            </button>
          ))}
        </div>

        {selectedClass !== null && (
          <div className="bg-slate-800/50 border-2 border-purple-500/50 rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">
              {CHARACTER_CLASSES[selectedClass].name} Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatDisplay label="STR" value={getBaseStat(selectedClass, 'str')} />
              <StatDisplay label="AGI" value={getBaseStat(selectedClass, 'agi')} />
              <StatDisplay label="INT" value={getBaseStat(selectedClass, 'int')} />
              <StatDisplay label="LUK" value={getBaseStat(selectedClass, 'luk')} />
              <StatDisplay label="VIT" value={getBaseStat(selectedClass, 'vit')} />
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-all"
            disabled={isMinting}
          >
            Cancel
          </button>
          <button
            onClick={handleMint}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-bold shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedClass === null || isMinting}
          >
            {isMinting ? 'Minting...' : 'Mint Character (Free)'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatDisplay({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-900/50 p-3 rounded text-center">
      <p className="text-xs text-amber-300 mb-1">{label}</p>
      <p className="text-2xl font-bold text-amber-100">{value}</p>
    </div>
  );
}

function getBaseStat(classId: number, stat: string): number {
  const stats: Record<number, Record<string, number>> = {
    0: { str: 15, agi: 8, int: 5, luk: 7, vit: 12 }, // Warrior
    1: { str: 5, agi: 7, int: 18, luk: 10, vit: 6 }, // Mage
    2: { str: 8, agi: 16, int: 7, luk: 12, vit: 8 }, // Archer
    3: { str: 10, agi: 17, int: 6, luk: 15, vit: 7 }, // Rogue
    4: { str: 6, agi: 8, int: 15, luk: 9, vit: 11 }, // Cleric
    5: { str: 12, agi: 9, int: 10, luk: 8, vit: 13 }, // Paladin
  };
  return stats[classId][stat] || 0;
}
