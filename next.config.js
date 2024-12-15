/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  swcMinify: false,
};

if (process.env.NODE_ENV === "production") {
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
