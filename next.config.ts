import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Force dynamic rendering - no static generation
  output: 'standalone',

  // Disable image optimization
  images: {
    unoptimized: true,
  },

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Webpack config
  webpack: (config, { isServer }) => {
    // Fix for pino-pretty error with PNPM/Wagmi/WalletConnect
    config.resolve.fallback = { fs: false, net: false, tls: false };
    
    if (isServer) {
      // Only externalize specific packages that cause issues
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
    } else {
      // Client-side only: externalize these too
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
    }
    
    return config;
  },
};

export default nextConfig;
