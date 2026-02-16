import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.waifu.pics',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
