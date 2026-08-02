import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow img tags from the FastAPI backend
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "https", hostname: "*.railway.app" },
      { protocol: "https", hostname: "*.hf.space" },
    ],
  },
};

export default nextConfig;
