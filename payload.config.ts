import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Users } from "./collections/Users";
import { Waitlist } from "./collections/Waitlist";
import { migrations } from "./migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Admin panel at /admin, REST API at /api. SQLite for now; swap the adapter for
// @payloadcms/db-postgres before deploying to a serverless host.
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Waitlist],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    // Dev pushes schema changes automatically; production applies migrations/ on startup.
    // After changing a collection, run `npm run payload migrate:create`.
    prodMigrations: migrations,
    client: {
      url: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
});
