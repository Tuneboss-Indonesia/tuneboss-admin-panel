import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === "development" && {
    turbopack: {
      root: process.cwd(),
    },
  }),
};

export default nextConfig;
