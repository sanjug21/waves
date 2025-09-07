import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {

        ignoreDuringBuilds: true,
    },
    experimental: {
    optimizeCss: false
  }
  
};

export default nextConfig;
