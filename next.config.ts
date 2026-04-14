import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Image optimization and caching */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Enable AVIF format for better compression
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
