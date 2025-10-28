'use client';

import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isConnected, connect } = useWallet();

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  const handleConnect = async () => {
    try {
      await connect();
      router.push('/dashboard');
    } catch (error) {
      alert('Please install Ronin Wallet extension to continue');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b-4 border-amber-600 bg-slate-800/90 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-amber-400 drop-shadow-lg">
                ⚔️ Aeloria
              </h1>
              <p className="text-sm text-amber-200">Guardians of the Eternal Sigils</p>
            </div>
            <button
              onClick={handleConnect}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Connect Ronin Wallet
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent animate-pulse">
            Welcome to Aeloria
          </h2>
          <p className="text-xl text-amber-100 mb-8 leading-relaxed">
            Embark on an epic Web3 fantasy adventure on Ronin Network. 
            Mint NFT characters, explore mysterious dungeons, battle fearsome bosses, 
            and earn legendary rewards!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={handleConnect}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-bold shadow-xl transition-all transform hover:scale-105"
            >
              🎮 Start Adventure
            </button>
            <button
              onClick={() => window.open('https://docs.roninchain.com', '_blank')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg font-bold shadow-xl transition-all transform hover:scale-105"
            >
              📖 Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-4xl font-bold text-center mb-12 text-amber-400">
          🎮 Game Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur border-2 border-amber-600/30 rounded-lg p-6 hover:border-amber-500 transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-xl font-bold text-amber-400 mb-2">
                {feature.title}
              </h4>
              <p className="text-amber-100/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Character Classes */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-4xl font-bold text-center mb-12 text-amber-400">
          ⚔️ Choose Your Class
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800 to-purple-900/30 border-2 border-purple-500/50 rounded-lg p-6 hover:border-purple-400 transition-all transform hover:scale-105"
            >
              <div className="text-5xl mb-4 text-center">{cls.icon}</div>
              <h4 className="text-2xl font-bold text-amber-400 mb-2 text-center">
                {cls.name}
              </h4>
              <p className="text-amber-100/80 mb-4 text-center">{cls.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between bg-slate-900/50 px-3 py-2 rounded">
                  <span>STR:</span>
                  <span className="text-amber-400 font-bold">{cls.stats.str}</span>
                </div>
                <div className="flex justify-between bg-slate-900/50 px-3 py-2 rounded">
                  <span>AGI:</span>
                  <span className="text-amber-400 font-bold">{cls.stats.agi}</span>
                </div>
                <div className="flex justify-between bg-slate-900/50 px-3 py-2 rounded">
                  <span>INT:</span>
                  <span className="text-amber-400 font-bold">{cls.stats.int}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-4 border-amber-600 rounded-lg p-12">
          <h3 className="text-4xl font-bold text-amber-400 mb-4">
            Ready to Begin Your Journey?
          </h3>
          <p className="text-xl text-amber-100 mb-8">
            Connect your Ronin Wallet and start your adventure in Aeloria today!
          </p>
          <button
            onClick={handleConnect}
            className="px-12 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg font-bold text-xl shadow-xl transition-all transform hover:scale-110"
          >
            🚀 Connect Wallet & Play
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-amber-600 bg-slate-800/90 backdrop-blur mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-amber-200 mb-2">
            © 2025 Aeloria: Guardians of the Eternal Sigils
          </p>
          <p className="text-amber-300/60 text-sm">
            Built on Ronin Network • Powered by Web3
          </p>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: "🎭",
    title: "NFT Characters",
    description: "Mint unique characters with 6 different classes, each with special abilities and stats."
  },
  {
    icon: "🏰",
    title: "Dungeon Exploration",
    description: "Navigate through procedurally generated dungeons with random events and encounters."
  },
  {
    icon: "⚔️",
    title: "Boss Battles",
    description: "Challenge epic bosses and earn legendary NFT items and rewards."
  },
  {
    icon: "📊",
    title: "Stats System",
    description: "Deep character progression with STR, AGI, INT, LUK, and VIT attributes."
  },
  {
    icon: "🛡️",
    title: "Equipment & Enchants",
    description: "Collect weapons, armor, and accessories. Upgrade them to max power."
  },
  {
    icon: "💰",
    title: "3-Tier Economy",
    description: "Gold, Premium currency, and blockchain tokens for complete economic control."
  },
  {
    icon: "🏛️",
    title: "Town Hub",
    description: "Visit shops, guild halls, and marketplace in the central town."
  },
  {
    icon: "🎯",
    title: "Quests & Achievements",
    description: "Complete daily quests and long-term achievements for rewards."
  },
  {
    icon: "🐉",
    title: "World Boss Events",
    description: "Team up with other players to defeat massive world bosses."
  },
  {
    icon: "👥",
    title: "Guilds & Social",
    description: "Join guilds, chat with players, and compete in rankings."
  },
  {
    icon: "⚡",
    title: "PvP Auto Battle",
    description: "Challenge other players in automated combat for glory and rewards."
  },
  {
    icon: "🎲",
    title: "Gacha System",
    description: "Summon rare items and characters through the gacha mechanism."
  },
];

const classes = [
  {
    name: "Warrior",
    icon: "⚔️",
    description: "Master of melee combat with high strength and vitality",
    stats: { str: 15, agi: 8, int: 5 }
  },
  {
    name: "Mage",
    icon: "🔮",
    description: "Wielder of arcane magic with devastating spell power",
    stats: { str: 5, agi: 7, int: 18 }
  },
  {
    name: "Archer",
    icon: "🏹",
    description: "Precision striker with high agility and luck",
    stats: { str: 8, agi: 16, int: 7 }
  },
  {
    name: "Rogue",
    icon: "🗡️",
    description: "Shadow assassin with unmatched speed and critical hits",
    stats: { str: 10, agi: 17, int: 6 }
  },
  {
    name: "Cleric",
    icon: "✨",
    description: "Holy healer who supports allies and smites evil",
    stats: { str: 6, agi: 8, int: 15 }
  },
  {
    name: "Paladin",
    icon: "🛡️",
    description: "Divine knight with balanced offense and defense",
    stats: { str: 12, agi: 9, int: 10 }
  },
];
