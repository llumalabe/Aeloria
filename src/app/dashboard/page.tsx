'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { useGameState } from '@/hooks/useGameState';
import WalletButton from '@/components/WalletButton';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import CharacterCreationModal from '@/components/CharacterCreationModal';
import { API_URL } from '@/config/constants';

export default function Dashboard() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const { user, setUser, characters, setCharacters } = useGameState();
  const [isLoading, setIsLoading] = useState(true);
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    loadUserData();
  }, [isConnected, address]);

  const loadUserData = async () => {
    if (!address) return;

    try {
      setIsLoading(true);

      // Fetch or create user
      let response = await fetch(`${API_URL}/api/users/${address}`);
      
      if (response.status === 404) {
        // Register new user
        const username = `Player_${address.slice(2, 8)}`;
        response = await fetch(`${API_URL}/api/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address, username }),
        });
      }

      const userData = await response.json();
      if (userData.success) {
        setUser(userData.user);

        // Daily login reward
        await fetch(`${API_URL}/api/users/${address}/login`, {
          method: 'POST',
        });
      }

      // Load characters (will be from blockchain in production)
      // For now, mock data
      setCharacters([]);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMintCharacter = async (classId: number, className: string) => {
    try {
      // In production, this will call smart contract
      alert(`Minting ${className} character... (Feature in development)`);
      
      // Mock character creation
      const newCharacter = {
        id: Date.now(),
        class: className,
        level: 1,
        hp: 100,
        maxHp: 100,
      };
      
      setCharacters([...characters, newCharacter]);
    } catch (error) {
      console.error('Failed to mint character:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚔️</div>
          <p className="text-2xl text-amber-400 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b-4 border-amber-600 bg-slate-800/90 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-amber-400">⚔️ Aeloria</h1>
                <p className="text-xs text-amber-200">
                  {user?.username || 'Guardian'}
                </p>
              </div>
              <CurrencyDisplay />
            </div>
            <WalletButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8 bg-slate-800/50 border-2 border-amber-600/30 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-amber-400 mb-2">
            Welcome to the Town Hub, {user?.username}!
          </h2>
          <p className="text-amber-100/80">
            Your adventure awaits. Choose your path below.
          </p>
          {user && (
            <div className="mt-4 flex gap-4">
              <div className="bg-purple-900/30 px-4 py-2 rounded">
                <span className="text-purple-300">Login Streak:</span>{' '}
                <span className="text-purple-100 font-bold">{user.loginStreak} days 🔥</span>
              </div>
              <div className="bg-blue-900/30 px-4 py-2 rounded">
                <span className="text-blue-300">Player Level:</span>{' '}
                <span className="text-blue-100 font-bold">{user.level}</span>
              </div>
            </div>
          )}
        </section>

        {/* Main Actions Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Character Management */}
          <ActionCard
            icon="🎭"
            title="Characters"
            description="Manage your NFT characters"
            stats={`${characters.length} owned`}
            onClick={() => setShowCharacterModal(true)}
            gradient="from-purple-600 to-pink-600"
          />

          {/* Dungeon Exploration */}
          <ActionCard
            icon="🏰"
            title="Dungeon"
            description="Explore dangerous dungeons"
            stats="5 difficulties available"
            onClick={() => router.push('/dungeon')}
            gradient="from-red-600 to-orange-600"
          />

          {/* Marketplace */}
          <ActionCard
            icon="🏪"
            title="Marketplace"
            description="Trade NFT items"
            stats="Buy & Sell"
            onClick={() => router.push('/marketplace')}
            gradient="from-emerald-600 to-teal-600"
          />

          {/* PvP Arena */}
          <ActionCard
            icon="⚔️"
            title="PvP Arena"
            description="Battle other players"
            stats="Auto Battle"
            onClick={() => router.push('/pvp')}
            gradient="from-blue-600 to-cyan-600"
          />

          {/* Quests */}
          <ActionCard
            icon="📜"
            title="Quests"
            description="Complete daily quests"
            stats="Daily & Weekly"
            onClick={() => alert('Quests feature coming soon!')}
            gradient="from-yellow-600 to-amber-600"
          />

          {/* Guild */}
          <ActionCard
            icon="🛡️"
            title="Guild"
            description="Join or create a guild"
            stats="Social & Team"
            onClick={() => alert('Guild feature coming soon!')}
            gradient="from-indigo-600 to-purple-600"
          />

          {/* Gacha */}
          <ActionCard
            icon="🎲"
            title="Gacha"
            description="Summon rare items"
            stats="3 tiers available"
            onClick={() => router.push('/gacha')}
            gradient="from-pink-600 to-rose-600"
          />

          {/* Inventory */}
          <ActionCard
            icon="🎒"
            title="Inventory"
            description="View your items"
            stats={`${0} items`}
            onClick={() => alert('Inventory feature coming soon!')}
            gradient="from-slate-600 to-gray-600"
          />

          {/* Settings */}
          <ActionCard
            icon="⚙️"
            title="Settings"
            description="Account settings"
            stats="Profile & Config"
            onClick={() => alert('Settings feature coming soon!')}
            gradient="from-gray-600 to-slate-600"
          />
        </section>
      </div>

      {/* Character Creation Modal */}
      <CharacterCreationModal
        isOpen={showCharacterModal}
        onClose={() => setShowCharacterModal(false)}
        onMint={handleMintCharacter}
      />
    </main>
  );
}

interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  stats: string;
  onClick: () => void;
  gradient: string;
}

function ActionCard({ icon, title, description, stats, onClick, gradient }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-slate-800/50 backdrop-blur border-2 border-amber-600/30 rounded-lg p-6 
        hover:border-amber-500 transition-all transform hover:scale-105 hover:shadow-xl
        text-left group
      `}
    >
      <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-amber-400 mb-2">{title}</h3>
      <p className="text-amber-100/80 mb-3">{description}</p>
      <div className={`inline-block px-3 py-1 bg-gradient-to-r ${gradient} rounded text-sm font-bold`}>
        {stats}
      </div>
    </button>
  );
}
