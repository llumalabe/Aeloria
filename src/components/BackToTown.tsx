'use client';

import Link from 'next/link';

export default function BackToTown() {
  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Link
        href="/town"
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all group"
      >
        <span className="text-xl group-hover:translate-x-[-4px] transition-transform">←</span>
        <span>Back to Town</span>
      </Link>
    </div>
  );
}
