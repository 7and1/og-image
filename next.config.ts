import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages
  output: "export",

  // Disable image optimization (not available in static export)
  images: {
    unoptimized: true,
  },

  // Empty turbopack config to acknowledge using default
  turbopack: {},

  // Webpack configuration for WASM support (fallback when using --webpack)
  webpack: (config) => {
    // Prevent bundling of Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    // Enable WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
};

export default nextConfig;
