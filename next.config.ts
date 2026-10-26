import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  serverExternalPackages: ['better-sqlite3', "discord.js", "@discord/ws"]
};

export default nextConfig;
