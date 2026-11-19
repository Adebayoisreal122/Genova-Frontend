import type { NextConfig } from "next";

const longCache = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Only bundle the icons actually used.
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      // These files are fingerprinted by name (rename on change), so browsers can cache them for a year.
      { source: "/samples/:path*", headers: longCache },
      { source: "/brand/:path*", headers: longCache },
      { source: "/icons/:path*", headers: longCache },
    ];
  },
};

export default nextConfig;
