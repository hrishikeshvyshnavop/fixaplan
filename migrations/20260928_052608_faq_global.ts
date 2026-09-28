import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`faq_items_order_idx\` ON \`faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_parent_id_idx\` ON \`faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`faq\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`intro\` text DEFAULT 'We’re here to help. If you didn’t find the answer to your question, feel free to' NOT NULL,
  	\`chip_text\` text DEFAULT 'email us' NOT NULL,
  	\`chip_href\` text DEFAULT 'mailto:info@fixaplan.com' NOT NULL,
  	\`intro_end\` text DEFAULT 'anytime.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`faq_items\`;`)
  await db.run(sql`DROP TABLE \`faq\`;`)
}
