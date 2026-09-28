import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Users } from "./collections/Users";
import { Waitlist } from "./collections/Waitlist";
import { Faq } from "./globals/Faq";
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
  },
  collections: [Users, Waitlist],
  globals: [Faq],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    // Dev pushes schema changes automatically; production applies migrations/ on startup.
    // After changing a collection, run `npm run payload migrate:create`.
    prodMigrations: migrations,
    // Locally the session pooler (port 5432); on Vercel the transaction pooler (port 6543)
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
});
