import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

// Public URL of the Supabase Storage bucket that holds CMS uploads (see payload.config.ts)
const media = process.env.S3_PUBLIC_URL ? new URL(process.env.S3_PUBLIC_URL) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: media
      ? [{ protocol: "https", hostname: media.hostname, pathname: `${media.pathname}/**` }]
      : [],
    // AVIF where the browser supports it, WebP otherwise
    formats: ["image/avif", "image/webp"],
    // Source files in /public are named by content hash, so optimised copies can be cached for a year
    minimumCacheTTL: 31536000,
  },
};

export default withPayload(nextConfig);
