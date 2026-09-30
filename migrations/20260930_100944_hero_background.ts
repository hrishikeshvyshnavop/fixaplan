import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_hero_background_type" AS ENUM('video', 'image');
  CREATE TYPE "public"."enum__hero_v_version_background_type" AS ENUM('video', 'image');
  ALTER TABLE "hero" ADD COLUMN "background_type" "enum_hero_background_type" DEFAULT 'video';
  ALTER TABLE "hero" ADD COLUMN "background_video_id" integer;
  ALTER TABLE "hero" ADD COLUMN "background_image_id" integer;
  ALTER TABLE "_hero_v" ADD COLUMN "version_background_type" "enum__hero_v_version_background_type" DEFAULT 'video';
  ALTER TABLE "_hero_v" ADD COLUMN "version_background_video_id" integer;
  ALTER TABLE "_hero_v" ADD COLUMN "version_background_image_id" integer;
  ALTER TABLE "hero" ADD CONSTRAINT "hero_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero" ADD CONSTRAINT "hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hero_v" ADD CONSTRAINT "_hero_v_version_background_video_id_media_id_fk" FOREIGN KEY ("version_background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hero_v" ADD CONSTRAINT "_hero_v_version_background_image_id_media_id_fk" FOREIGN KEY ("version_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "hero_background_video_idx" ON "hero" USING btree ("background_video_id");
  CREATE INDEX "hero_background_image_idx" ON "hero" USING btree ("background_image_id");
  CREATE INDEX "_hero_v_version_version_background_video_idx" ON "_hero_v" USING btree ("version_background_video_id");
  CREATE INDEX "_hero_v_version_version_background_image_idx" ON "_hero_v" USING btree ("version_background_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero" DROP CONSTRAINT "hero_background_video_id_media_id_fk";
  
  ALTER TABLE "hero" DROP CONSTRAINT "hero_background_image_id_media_id_fk";
  
  ALTER TABLE "_hero_v" DROP CONSTRAINT "_hero_v_version_background_video_id_media_id_fk";
  
  ALTER TABLE "_hero_v" DROP CONSTRAINT "_hero_v_version_background_image_id_media_id_fk";
  
  DROP INDEX "hero_background_video_idx";
  DROP INDEX "hero_background_image_idx";
  DROP INDEX "_hero_v_version_version_background_video_idx";
  DROP INDEX "_hero_v_version_version_background_image_idx";
  ALTER TABLE "hero" DROP COLUMN "background_type";
  ALTER TABLE "hero" DROP COLUMN "background_video_id";
  ALTER TABLE "hero" DROP COLUMN "background_image_id";
  ALTER TABLE "_hero_v" DROP COLUMN "version_background_type";
  ALTER TABLE "_hero_v" DROP COLUMN "version_background_video_id";
  ALTER TABLE "_hero_v" DROP COLUMN "version_background_image_id";
  DROP TYPE "public"."enum_hero_background_type";
  DROP TYPE "public"."enum__hero_v_version_background_type";`)
}
