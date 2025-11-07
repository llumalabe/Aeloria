'use client';

import GameNav from '@/components/GameNav';

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white pb-20">
      <div className="bg-black/80 backdrop-blur-md border-b border-red-800/50 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-red-500">🗺️ Scavenging Map</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-20">
          <div className="text-9xl mb-4">🗺️</div>
          <h2 className="text-3xl font-bold text-red-500 mb-2">Explore the Wasteland</h2>
          <p className="text-gray-400">Search for supplies and survivors</p>
        </div>
      </div>
      <GameNav />
    </div>
  );
}
