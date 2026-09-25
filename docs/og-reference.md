# Original site reference (fixaplan.com)

This project recreates **https://fixaplan.com**, a Framer site. It is the source of truth for
layout, sizes, colours, copy, motion timings and interaction behaviour. Before building or changing
a component, check how the original does it, then match that. Only diverge on purpose, and list the
divergence in [Intentional differences](#intentional-differences).

All numbers below were measured on the live site in headless Chromium at **1440×900** (desktop) and
**390×844** (phone) unless noted. Timings are **from the click**, sampled on every animation frame.

---

## How to check the original

- **Framer breakpoint:** desktop starts at **810px** (matches `--breakpoint-md` in `globals.css`).
- **Framer layer names** are exposed as `data-framer-name` attributes. They're the easiest selectors,
  e.g. `close-btn`, `back`, `form`, `Burger container`, `Hover image`.
- **Sections render lazily.** Scroll the whole page first (e.g. mouse-wheel in 300px steps) or text
  like "calm inside" won't be in the DOM yet.
- **Measuring motion:** inject a `click` listener (capture phase) that starts a
  `requestAnimationFrame` loop logging `getBoundingClientRect()` / effective opacity with
  `performance.now()`. Run the same recorder on `localhost:3000` and compare. Screenshots at fixed
  intervals are too sparse. Headless runs vary by ~±40ms, so compare several runs.
- **Styles:** read `getComputedStyle` (including `::after`/`::placeholder`). Framer inputs draw
  their focus border on the wrapper's `::after`.
- **Component internals** (variants, transitions, labels) are in the site bundle
  (`framerusercontent.com/sites/.../shared-lib.*.mjs`); search it for a layer name like `close-btn`.
- Use Playwright from a scratch folder, not as a project dependency.
- **Don't submit the original's forms**. They post to the real waitlist.

---

## Waitlist modal

Code: `app/components/WaitlistDialog.tsx`, waitlist section of `app/globals.css`.

### Trigger
- Every **"Join the waitlist"** CTA opens it. No navigation or URL change.

### Layers
| Layer | Original |
|---|---|
| Backdrop | full-screen, `rgba(0,0,0,0.2)` + `backdrop-filter: blur(4px)`, z-index 9 |
| Card container | `position: fixed`, **bottom 30px**, horizontally centred (`translateX(-50%)`), width **456px**; phone: **16px** side margins (358px at 390); z-index 10 |
| Card | white, radius **12px**, padding **30px 40px** (phone **20px**), column, gap **40px** |
| Close button | **46×46**, radius **12px**, white, 16px X icon, absolute, **top −62px**, centred over the card |

### Content
| Element | Original |
|---|---|
| Heading block | gap **12px** |
| Title | "You’re invited to Fixa", **28px**, line-height 0.95, Switzer **600**, black |
| Subtitle | "Get early access to **Voca** and be the first to try it." (template leftover, we say Fixa), **16px**/1.3, weight 500, `rgba(0,0,0,0.6)` |
| Form | gap **60px** between fields and button block |
| Fields list | gap **16px**. Two fields: `First Name` (text), `E-mail` (email). **Neither required.** |
| Field label | gap **10px** to the input, **14px**/1.3, weight 500, `rgba(0,0,0,0.4)`, padding-left **16px**. Labels: "Your first name", "Your e-mail" |
| Input box | height **50px**, padding **12px**, radius **10px**, background **#f2f2f2** |
| Input text | **16px**/1.3, weight 500, black. Placeholder `rgba(0,0,0,0.6)`: "First Name", "E-mail" |
| Input hover | no change |
| Input focus | background unchanged, **1px solid #0099ff** border drawn *inside* the edge (`::after`, inset 0), **instant** |
| Button | height **50px**, full width, radius **10px**, **#1a1a1a**, white **16px**/1.2 weight 500 |
| Button block | column, gap **12px** |
| Terms line | "By signing up, you're agreeing to our terms", **14px**/1.2, weight 500, **#7f7f7f** |
| Honeypots | hidden text inputs: website, company, message, subject, title, description, feedback, notes, details, remarks, comments |

### Submit button states (Framer variants)
| State | Look |
|---|---|
| Default | "Join the waitlist" |
| Loading | 20px spinner (rotating, 1s linear) |
| Success | "Submitted" |
| Error | background `rgba(204,204,204,0.15)`, text `rgb(105,105,105)`, "Something went wrong" |
| Disabled | opacity 0.5 |

### Opening motion (from the click)
- **~50ms** before anything moves.
- **Card:** starts with its top at the bottom edge of the screen (y≈903 in a 900px viewport), scale
  **0.8**, and rises + scales to 1. Progress: 10% ≈ 160–180ms, 50% ≈ 290–300ms, 90% ≈ 350–390ms,
  landed ≈ **460–480ms**. **No overshoot.**
- **Backdrop:** opacity follows the card, fully in ≈ 460ms.
- **Close button:** sits behind the card's top edge, riding and scaling with the card. It starts
  rising **~0.3s** after the card starts and travels 62px (Framer tween **0.55s**,
  `cubic-bezier(0.15, 0.45, 0.15, 1.35)`). It overshoots **~4px** around 620ms and settles ≈ **870ms**.
  An SVG **gooey filter** (`feGaussianBlur` 4 + alpha matrix `19 -8`) makes it look like it drips
  out of the card.
- **X icon:** fades in (Framer: delay 0.2s, 0.4s, `[0.44, 0, 0.56, 1]`). Measured 10% ≈ 0.7s, 90% ≈ 0.9s.
- Close button radius is 40 (a circle) in the component's closed variant and 12 when open.

### Closing
- **Esc** or the **close button**: the card slides back down, the backdrop fades out.
- **Clicking the backdrop does NOT close it.**
- The original does **not** lock page scroll while open.

---

## Header menu

Code: `app/components/Header.tsx`, header section of `app/globals.css`.

- Links: **Features** → `#features`, **Fixa AI** → `#fixaai` (ours: `#fixa-ai`), **FAQ** → `#faq`.
- Clicking a link smooth-scrolls the section's top to the top of the viewport, and **the menu stays
  open**.
- Scrolling the page with the menu open: **menu stays open**.
- **Anchor scroll curve** (0 → 2876px, Features): starts ≈ 0.10–0.15s, 25% ≈ 0.23s, 50% ≈ 0.28s,
  75% ≈ 0.42s, 90% ≈ 0.56–0.66s, 99% ≈ 0.8s, done ≈ 0.95s. Longer jumps (FAQ, ~4700px) take ~0.1–0.2s
  longer. Ours: `SmoothScroll.tsx` (Lenis `anchors` with a short pause and a critically damped spring).

---

## Word chips (inline white word pills)

Code: `app/components/WordChip.tsx`.

| Chip | Section | Hover image | Pops |
|---|---|---|---|
| "calm inside" | ADHD-Friendly | `public/mJ0uiiy26AcyIZz3z6UuBJEyE.png` (666×450) | **above** |
| "impact outside" | ADHD-Friendly | `public/CZeQCKZ6tcknwV8YLClLyhpWkD0.png` (666×450) | **below** |
| "email us" | FAQ intro | `public/BdM8sP8QPHpVTvZLxWbdvJIjAhI.png` | **above** |

- Image **222×150**, radius **24px**, inside a 4px frosted frame (230×158).
- Gap between the image and the chip's text: **24px** (above or below).
- The original shifts the "impact outside" image ~21px left of the chip's centre. Ours is centred.

---

## Intentional differences

| Where | Original | Ours | Why |
|---|---|---|---|
| Waitlist subtitle | "…access to **Voca**…" | "…access to **Fixa**…" | template leftover |
| Waitlist email check | none, submits empty forms | inline message under the field for a missing or mistyped email | fewer bad signups |
| Waitlist page scroll | page scrolls behind the modal | scroll locked while open | modal convention |
| After a successful signup | form stays filled | next open starts empty | clean restart |
| Waitlist backend | Framer forms | `app/waitlist/actions.ts` + `store.ts`, saved to the Payload `waitlist` collection (see [cms.md](cms.md)) | our own backend |
| Header link hash | `#fixaai` | `#fixa-ai` | our section id |
| "impact outside" image | ~21px left of centre | centred | not yet matched |
| Fixed page background | full-screen `backdrop-filter: blur(20px)` | no backdrop blur (pictures, if any, blurred once) | the blur changed **0 pixels** over the gradient but made ~58% of scroll frames slow |
| Fixa AI tab cards | `backdrop-filter: blur(10px)` | no backdrop blur | invisible (max 1 colour-level difference), costs every scroll frame |
| Intro panel collapse | animates `top`/`height` | same motion via `clip-path` + text `transform` | layout animation caused 0.2 CLS; now 0 |
| Hero video | iframe loads immediately | iframe loads after the page's `load` event | keeps the Kinescope player off the critical path; hidden behind the intro anyway |

---

## Phone and tablet (below 810px unless noted)

Checked side by side with the original at 360, 390, 430, 768 and 1024px. No sideways scrolling at any width.

| Where | Original on phones |
|---|---|
| ADHD section | padding **100px** top/bottom, gap **120px** between its two parts (desktop 160/160/160) |
| "Traditional planners…" kicker | **28px**/1.1, full width (desktop 32px, 424px wide) |
| "Fixa is designed differently" | starts pushed fully outside its clip box, so its reveal watches the box (`Reveal observeParent`) |
| Stats bars | end widths **33%** (Anxiety) / **79%** (Productivity); desktop **24% / 80%**. Labels clip, no "…" |
| Feature cards | 40px SVG icons (`public/C8VS…`, `e1sq…`, `4zWo…`, `hudg….svg`); border drawn inside (takes no space) |
| Fixa AI, below 1280px | tab 1 uses a single-phone image `public/PDRF2Gsxmqr44mPyerdApcea0k.webp`; frames sit inside the card's padding (40px top, 20px sides) |
| Small tap targets | AI slider dots (26×5) and footer links (15px tall) are the same size on the original |

---

## Performance and SEO

Measured with Lighthouse 13 on a production build (`next build && next start`), Sept 2026:

| | Performance (mobile / desktop) | CLS | Best practices | SEO |
|---|---|---|---|---|
| Before | 61 / 82 | 0.20 | 100 | 100 |
| After | 75–80 / 93–94 | 0 | 100 | 100 |

Scroll smoothness (whole page, 4× CPU slowdown): frames over 33ms went from ~60% to ~11%.

- **Metadata** matches the original's `<head>`: title "Fixa Planner", same description, canonical,
  Open Graph + Twitter card with the original's share image (`app/opengraph-image.png`), light/dark
  favicons (`public/icon-light.svg`, `public/icon-dark.svg`), `max-image-preview:large`.
  The domain comes from `NEXT_PUBLIC_SITE_URL` (default `https://fixaplan.com`), see `app/site.ts`.
- `app/robots.ts`, `app/sitemap.ts`, and JSON-LD (Organization, WebSite, FAQPage) in `app/page.tsx`.
- Photos use `next/image` (AVIF/WebP, responsive `sizes`). Small SVG icons stay as `<img>`.
- What still holds mobile back: the hero headline (the LCP element) only slides in after the intro,
  as on the original (~2.4–3.4s), and React/Next hydration (~1.2s of script at 4× slowdown).
- Remaining accessibility flags are the original's colours: grey labels `#868686` on `#eaeaea` (4.4:1)
  and footer text at 40% white (3.8:1), both just under the 4.5:1 guideline.
