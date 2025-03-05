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
  reactStrictMode: false,
};

if (process.env.VERCEL_ENV === "production") {
  nextConfig.compiler = {
    removeConsole: true,
  };
}

const withBundleAnalyzer = generated({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
