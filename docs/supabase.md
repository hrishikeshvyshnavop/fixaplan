# Moving to Supabase (in progress)

Plan agreed on 28 Sept 2026: host on **Vercel**, move the database from SQLite to **Supabase
Postgres**, and make the page text editable in Payload. Read [cms.md](cms.md) first for how Payload
is set up now.

## Why

- Vercel keeps no files between deploys, so `data/payload.db` (SQLite) would lose every signup, admin
  account and text edit. Payload always needs a database.
- Supabase is plain Postgres, so Payload uses its standard `@payloadcms/db-postgres` adapter.
  Supabase Storage (S3-compatible) can hold CMS image uploads later through `@payloadcms/storage-s3`.
- A git-based CMS (TinaCMS, Decap) would skip the database for the text, but the waitlist would
  still need one, so we're staying with Payload.

## Status

| Step | State |
|---|---|
| 1. Add Supabase MCP to Claude Code | done (needs sign-in, see below) |
| 2. Create Supabase project, put the connection string in `.env` | **todo (user)** |
| 3. Switch Payload to `@payloadcms/db-postgres`, create a new first migration | todo |
| 4. Page text editable in Payload (one editing page per section), page reads it | todo |
| 5. Refresh the homepage when content is saved (page stays static) | todo |
| 6. Update `cms.md`, `CLAUDE.md`, check build, text edits, signups | todo |
| 7. Vercel: environment settings, deploy, create admin, Lighthouse | todo |

Update this table as steps are finished.

## 1. Supabase MCP (Claude Code)

Added with:

```
claude mcp add --transport http supabase "https://mcp.supabase.com/mcp?features=database,docs,development,debugging,storage"
```

- It's saved in local scope: `~/.claude.json`, for this project only, not in the repo.
- **Sign in:** run `/mcp` in Claude Code, pick **supabase**, then **Authenticate**. The browser opens
  to log in to Supabase. If the tools don't appear afterwards, restart Claude Code.
- It has full access, so it can create the project. Creating a project on a paid plan can cost money,
  so Claude asks before doing it. Once setup is done, switch it to read-only by adding
  `&read_only=true` to the address, and limit it to one project by adding `&project_ref=<id>`.
- Check it with `claude mcp list`.

## 2. Supabase project and `.env`

1. Create a project at supabase.com. Pick a region close to your users or your Vercel region, and set
   a database password. Supabase won't show the password again.
2. In the project, click **Connect** and copy two connection strings:
   - **Session pooler** (port **5432**): use this locally and for migrations.
   - **Transaction pooler** (port **6543**): use this on Vercel, because serverless opens many short
     connections.
   - Don't use **Direct connection**. It needs IPv6 and usually fails from home and office networks.
3. Set it in `.env` (git-ignored). Type the password in by hand, and never paste it into chat or the
   repo:
   ```
   DATABASE_URL=postgresql://postgres.<ref>:<PASSWORD>@aws-0-<region>.pooler.supabase.com:5432/postgres
   PAYLOAD_SECRET=<unchanged>
   ```
   Keep the old `file:./data/payload.db` line commented out if you might switch back.

## 3. Switching the adapter (plan)

- `npm install @payloadcms/db-postgres`, then remove `@payloadcms/db-sqlite`.
- In `payload.config.ts`, use `postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL }, prodMigrations: migrations })`.
- The current `migrations/20260925_125155_initial.*` files are SQLite SQL. Delete them and run
  `npm run payload -- migrate:create initial` against Supabase.
- Nothing is copied from SQLite. The old file only holds 3 test signups and a local admin.
  Create a fresh admin at `/admin`.

## 4–5. Editable page text (plan)

- One Payload **global** per section (Header, Hero, ADHD, Features, Fixa AI, Next step, FAQ,
  Footer), with fields that start with today's text from `app/(frontend)/page.tsx`. A migration or
  seed fills them, so the site looks the same.
- `page.tsx` reads them with `payload.findGlobal()`. The JSON-LD FAQ uses the same data.
- An `afterChange` hook calls `revalidatePath("/")`, so edits show straight away and the page stays
  static.
- The text still has to match the original site (see [og-reference.md](og-reference.md)).

## 7. Vercel (plan)

- Environment settings: `DATABASE_URL` (the **transaction pooler** string, port 6543),
  `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`.
- Migrations run on startup (`prodMigrations`).
- Create the admin at `/admin` straight away. Until an admin exists, anyone who opens that page can
  create the first admin.
- Re-run Lighthouse and compare with [og-reference.md](og-reference.md#performance-and-seo).
