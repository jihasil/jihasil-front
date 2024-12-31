import type { NextConfig } from "next";

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
};

if (process.env.NODE_ENV === "production") {
  nextConfig.compiler = {
    removeConsole: {
      exclude: ["debug", "error", "warn", "info"],
    },
  };
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
