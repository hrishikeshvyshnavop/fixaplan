import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF where the browser supports it, WebP otherwise
    formats: ["image/avif", "image/webp"],
    // Source files in /public are named by content hash, so optimised copies can be cached for a year
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
