import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Media } from "./collections/Media";
import { Users } from "./collections/Users";
import { Waitlist } from "./collections/Waitlist";
import { Faq } from "./globals/Faq";
import { Hero } from "./globals/Hero";
import { migrations } from "./migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Admin panel at /admin, REST API at /api. Database: Supabase Postgres (see docs/supabase.md).
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // The editing pages for the homepage's globals show the page beside the form. /preview turns
    // on Next's draft mode (logged-in admins only), so the page reads the latest autosaved draft.
    livePreview: {
      globals: [Hero.slug, Faq.slug],
      url: ({ req }) => `${req.origin}/preview`,
      breakpoints: [
        { label: "Phone", name: "phone", width: 390, height: 844 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Waitlist, Media],
  globals: [Hero, Faq],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    // Local dev and Vercel share one Supabase database, so dev must not push schema changes
    // (that leaves a "dev" marker that makes every later build stop at a data-loss prompt).
    // After changing a collection: `npm run payload -- migrate:create <name>`, then `npm run payload -- migrate`.
    push: false,
    prodMigrations: migrations,
    // Locally the session pooler (port 5432); on Vercel the transaction pooler (port 6543)
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  plugins: [
    // Uploads go to the public Supabase Storage bucket over its S3 API, and the page links
    // straight to the bucket's public URL (no round trip through Payload)
    s3Storage({
      // The browser uploads straight to the bucket (signed URL), so videos aren't stopped by Vercel's
      // 4.5 MB request limit. Only logged-in admins get a signed URL.
      clientUploads: true,
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            [process.env.S3_PUBLIC_URL, prefix, filename].filter(Boolean).join("/"),
        },
      },
      bucket: process.env.S3_BUCKET || "media",
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
      },
    }),
  ],
  sharp,
});
