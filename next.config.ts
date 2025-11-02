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

  // Experimental features to prevent static generation
  experimental: {
    // Disable static generation for app router
    isrMemoryCacheSize: 0,
  },

  // Webpack config
  webpack: (config) => {
    // Fix for pino-pretty error with PNPM/Wagmi/WalletConnect
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;
