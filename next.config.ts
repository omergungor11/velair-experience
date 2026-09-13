import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { qualities: [75, 85] },
  turbopack: { root: process.cwd() },
};

export default nextConfig;
