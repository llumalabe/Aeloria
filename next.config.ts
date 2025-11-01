import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack config (Next.js 16+)
  turbopack: {
    // Empty config to silence webpack migration warning
  },
  
  // Webpack config for fallback/dev mode
  webpack: (config) => {
    // Fix for pino-pretty error with PNPM/Wagmi/WalletConnect
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;
