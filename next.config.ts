import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  allowedDevOrigins: ['172.16.0.2'],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
