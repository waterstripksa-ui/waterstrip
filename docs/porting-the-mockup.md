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

Pages: `index`, `corridor`, `about`, `technologies`, `working-group`, `members`, `member`,
`media`, `article`, `contact`, `register-interest`, `login`, `forgot-password`, `terms`,
`privacy`, `cookies`, `accessibility`, `sitemap`, `404`. (`index-v2.html` is the home page the
site follows; see [Mockup revision of 2026-09-19](#mockup-revision-of-2026-09-19).)

Ported so far: all 19 pages — `index`, `corridor`, `about`, `contact`, `register-interest`, `terms`,
`privacy`, `cookies`, `accessibility`, `sitemap`, `404`, `login`, `forgot-password`,
`technologies`, `working-group`, `media`, `article`, `members`, `member`.

Identity: brand colours `#154A91 · #1A77BC · #2B8CCC · #2FB2DC · #61CBF1`; fonts Tajawal
(headings) and IBM Plex Sans Arabic (body).

External dependencies: Google Fonts, GSAP + ScrollTrigger (cdnjs), Lenis (jsDelivr). All are
guarded — the site works without animations if they fail to load.

## The data files are already a content model

`wg-data.js`, `article-data.js` and `events-data.js` are objects keyed by slug, with per-record
fields and nested arrays (`blocks`, `stats`, `recs`). They are the natural starting shape for
the first CMS tables — port them into Drizzle tables rather than inventing a model from scratch.
Records carry both `x` and `x_ar` variants and a `src` provenance field. The `x` values are
copies of the Arabic, not translations, so only `_ar` came forward; the English site uses
separate `_en` fields, which start empty (see [i18n.md](i18n.md)).

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

1. ~~Shared `Layout.astro`~~ and ~~the CSS foundation~~ — **done, twice.** The first pass
   (superseded) built [src/layouts/Layout.astro](../src/layouts/Layout.astro) against a
   hand-authored, re-layered stylesheet, re-authoring `style.css`'s rules into
   [src/styles/](../src/styles/) page by page. That approach was abandoned 2026-09-13: `style.css`
   is ~3,500 lines of stacked overrides where the winning rule for any given selector is
   whichever appears **last** in the file, not whichever is most specific, so hand-porting kept
   missing whichever override actually won (see [css-architecture.md](css-architecture.md) for
   the blow-by-blow). The current approach instead vendors `style.css` **byte-for-byte** as
   [public/mockup/style.css](../public/mockup/style.css) plus the mockup's own
   [main.js](../src/scripts/mockup/main.js), and every public page now uses the mockup's own
   markup and class names — parity holds by construction instead of by re-derivation. `/admin`
   was carved out onto its own [admin.css](../src/styles/admin.css) so this switch could not
   leak into the dashboard.
2. ~~`index.html` as the first real page~~ — **done**, then re-done in mockup markup.
   [src/views/Home.astro](../src/views/Home.astro) reads six singletons through the content
   cache, editable at `/admin/home` (see step 5). Its imagery is uploadable too; a slot with no
   upload falls back to placeholder artwork that
   [src/lib/home-assets.ts](../src/lib/home-assets.ts) keys by the item's stable `id`.
3. ~~The remaining static pages~~ — **done.** `about`, `technologies`, `members`, `contact`,
   `register-interest`, `login`, `forgot-password`, `terms`, `privacy`, `cookies`,
   `accessibility`, `sitemap`, `404` are all ported in mockup markup.
4. ~~Data-driven pages~~ (`working-group`, `article`, `media`, `member`) ~~as dynamic routes
   reading from the database~~ — **done.** Each renders server-side the exact HTML the mockup's
   own `main.js` module would have built client-side from its `window.WSTRIP_*` data global (see
   [css-architecture.md](css-architecture.md#public-pages-the-mockups-own-stylesheet) for the
   convention); the data files themselves are never shipped.
5. The CMS forms in `/admin`, one surface at a time — **started.** `/admin/home` edits the index
   page's six singletons through React islands in
   [src/components/admin/](../src/components/admin/), writing via
   `/admin/api/content/<key>` → `repo.setSingleton`. Each new page's surfaces land the same way
   as that page is ported, rather than in one pass at the end.
6. The member area, reusing the existing session infrastructure with `role: 'user'`.

Port markup faithfully. The design is signed off; this is a migration, not a redesign. With the
mockup's own markup and stylesheet now in place, "faithfully" means literally — copy the
`.html` file's structure, class names and inline styles, and substitute CMS content for its
hardcoded text/images/links, rather than reinterpreting the design into new class names.

## Mockup revision of 2026-09-19

The mockup gained a new brand asset set, a corridor map, and a second home page. What was
ported and where the port deliberately differs:

- **Home page follows `index-v2.html`**, not `index.html`: Discover, corridor map,
  working-group panel, value-chain "Challenges", Awards. The Discover tile cards are
  dropped; `home_discover` v5 removes them, leaving the intro. The old slider of illustrated
  challenges and the retired SVG coast map are gone; `home_challenges` v4 and `home_map` v3 migrate
  existing payloads, keeping any copy an admin edited.
- **`/corridor`** ([Corridor.astro](../src/views/Corridor.astro)) is the mockup's `corridor.html`
  minus the copy of the home page's Discover, Challenges and Awards bands it carries under the map.
  The map and asset table are one component, [CorridorSection.astro](../src/components/CorridorSection.astro),
  fed by `home_map`, so the home page and `/corridor` are edited together at `/admin/home`.
- **The map engine** is [corridor-map.js](../src/scripts/corridor-map.js). Geography (coordinates,
  route) stays in the script; names and popups are server-rendered so they are per-locale and escaped.
  Aerial tiles load from `services.arcgisonline.com`, so the reverse proxy's CSP needs
  `img-src ... https://services.arcgisonline.com https://server.arcgisonline.com` (the mockup's
  `netlify.toml` already has it).
- **The value-chain diagram** keeps its five stages, icons and order fixed
  ([ChainIcon.astro](../src/components/ChainIcon.astro)); only wording and the cards under each stage
  are editable. Its zoom view is a scaled clone of the live diagram ([vchain.js](../src/scripts/vchain.js)),
  not the mockup's static `water-value-chain.png`, which is Arabic-only and would go stale on the first edit.
- **Brand assets** (`logo-waterstrip-light/dark.png`, `mark-ws-*.svg`, `logo-mark.png`) replaced the old
  `*-waterstrip*.svg` set in `public/img/`. The mockup's `aria-label="SAFTA — …"` on the brand link and
  its `SAFTA` HTML comments look like a stray find-and-replace from the template this site was derived
  from and were not ported; the label stays `Water STRIP — …`.
- English (LTR) needed mirrored stage arrows and a left-anchored diagram scale, in
  [overrides.css](../src/styles/mockup/overrides.css).

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
