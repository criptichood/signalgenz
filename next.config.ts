import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Remove static export since we have API routes
  output: undefined, // Change from 'export' since we now have API routes
  trailingSlash: true,
  images: {
    unoptimized: true // Keep unoptimized for static export compatibility if needed
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build for faster development
  },
  // Remove eslint config which is no longer supported
  experimental: {
    // Remove serverExternalPackages as it's causing warnings too
    // serverExternalPackages: ['zustand'], // Commenting out as it's causing warnings
  },
  // Move typedRoutes to main config as recommended
  typedRoutes: true, // Enable typed route generation
};


export default nextConfig;