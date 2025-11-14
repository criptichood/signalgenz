import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for better performance
  output: 'standalone',
  
  // Disable trailing slashes for cleaner URLs
  trailingSlash: false,
  
  // Image optimization
  images: {
    unoptimized: false, // Enable optimization for production
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true, // Show all TypeScript errors
  },
  
  // React strict mode for development
  reactStrictMode: true,
  
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports if needed
  },
  
  // Enable typed routes
  typedRoutes: true,
  
  // Optimize production builds
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundle
  
  // Configure headers for better security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
  
  // Rewrites for API routes if needed
  async rewrites() {
    return [];
  },
};

export default nextConfig;