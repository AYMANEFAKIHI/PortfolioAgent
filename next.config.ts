import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Silences the "multiple lockfiles" warning when this folder lives inside another project folder.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
