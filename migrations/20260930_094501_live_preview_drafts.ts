import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_hero_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__hero_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faq_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faq_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_hero_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_title_top" varchar DEFAULT 'Plan your day',
  	"version_title_bottom" varchar DEFAULT 'without',
  	"version_title_accent" varchar DEFAULT 'overwhelm',
  	"version_description" varchar DEFAULT 'Fixa is a simple, ADHD-friendly planner that turns your thoughts into a clear plan',
  	"version_cta_note" varchar DEFAULT 'No clutter. No complicated setup. Just your day, clearly planned.',
  	"version_cta_label" varchar DEFAULT 'Join the waitlist',
  	"version_video_id" varchar DEFAULT 'wXQXtViozUbKjC61PdWpw2',
  	"version__status" "enum__hero_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_faq_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_faq_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_intro" varchar DEFAULT 'We’re here to help. If you didn’t find the answer to your question, feel free to',
  	"version_chip_text" varchar DEFAULT 'email us',
  	"version_chip_href" varchar DEFAULT 'mailto:info@fixaplan.com',
  	"version_intro_end" varchar DEFAULT 'anytime.',
  	"version_chip_image_id" integer,
  	"version__status" "enum__faq_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "hero" ALTER COLUMN "title_top" DROP NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "title_bottom" DROP NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "title_accent" DROP NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "cta_note" DROP NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "cta_label" DROP NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "video_id" DROP NOT NULL;
  ALTER TABLE "faq_items" ALTER COLUMN "question" DROP NOT NULL;
  ALTER TABLE "faq_items" ALTER COLUMN "answer" DROP NOT NULL;
  ALTER TABLE "faq" ALTER COLUMN "intro" DROP NOT NULL;
  ALTER TABLE "faq" ALTER COLUMN "chip_text" DROP NOT NULL;
  ALTER TABLE "faq" ALTER COLUMN "chip_href" DROP NOT NULL;
  ALTER TABLE "hero" ADD COLUMN "_status" "enum_hero_status" DEFAULT 'draft';
  ALTER TABLE "faq" ADD COLUMN "_status" "enum_faq_status" DEFAULT 'draft';
  ALTER TABLE "_faq_v_version_items" ADD CONSTRAINT "_faq_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faq_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faq_v" ADD CONSTRAINT "_faq_v_version_chip_image_id_media_id_fk" FOREIGN KEY ("version_chip_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_hero_v_version_version__status_idx" ON "_hero_v" USING btree ("version__status");
  CREATE INDEX "_hero_v_created_at_idx" ON "_hero_v" USING btree ("created_at");
  CREATE INDEX "_hero_v_updated_at_idx" ON "_hero_v" USING btree ("updated_at");
  CREATE INDEX "_hero_v_latest_idx" ON "_hero_v" USING btree ("latest");
  CREATE INDEX "_hero_v_autosave_idx" ON "_hero_v" USING btree ("autosave");
  CREATE INDEX "_faq_v_version_items_order_idx" ON "_faq_v_version_items" USING btree ("_order");
  CREATE INDEX "_faq_v_version_items_parent_id_idx" ON "_faq_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_faq_v_version_version_chip_image_idx" ON "_faq_v" USING btree ("version_chip_image_id");
  CREATE INDEX "_faq_v_version_version__status_idx" ON "_faq_v" USING btree ("version__status");
  CREATE INDEX "_faq_v_created_at_idx" ON "_faq_v" USING btree ("created_at");
  CREATE INDEX "_faq_v_updated_at_idx" ON "_faq_v" USING btree ("updated_at");
  CREATE INDEX "_faq_v_latest_idx" ON "_faq_v" USING btree ("latest");
  CREATE INDEX "_faq_v_autosave_idx" ON "_faq_v" USING btree ("autosave");
  CREATE INDEX "hero__status_idx" ON "hero" USING btree ("_status");
  CREATE INDEX "faq__status_idx" ON "faq" USING btree ("_status");
  -- Text saved before drafts existed is what the site shows, so it counts as published
  UPDATE "hero" SET "_status" = 'published';
  UPDATE "faq" SET "_status" = 'published';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_hero_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_faq_v_version_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_faq_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_hero_v" CASCADE;
  DROP TABLE "_faq_v_version_items" CASCADE;
  DROP TABLE "_faq_v" CASCADE;
  DROP INDEX "hero__status_idx";
  DROP INDEX "faq__status_idx";
  ALTER TABLE "hero" ALTER COLUMN "title_top" SET NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "title_bottom" SET NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "title_accent" SET NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "cta_note" SET NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "cta_label" SET NOT NULL;
  ALTER TABLE "hero" ALTER COLUMN "video_id" SET NOT NULL;
  ALTER TABLE "faq_items" ALTER COLUMN "question" SET NOT NULL;
  ALTER TABLE "faq_items" ALTER COLUMN "answer" SET NOT NULL;
  ALTER TABLE "faq" ALTER COLUMN "intro" SET NOT NULL;
  ALTER TABLE "faq" ALTER COLUMN "chip_text" SET NOT NULL;
  ALTER TABLE "faq" ALTER COLUMN "chip_href" SET NOT NULL;
  ALTER TABLE "hero" DROP COLUMN "_status";
  ALTER TABLE "faq" DROP COLUMN "_status";
  DROP TYPE "public"."enum_hero_status";
  DROP TYPE "public"."enum__hero_v_version_status";
  DROP TYPE "public"."enum_faq_status";
  DROP TYPE "public"."enum__faq_v_version_status";`)
}
