import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  swcMinify: true,
};

if (process.env.NEXT_PUBLIC_NODE_ENV === "prod") {
  nextConfig.compiler = {
    removeConsole: {
      exclude: ["debug", "error", "warn", "info"],
    },
  };
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({})
export default nextConfig;
