import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_top" varchar DEFAULT 'Plan your day' NOT NULL,
  	"title_bottom" varchar DEFAULT 'without' NOT NULL,
  	"title_accent" varchar DEFAULT 'overwhelm' NOT NULL,
  	"description" varchar DEFAULT 'Fixa is a simple, ADHD-friendly planner that turns your thoughts into a clear plan' NOT NULL,
  	"cta_note" varchar DEFAULT 'No clutter. No complicated setup. Just your day, clearly planned.' NOT NULL,
  	"cta_label" varchar DEFAULT 'Join the waitlist' NOT NULL,
  	"video_id" varchar DEFAULT 'wXQXtViozUbKjC61PdWpw2' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "hero" CASCADE;`)
}
