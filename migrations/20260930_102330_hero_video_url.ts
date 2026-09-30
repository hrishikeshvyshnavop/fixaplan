import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// The Kinescope ID field becomes a general video link. Saved IDs are copied over as Kinescope
// links. The old `video_id` columns stay (unused) so deployments of the previous code keep
// working while dev and Vercel share this database; drop them once everything runs this code.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero" ADD COLUMN "video_url" varchar;
  ALTER TABLE "_hero_v" ADD COLUMN "version_video_url" varchar;
  UPDATE "hero" SET "video_url" = 'https://kinescope.io/' || "video_id" WHERE "video_id" ~ '^[A-Za-z0-9]+$';
  UPDATE "_hero_v" SET "version_video_url" = 'https://kinescope.io/' || "version_video_id" WHERE "version_video_id" ~ '^[A-Za-z0-9]+$';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero" DROP COLUMN "video_url";
  ALTER TABLE "_hero_v" DROP COLUMN "version_video_url";`)
}
