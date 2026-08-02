import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence the Turbopack/webpack conflict warning
  turbopack: {},

  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "https", hostname: "*.railway.app" },
      { protocol: "https", hostname: "*.hf.space" },
    ],
  },

  // Cross-origin isolation headers — required for WASM SharedArrayBuffer
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;
