import type { NextConfig } from "next";

import generated from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d5ws8pqr5saw9.cloudfront.net",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    authInterrupts: true,
  },
};

if (process.env.NODE_ENV === "production") {
  nextConfig.compiler = {
    removeConsole: {
      exclude: ["debug", "error", "warn", "info"],
    },
  };
}

const withBundleAnalyzer = generated({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
