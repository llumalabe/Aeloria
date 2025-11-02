import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Use standalone instead of export to skip static generation  
  reactStrictMode: true,
  
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
  webpack: (config) => {
    // Fix for pino-pretty error with PNPM/Wagmi/WalletConnect
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;
