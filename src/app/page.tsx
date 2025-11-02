'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { address } = useWallet();

  // Prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white lg:pl-64">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-600">
            Aeloria
          </h1>
          <p className="text-3xl md:text-4xl mb-6 text-purple-200 font-semibold">
             Guardians of the Eternal Sigils 
          </p>
          <p className="text-xl md:text-2xl mb-12 text-gray-300 leading-relaxed">
            Embark on an epic Web3 text-based fantasy RPG adventure on the Ronin Network.
            Battle monsters, collect NFT heroes, and become a legend!
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-black/50 py-20 border-y border-purple-500/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-8 text-yellow-400"> The Legend of Aeloria</h2>
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              In the realm of <span className="text-purple-400 font-bold">Aeloria</span>,
              ancient powers sealed within the <span className="text-yellow-400 font-bold">Eternal Sigils</span> have
              awakened. These mystical artifacts grant immense power to those worthy enough to wield them.
            </p>
            <p>
              For centuries, the land prospered under the protection of legendary heroes.
              But darkness has returned. The <span className="text-red-400 font-bold">Shadow Legion</span> rises
              from the depths, seeking to corrupt the Sigils and plunge the world into eternal night.
            </p>
            <p>
              As a Guardian, you are called upon to master the ancient arts, forge powerful equipment,
              and gather allies. Only through courage, strategy, and the bonds you create can you
              prevent the coming apocalypse and restore balance to Aeloria.
            </p>
            <p className="text-center text-xl font-bold text-yellow-400 mt-8">
              Will you rise as a hero, or fall into shadow? The fate of Aeloria is in your hands.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-yellow-400"> Game Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gradient-to-b from-purple-900/50 to-black/50 p-6 rounded-lg border border-purple-500/30 hover:border-yellow-400/50 transition-colors">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-2xl font-bold mb-3 text-yellow-400">NFT Heroes</h3>
              <p className="text-gray-300">
                Collect unique NFT characters across 6 legendary classes: Warrior, Mage, Archer, Rogue, Cleric, and Paladin.
                Each with distinct abilities and playstyles.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-b from-purple-900/50 to-black/50 p-6 rounded-lg border border-purple-500/30 hover:border-yellow-400/50 transition-colors">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-2xl font-bold mb-3 text-yellow-400">Dungeon Exploration</h3>
              <p className="text-gray-300">
                Venture into dangerous dungeons filled with monsters and treasures.
                Face epic boss battles and earn rare NFT equipment and rewards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-b from-purple-900/50 to-black/50 p-6 rounded-lg border border-purple-500/30 hover:border-yellow-400/50 transition-colors">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-2xl font-bold mb-3 text-yellow-400">PvP Battles</h3>
              <p className="text-gray-300">
                Challenge other players in auto-battle PvP combat.
                Climb the rankings and prove your strength as the ultimate Guardian.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-b from-purple-900/50 to-black/50 p-6 rounded-lg border border-purple-500/30 hover:border-yellow-400/50 transition-colors">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-2xl font-bold mb-3 text-yellow-400">Equipment & Crafting</h3>
              <p className="text-gray-300">
                Forge legendary weapons and armor. Enhance your gear from Common to Mythic rarity.
                Enchant items up to +10 for maximum power.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-b from-purple-900/50 to-black/50 p-6 rounded-lg border border-purple-500/30 hover:border-yellow-400/50 transition-colors">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-2xl font-bold mb-3 text-yellow-400">Gacha & Summons</h3>
              <p className="text-gray-300">
                Summon powerful heroes and rare items through the gacha system.
                Utilize different currencies to unlock your perfect team.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-b from-purple-900/50 to-black/50 p-6 rounded-lg border border-purple-500/30 hover:border-yellow-400/50 transition-colors">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-2xl font-bold mb-3 text-yellow-400">Guilds & Community</h3>
              <p className="text-gray-300">
                Join or create guilds with fellow Guardians. Participate in world boss events,
                seasonal challenges, and earn exclusive rewards together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Economy Section */}
      <section className="bg-black/50 py-20 border-t border-purple-500/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400"> Triple Economy System</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b from-yellow-900/30 to-black p-6 rounded-lg border border-yellow-500/30 text-center">
              <div className="text-4xl mb-3"></div>
              <h3 className="text-xl font-bold mb-2 text-yellow-400">Gold</h3>
              <p className="text-gray-300 text-sm">
                In-game currency earned through quests and battles. Used for basic transactions.
              </p>
            </div>
            <div className="bg-gradient-to-b from-purple-900/30 to-black p-6 rounded-lg border border-purple-500/30 text-center">
              <div className="text-4xl mb-3"></div>
              <h3 className="text-xl font-bold mb-2 text-purple-400">Premium Currency</h3>
              <p className="text-gray-300 text-sm">
                Premium currency for special summons and exclusive items.
              </p>
            </div>
            <div className="bg-gradient-to-b from-pink-900/30 to-black p-6 rounded-lg border border-pink-500/30 text-center">
              <div className="text-4xl mb-3"></div>
              <h3 className="text-2xl font-bold mb-2 text-pink-400">AETH Token</h3>
              <p className="text-gray-300 text-sm">
                Blockchain token on Ronin Network. Trade on marketplace and earn through gameplay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-400">
            Ready to Begin Your Adventure?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect your Ronin Wallet and start your journey as a Guardian of the Eternal Sigils today!
          </p>
          {mounted && !address && (
            <p className="text-purple-300 mb-8 text-lg">
              Click the <span className="font-bold text-yellow-400">Login</span> button in the header to connect your wallet
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
