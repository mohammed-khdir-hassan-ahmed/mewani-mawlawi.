import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Image optimization with custom ImageKit loader */
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
    // Minimize unused CSS
    optimizeFonts: true,
    // Optimize images aggressively
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  /* Compression and bundling optimizations */
  compress: true,
  
  /* Enable SWR (stale-while-revalidate) for ISR */
  experimental: {
    isrMemoryCacheSize: 52 * 1024 * 1024, // 50MB ISR cache
  },
};

export default nextConfig;
