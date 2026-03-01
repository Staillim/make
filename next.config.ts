import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable experimental features for better Netlify compatibility
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
