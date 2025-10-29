'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-yellow-500/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">⚔️ Aeloria</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Embark on an epic journey in Aeloria, a Web3 fantasy RPG where heroes battle for the Eternal Sigils on the Ronin Network.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/characters" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Characters
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/gacha" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Gacha
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Whitepaper
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2">
                  <span>🐦</span> Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2">
                  <span>💬</span> Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2">
                  <span>📱</span> Telegram
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2">
                  <span>📘</span> Medium
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 Aeloria. All rights reserved. Built on Ronin Network.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-yellow-400 transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-yellow-400 transition-colors text-sm">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
