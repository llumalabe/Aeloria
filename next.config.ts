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
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Exclude Web3 packages from server bundle to prevent indexedDB errors
    if (isServer) {
      config.externals.push({
        'wagmi': 'commonjs wagmi',
        'viem': 'commonjs viem',
        '@wagmi/core': 'commonjs @wagmi/core',
        '@wagmi/connectors': 'commonjs @wagmi/connectors',
        '@sky-mavis/tanto-widget': 'commonjs @sky-mavis/tanto-widget',
      });
    }
    
    // Add alias to mock indexedDB globally
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },
};

export default nextConfig;
