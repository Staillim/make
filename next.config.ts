import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Remove serverExternalPackages as it's no longer experimental in Next.js 16
};

export default nextConfig;
