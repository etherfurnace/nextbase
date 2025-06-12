import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    implementation: 'sass-embedded',
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
