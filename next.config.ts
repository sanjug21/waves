import { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        // This will now be recognized correctly
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // Add other config here
};

export default nextConfig;