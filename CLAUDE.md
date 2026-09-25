# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

This site recreates https://fixaplan.com — match the original before building or changing anything. Measurements, behaviour and intentional differences: @docs/og-reference.md

## Commands

- `npm run dev` / `npm run build` / `npm start`: Next.js 16 (Turbopack)
- `npm run lint`: ESLint (flat config, `eslint-config-next`)
- `npx tsc --noEmit`: type check. If it complains about a missing `LayoutProps` or old paths in `.next/types`, run a build first to regenerate them.
- `npm run payload -- <cmd>`: Payload CLI, e.g. `migrate:create <name>`. Also `npm run generate:types` (→ `payload-types.ts`) and `npm run generate:importmap`.
- There is no test suite. Check UI changes against the original with Playwright from a scratch folder (see og-reference.md, "How to check the original"), not as a project dependency.

`.env` (git-ignored) needs `DATABASE_URL=file:./data/payload.db` and `PAYLOAD_SECRET`. Details are in @docs/cms.md.

## Architecture

- **Two root layouts (route groups).** `app/(frontend)/` is the public site: `layout.tsx` (fonts, metadata, Lenis), `page.tsx`, `globals.css`, `fonts/`, `opengraph-image.png`. `app/(payload)/` is Payload's admin (`/admin`) and API (`/api`). It is generated, so don't edit it by hand. Moving between the two groups is a full page load. `app/components/`, `app/waitlist/` and `app/site.ts` sit outside both groups because they aren't routes. Import them as `@/app/...`.
- **One page.** `app/(frontend)/page.tsx` is a server component. It holds the page copy (FAQ, feature text) and the JSON-LD, and composes the section components in order. Copy lives there or in the section component, not in the CMS.
- **Motion lives in CSS.** Most entrance/scroll animations are CSS keyframes/transitions in `globals.css`, with timings taken from the original Framer site. The client components only toggle classes or CSS variables. `Reveal.tsx` sets its starting state per breakpoint with CSS variables (`--rx`, `--rd`, `--rdelay-md`, …). `motion` is used in only a few components. `SmoothScroll.tsx` (Lenis) handles page and anchor scrolling. `globals.css` has one commented section per feature (header menu, reveal, waitlist modal, …).
- **Breakpoint.** Tailwind v4 with `--breakpoint-md: 810px` (Framer's desktop breakpoint). Styles are phone-first, and `md:` means desktop.
- **Waitlist.** Any `<a href="#waitlist">` opens `WaitlistDialog.tsx`, a native `<dialog>` that picks up the hash click in the capture phase. Submitting calls the `joinWaitlist` server action in `app/waitlist/actions.ts` (honeypot and email checks), then `addSignup()` in `store.ts`, which writes to the Payload `waitlist` collection.
- **Payload.** `payload.config.ts` sets up SQLite (`data/`, git-ignored) and the collections in `collections/`. Dev updates the schema automatically. Production runs `migrations/` on startup (`prodMigrations`), so any collection change needs `npm run payload -- migrate:create <name>`. `package.json` must stay `"type": "module"`, or the Payload CLI can't load the config.
- **Site URL/SEO.** `app/site.ts` reads `NEXT_PUBLIC_SITE_URL` (default `https://fixaplan.com`), and metadata, `robots.ts`, `sitemap.ts` and JSON-LD all use it. `public/` assets are named by content hash (copied from the original), and `next.config.ts` caches optimised images for a year.
- **Performance.** Before adding `backdrop-filter`, layout-property animations or eager third-party embeds, read "Intentional differences" and "Performance and SEO" in og-reference.md. Several were removed on purpose.
