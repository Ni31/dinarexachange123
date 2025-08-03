/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel optimizations
  poweredByHeader: false,
  compress: true,
  
  // Output configuration for Vercel
  output: 'standalone',
  
  // Image optimization for Vercel
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.pngitem.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Server external packages for Vercel
  serverExternalPackages: ['mongoose'],
  
  // Environment variables
  env: {
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
  
  // Webpack configuration for Vercel
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('mongoose');
    }
    return config;
  },
};

export default nextConfig;