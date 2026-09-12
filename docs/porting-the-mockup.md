# Porting the mockup

[waterstrip/](../waterstrip/) is a complete, approved static site. It is the **design reference
and source of content** — read it freely, never edit it. Its own
[README](../waterstrip/README.md) (in Arabic) documents the design system and a pre-launch
checklist.

## What is in there

18 pages, ~2,750 lines of HTML, plus:

| Asset | Notes |
| --- | --- |
| `assets/css/style.css` | ~3,500 lines. The whole design system: official brand colours, RTL layout, components. |
| `assets/js/main.js` | ~1,150 lines. Sliders, tabs, form behaviour, scroll animations. |
| `assets/js/wg-data.js` | 8 expert working groups |
| `assets/js/article-data.js` | 4 news articles |
| `assets/js/events-data.js` | 4 events |
| `assets/img/` | Official logos + `ph/` and `hero/` placeholder SVGs |

Pages: `index`, `about`, `technologies`, `working-group`, `members`, `member`, `media`,
`article`, `contact`, `register-interest`, `login`, `forgot-password`, `terms`, `privacy`,
`cookies`, `accessibility`, `sitemap`, `404`.

Identity: brand colours `#154A91 · #1A77BC · #2B8CCC · #2FB2DC · #61CBF1`; fonts Tajawal
(headings) and IBM Plex Sans Arabic (body).

External dependencies: Google Fonts, GSAP + ScrollTrigger (cdnjs), Lenis (jsDelivr). All are
guarded — the site works without animations if they fail to load.

## The data files are already a content model

`wg-data.js`, `article-data.js` and `events-data.js` are objects keyed by slug, with per-record
fields and nested arrays (`blocks`, `stats`, `recs`). They are the natural starting shape for
the first CMS tables — port them into Drizzle tables rather than inventing a model from scratch.
Records carry both `x` and `x_ar` variants and a `src` provenance field; the site is
Arabic-only, so confirm whether the non-`_ar` duplicates are worth keeping before copying them
forward.

Fields the reference could not fill are the literal string `«غير متوفر»` ("not available").
Preserve that convention — it is meaningful, not placeholder noise.

## Content model rules

The requirement is that admins can change **content but never layout, components, or their
order**. That is enforced by schema design, not by UI politeness:

- Model each editable surface as a **fixed record with named, typed fields** — e.g. a
  `home_hero` row with exactly `title_ar`, `lede_ar`, `cta_label_ar`, `cta_href`, `image_key`.
  Components read named fields. There is no field an admin can set that restructures a page.
- **No block/page builder**, no freeform HTML field, no "sections" array that maps to component
  names.
- Repeatable collections (articles, events, working groups) may be ordered by an `order`
  integer or `published_at`. That is ordering *within* a list, which is safe — it is not layout.
- Validate at the form boundary so the dashboard cannot write a shape the components do not
  expect.

**Exception: the legal/utility pages** (terms, privacy, cookies, accessibility —
`src/lib/content/schemas/legal-shared.ts`). Their content is fundamentally a list of
(title, prose) sections whose count and order genuinely change over time as policy changes, so
admins may add, remove, reorder and retitle sections there, via the same repeatable-list
mechanism (`ItemList`) already sanctioned above for ordering. This does not reopen the door to a
block/page builder: every section renders through the exact same heading+prose template, so
nothing an admin does can swap a component or change the page's layout. The prose body itself is
still never a freeform HTML field — it is plain text with a small, fixed markdown-lite syntax
(paragraphs, `- ` bullet lists, `**bold**`, `[text](url)` restricted to relative/mailto/https
links) that `src/lib/prose.ts` renders into the small set of tags it recognises, nothing else.

## Suggested porting order

1. ~~Shared `Layout.astro`~~ and ~~the CSS foundation~~ — **done.**
   [src/layouts/Layout.astro](../src/layouts/Layout.astro) has the `<head>`, fonts, brand meta,
   header and footer with `dir="rtl"`; [src/styles/](../src/styles/) holds the layered
   stylesheet. `style.css` is **not** moved in as a block — each page's rules are re-authored
   into the layers as that page lands. See [css-architecture.md](css-architecture.md).
2. ~~`index.html` as the first real page~~ — **done.**
   [src/pages/index.astro](../src/pages/index.astro) replaced the placeholder, and brought the
   mobile drawer, the nav links and the `about-banner` CTA with it. Its copy is **not**
   hardcoded: it reads six singletons through the content cache, editable at `/admin/home`
   (see step 5). Its imagery is uploadable too; a slot with no upload falls back to placeholder
   artwork that [src/lib/home-assets.ts](../src/lib/home-assets.ts) keys by the item's stable `id`.
3. The remaining static pages, which mostly reuse the same components.
4. Data-driven pages (`working-group`, `article`, `media`, `members`) as dynamic routes reading
   from the database.
5. The CMS forms in `/admin`, one surface at a time — **started.** `/admin/home` edits the index
   page's six singletons through React islands in
   [src/components/admin/](../src/components/admin/), writing via
   `/admin/api/content/<key>` → `repo.setSingleton`. Each new page's surfaces land the same way
   as that page is ported, rather than in one pass at the end.
6. The member area, reusing the existing session infrastructure with `role: 'user'`.

Port markup faithfully. The design is signed off; this is a migration, not a redesign.

## Pre-launch checklist inherited from the mockup

From [waterstrip/README.md](../waterstrip/README.md) — these still apply to the Astro site:

1. Remove `<meta name="robots" content="noindex, nofollow">` from all 18 pages.
2. Flip `robots.txt` from `Disallow: /` to `Allow: /`.
3. Replace the `#` placeholder social links in the footer with real accounts.
4. Replace placeholder imagery (`assets/img/ph/*.svg`, `assets/img/hero/*.svg`) with real photos.
5. Wire the contact and register-interest forms to a real handler. In the Astro port these
   become server endpoints, and unlike login they will need spam protection.

Note that `waterstrip/netlify.toml` and `waterstrip/_redirects` target the mockup's Netlify
deployment. This project deploys to a VPS instead, so the redirects are handled by Astro routing
— but the security headers in that file are worth carrying over to the reverse proxy.
