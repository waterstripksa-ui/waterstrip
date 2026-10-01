# Porting the CMS to SAFTA

The plan for replacing SAFTA's dashboard and content store with the system this repo uses, while
keeping all of SAFTA's existing content. It has three parts: what differs between the two projects
today, the decisions already made, and the work plan.

The SAFTA project is at `../safta` (`/home/hazel/projects/safta`). Work is planned from this repo,
but the code changes land in SAFTA's repo.

> **Status (2026-10-01):** Phases 1 and 2 done in SAFTA; the legacy key map is written
> ([safta-key-map.md](safta-key-map.md)). Next: Phase 3. Update the
> [progress log](#progress-log) at the end as phases land.

## Constraints and decisions

- **No monorepo or shared package.** The two organisations receive their source code separately,
  so waterstrip's CMS is **copied into SAFTA once and maintained there on its own**. Neither repo
  may depend on the other. Record the waterstrip commit the copy was taken from in SAFTA's docs, so
  later fixes can be carried across by hand.
- **Keep all existing content.** Every text field, collection record and uploaded image in SAFTA's
  production `content/` and `public/uploads/` must come through. A re-runnable import script does
  this (see [Phase 4](#phase-4--legacy-import)).
- **SAFTA features that go away, agreed:** site-wide field search, the preview modal (Arabic/English,
  desktop/mobile), per-field "reset to original", and drafts that survive closing the browser
  (localStorage). None of them is rebuilt.
- **The members map reads coordinates from member records.** Add `lat`/`lng` (plus city and country)
  to the `member` table, editable in the dashboard, and fill them from SAFTA's
  `members-map-data.js`. See [Members map](#members-map).
- **One admin account, seeded from `.env` on first launch.** Use waterstrip's
  [seed-admin.ts](../scripts/seed-admin.ts) as is: it creates the admin if it is missing, promotes
  it if it exists without the admin role, and **never rewrites the password** after that. Public
  sign-up stays disabled.
- **The public site does not change in this port.** URLs, markup, the vendored CSS and SAFTA's
  client-side language switching all stay. Only the source each value is read from changes. See
  [Phase 3](#phase-3--point-public-pages-at-the-cache).

The rules this repo's [AGENTS.md](../AGENTS.md) sets for the CMS apply to SAFTA once ported:
admins edit content but never structure, SQLite only, every read goes through the cache and every
write through the repository, an image field holds a media id, and uploads go outside `public/`.

---

## Findings: how SAFTA differs today

SAFTA and waterstrip were built from the same agency template, so the public sites look and behave
much alike. The systems underneath do not. SAFTA is a static bilingual mockup with a CMS added
later. Waterstrip was rebuilt with a database and a typed content model.

### Public UI

| | SAFTA | waterstrip |
|---|---|---|
| Brand | Green (`#015C44`, `#63BD69`); Inter, Space Grotesk and IBM Plex Sans Arabic from Google Fonts | Blue (`#154A91`, `#2FB2DC`); Tajawal and IBM Plex Sans Arabic, self-hosted through fontsource |
| Stylesheet | `public/assets/css/style.css`, about 3,300 lines, same class vocabulary | `public/mockup/style.css`, about 3,800 lines, never edited; fixes go in `overrides.css` |
| URLs | `/en/...` and `/ar/...`; the bare `/` redirects with JS (localStorage, then browser language) | Arabic at `/`, English under `/en`, with `hreflang` alternates |
| Language rendering | **The server always sends English.** Arabic sits in `data-ar` and `assets/js/i18n.js` swaps it in. Without JS, `/ar` shows English | The server sends the right language, through `localizer` |
| Records | `?id=` query strings. **An unknown id shows the first record** instead of a 404 | `/article/[slug]` and others, with a real 404 |
| 404 page | English only | Both languages |
| Scripts | GSAP and Lenis from a CDN; global scripts that must load in a fixed order (`content/<page>.js → cms.js → i18n.js → main.js`) | GSAP and Lenis bundled from npm |

**Pages:** SAFTA has index, about, technologies, members, member, media, article, contact,
register-interest, login, forgot-password, terms, privacy, cookies, accessibility, sitemap and 404.
It has no corridor or reports page and no working-group detail page; the detail page was deleted.

**Section differences:**
- **Home:** hero (3 slides) → Discover (2 tiles) → challenges slider → Awards (5 fixed
  categories) → partner logo strip. No corridor map and no working-groups panel.
- **About:**
  - The video is a YouTube embed from a link the admin pastes; the block is hidden when the link is
    blank.
  - "At a glance" is hidden with a hardcoded `hidden` attribute.
  - "Four roles" and the national challenges come from collections. The challenges are shared with
    the home page.
- **Member profile:** "Areas of collaboration" and `info@safta.sa` are the same on every member's
  page.
- **Hero buttons:** the link targets are fixed in the markup.
- **Not editable at all:** the legal pages, sitemap, footer, drawer, join banner, and the partner
  strip's label and note.

### Content and storage

| | SAFTA | waterstrip |
|---|---|---|
| Store | `content/*.json` (gitignored), read with an mtime cache, written by temp file + rename | SQLite through Drizzle; JSON only for import and export |
| Page copy | One flat map per page. Keys are positional and generated from the original Arabic text, e.g. `t005-معرفة-تطبيقية-تدعم-قرارات-` | Named singletons, each with a hand-written Zod schema |
| Field shape | Text is `{en, ar}`, both filled in; page images are `{src, alt, alt_ar}` | `xAr` required, `xEn` optional (falls back to Arabic) |
| HTML | **Every text field renders with `set:html`.** Rich fields are sanitized in the browser only | No free-form HTML; legal prose uses a small markdown-like syntax |
| Collections | `groups`, `articles`, `events`, `members`, `roles`, `partners`, `challenges`, each an object keyed by id | Tables with `slug`, `order` and `published`; short lists live inside singletons |
| Ordering and drafts | JSON key order only; no reordering; no unpublished state | Move up/down and a `published` flag on each record |
| Images | Path strings (`uploads/...` or `assets/img/...`). Collection images have no alt text, and the Arabic alt text on pages is never rendered | Media id plus alt text in both languages on the media row |
| Schema source | Generated **from `public/admin/schema.js`** by `scripts/generate-*-schema.mjs`. Validation is `.strict()` and every key is required | Hand-written in `src/lib/content/schemas/` |
| Schema changes | No version number. Drift between the schema and the live JSON makes **every save to that page fail with a 400**. Fixed with one-off scripts (`check-schema-drift`, `prune-orphan-keys`, `migrate-about-youtube`) | `schema_version` plus migration steps, applied on every start |
| Backup | `.bak` files written by the repair scripts; no export | `content:export` / `content:import` |
| Site settings | `content/settings.json`, holding only `hideAwards` | A `hidden` field inside each singleton (`home_awards`, `about_glance`) |

**Leftover legacy parts in SAFTA:**
- `technologies` and `article` still load their page text through `assets/content/*.js` and the
  client-side `cms.js`. So `content/technologies.json` and `content/article.json` are never read, and
  editing those views opens a "download the file and commit it" dialog.
- `content/working-group.json` is left over from the deleted detail page.
- The README is out of date: it still calls articles a fixed set of 7, but they can now be added and
  deleted.

### Dashboard

| | SAFTA | waterstrip |
|---|---|---|
| Shape | One page, `/admin`, running an old-style JS app from `public/admin/` (`admin.js`, `schema.js`, `baseline.js`, about 1,300 + 74 KB + 57 KB) | One Astro page per site page, each made of React panels |
| Editor UI | Built generically from `schema.js`: sections → cards → fields. The field label is usually the original Arabic text | A hand-built editor per section, using shared field components |
| Saving | One "Save & Publish" for the whole site; posts the **entire** page or collection | Saved per section (PUT per singleton), plus a "Save All" bar for the page |
| Validation feedback | The first Zod error, as plain text in a toast | Errors tied to individual fields |
| Concurrency | The revision header is checked only when the dashboard loads; a stale draft is discarded | Last write wins |

**Add/delete rules per collection in SAFTA:** `groups`, `articles`, `roles`, `partners` and
`challenges` can be added to and deleted from. `members` and `events` can be added to, but a
published record can't be deleted. The number of article paragraph and tag slots is fixed per
record by `schema.js`, and a new article copies the first article's slots, so **paragraphs can't be
added**.

**Uploads:**

| | SAFTA | waterstrip |
|---|---|---|
| Limit and types | 3 MB; any `image/*` including SVG, judged by the declared MIME type | 8 MB, judged by the file's bytes; SVG refused |
| Processing | None; original bytes, EXIF kept | sharp → WebP, EXIF stripped, long edge capped |
| Location and name | `public/uploads/`, named with a timestamp plus the cleaned filename | `data/uploads/`, named by content hash |
| Cleanup | Old files deleted when replaced | None yet |

**Auth and security:**

| | SAFTA | waterstrip |
|---|---|---|
| Accounts | **One** username plus scrypt hash from `.env` | Better Auth with users in SQLite and roles |
| Sessions | An in-memory Map: a restart logs everyone out; 30 min idle, 8 h maximum | Stored in the database |
| Login page | The public, bilingual "Members login" page at `/en/login` and `/ar/login` | Arabic-only `/login` |
| CSRF | `checkOrigin: false`; relies only on a `SameSite=strict` cookie | Astro's origin check on |
| Known bug | Vite's dotenv expansion can silently cut `ADMIN_PASSWORD_HASH` short (documented in SAFTA's README, never fixed). Goes away with this port | — |

### SAFTA's current data

Counted from the local `content/` (production may differ, so recount against the snapshot):

| File | Entries | | File | Entries |
|---|---|---|---|---|
| `index.json` | 40 fields | | `groups.json` | 9 records |
| `about.json` | 28 fields | | `articles.json` | 7 records |
| `contact.json` | 60 fields | | `events.json` | 4 records |
| `register-interest.json` | 44 fields | | `members.json` | 12 records |
| `member.json` | 16 fields | | `roles.json` | 4 records |
| `media.json` | 15 fields | | `partners.json` | 7 records |
| `members-page.json` | 6 fields | | `challenges.json` | 7 records |
| `technologies.json` | 7 fields (never read) | | `working-group.json` | 12 fields (orphaned) |
| `article.json` | 5 fields (never read) | | `settings.json` | `hideAwards` (may not exist) |

Only **8 strings contain HTML**: 4 required-field markers (`<b class="req">*</b>`) in
`contact.json`, the consent line with two links in `register-interest.json` (both languages), and
the "Source:" note in `technologies.js` (both languages). 22 more contain `&amp;` or `&nbsp;`. The
local copy has no files in `public/uploads/`; **every image in use is a bundled `assets/img/` file**,
including all member and partner logos (9 of the 12 member logos are SVG). Production may have
uploads too.

---

## Work plan

### Phase 1 — Infrastructure and auth

Copy from waterstrip into SAFTA. Change the imports to explicit `.ts` and drop anything
waterstrip-specific.

- `src/db/` (`index.ts`, the generated `schema.ts`, and a `content-schema.ts` that starts with only
  `content_singleton` and `media`), `drizzle.config.ts`, a fresh `drizzle/` migration history.
- `src/lib/env.ts`, `src/lib/auth.ts`, `src/middleware.ts`, `src/env.d.ts`.
- `scripts/seed-admin.ts` unchanged, and the `setup` / `dev` / `start` npm scripts.
- `src/pages/api/login.ts`, `api/logout.ts`, `api/auth/[...all].ts`.
- Dependencies: `better-sqlite3` (with `allowScripts`), `drizzle-orm`, `drizzle-kit`,
  `better-auth`, `@better-auth/drizzle-adapter`, `@astrojs/react`, `react`, `react-dom`, `sharp`,
  `@astrojs/check`.
- Turn Astro's CSRF origin check back on (remove `security.checkOrigin: false`).

**Environment change.** `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` are replaced by
`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_NAME`
(optional), plus `DATABASE_PATH` and `UPLOAD_PATH`. `ADMIN_PASSWORD` is read only to create the
account on first launch; changing it afterwards does nothing. The session timeout variables go away.

**Login.** Keep the public bilingual page at `/en/login` and `/ar/login`, but post it to
`/api/login`. The middleware's redirect target changes to `/en/login`. The login page's markup is
public UI and stays as it is.

Done when: `npm run dev` on a clean checkout migrates, seeds the admin from `.env`, and `/admin`
needs a login; a second start leaves the admin untouched; `npx astro check` is clean.

### Phase 2 — Content core and the dashboard

- Copy `src/lib/content/` (`cache`, `repo`, `migrate`, `media`, `media-paths`, `io`),
  `schemas/fields.ts`, `schemas/types.ts`, `schemas/add-en-fields.ts` (not needed at first),
  `src/lib/prose.ts`, `scripts/content.ts`, `scripts/migrate-content.ts`,
  `src/pages/media/[file].ts` and `src/pages/admin/api/media/index.ts`.
- Copy the dashboard shell: `AdminLayout.astro`, `AdminBar.astro`, `components/admin/fields/*`,
  `ItemList`, `SaveAllBar`, `editorRegistry`, `useSingletonEditor`, `useCollectionEditor`, and the
  whole layered `src/styles/` admin stylesheet (rebrand the colour tokens to SAFTA green).
- Write SAFTA's own schemas, editors and admin pages from the [target model](#target-content-model),
  one page at a time in this order: home, about, members/member, media/article, technologies,
  contact, register-interest, settings.
- The legal pages, footer and join banner are later additions (see
  [After cutover](#after-cutover)), not part of this phase.

Done when: each admin page saves and loads every field of its sections, and a broken save marks the
right field.

**As built (differs from the bullets above):**
- **No hand-written editor per section.** Each panel is declared as data in SAFTA's
  `src/components/admin/sections.ts` (a fixed list of typed fields with labels) and drawn by one
  renderer, `FieldList.tsx`. Admins still edit values only. `npm run check:admin` compares every
  panel with its Zod schema both ways. Waterstrip's `SectionForm`, `ItemList`, field components and
  hooks are used as they are.
- **The legacy dashboard moved to `/admin/legacy`** (page and APIs), because waterstrip's
  `/admin/api/content/[key]` and `/admin` collide with its routes. It stays the live editor until
  Phase 3, and every new dashboard page carries a notice saying so; remove the notice in Phase 3.
- **Collections save with their order.** The server sets `order` from list position. Waterstrip had
  the bug this avoids (moving a row was lost on reload) and got the same fix in its four collection
  endpoints.
- **Collection saves check images exist** (`replace*(rows, { requireMedia: true })` from the
  dashboard; the import still tolerates dangling ids), like singleton saves.
- **No settings page.** `home_awards.hidden` and `about_glance.hidden` sit in their own panels.
- **No `content:seed`.** `content/` is still the legacy store. A fresh database starts from each
  singleton's `initial` (SAFTA's current text, images `null`); the tables stay empty until Phase 4.

### Phase 3 — Point public pages at the cache

Swap where each value comes from, without changing the markup.

- Change `Text.astro`, `Image.astro` and `Value.astro` to take values instead of content keys,
  keeping the `data-ar` output `i18n.js` expects:

  ```astro
  <!-- before --> <Text as="h1" key="t005-…" field={c.text("t005-…")} />
  <!-- after  --> <Text as="h1" field={{ en: hero.panels[0].headingEn, ar: hero.panels[0].headingAr }} />
  ```

  English must fall back to Arabic when blank, since `xEn` is optional now. Put that fallback in the
  component, not in each page.
- `Text.astro` stops rendering with `set:html`. Plain fields render as text; the prose fields
  render through `prose.ts`.
- Images: `Image.astro` resolves a media id to `/media/<hash>.webp`, or to the placeholder art from
  a new `src/lib/safta-assets.ts` (the counterpart of `home-assets.ts`) when the id is `null`.
- Drop `data-cms` and `data-cms-img`; only the old preview used them.
- `technologies.astro` and `article.astro` stop loading `assets/content/*.js` and `cms.js`.
- `BaseLayout` and the drawer read `home_awards.hidden` instead of `settings.json`.
- **URLs stay as they are.** If slug routes are added (`/en/article/<slug>`), the old
  `?id=` URLs must redirect to them. Until then, an unknown `?id=` should return a 404 instead of
  showing the first record.

Done when: every public page renders the same text and images as before the port, in both
languages, from the database.

### Phase 4 — Legacy import

`scripts/import-legacy.ts` in SAFTA, kept until the switch is done. It reads `content/*.json`,
`content/settings.json`, `public/uploads/` and `public/assets/js/members-map-data.js`, builds the
same envelope `content:export` writes, and hands it to the existing import with `--dry-run`
supported.

- **Page text:** the explicit mapping in [safta-key-map.md](safta-key-map.md), from each legacy key
  to its new field path (`index:t005` → `home_hero.panels[0].heading`). `en` goes to `xEn` and `ar`
  to `xAr`. **Fail on any legacy key that isn't mapped, and on any required field nothing fills**, so
  a forgotten field can't silently disappear.
- **Collections:** records become rows. The record id becomes `slug`, the JSON key order becomes
  `order`, and `published` is set to `true`.
- **HTML:** decode entities everywhere; strip the required-field markers (the markup renders
  them); convert the consent line and the source note to prose. Fail on any other tag. Details in
  the key map.
- **Images:** every non-empty path, `uploads/...` **and** `assets/img/...`, goes through
  `ingestImage` and gets a media id; only empty paths become `null`. Bundled SVGs from SAFTA's own
  repo are rasterized by the import first; SVG *uploads* are still refused and listed for someone to
  convert by hand. Alt text: page images use their stored `alt` / `alt_ar`; collection images use
  the record's name. (This replaces the earlier "`assets/img` → `null`" idea, which would have lost
  every logo. See [safta-key-map.md](safta-key-map.md#images).)
- **Settings:** `hideAwards` becomes `home_awards.hidden`.
- **Known content fixes** (such as the stray `kuyiky` in the Arabic contact title) come from an
  explicit `FIXES` list that applies only when the old value still matches.
- **Members map:** see below.
- **Dropped on purpose:** `technologies.json` and `article.json` (the live text for those pages is in
  `public/assets/content/{technologies,article}.js`, so read it from there), `working-group.json`,
  the 12 orphaned news-card keys in `media.json`, the article `ph` flag (a dashboard label only), and
  the member `short` field (English only, never rendered).

The script must be idempotent and run cleanly against a copy of production before cutover.

### Members map

`members-map-data.js` holds 12 records whose ids match the `members` collection exactly, each with
`lat`, `lng`, `city`/`city_ar` and `country`/`country_ar`.

- Add `lat` and `lng` (nullable real numbers), `cityAr`/`cityEn` and `countryAr`/`countryEn` to the
  `member` table. Validate the ranges (−90..90, −180..180). A member without coordinates is left off
  the map. Add the fields to the member editor.
- The import fills them from `members-map-data.js`, matched by id.
- **The map is not on the page today.** `members.astro` loads Leaflet and the data file, but the
  `#membersMap` container was never in the markup, so `main.js` (module 13) never draws anything. The
  `.memmap*` classes still exist in `style.css`. Rebuild the container from those classes, render the
  marker data from member rows into the page server-side, and replace the `SAFTA_CRM` adapter with
  that data. The CRM adapter (a placeholder for a live CRM API) is dropped.
- The map's category colours key off the English category (`Government`, `Academic`,
  `Private sector`, `Non-profit`), and so do the filter chips. Make the category a fixed set of
  values instead of free text, or the chips and colours break as soon as someone types a variant.

### Phase 5 — Cutover

1. Freeze editing in production.
2. Copy production `content/` and `public/uploads/` (keep them; this is the rollback).
3. Run `import-legacy.ts --dry-run`, then for real, against a fresh database.
4. Compare every public page against the old site, in both languages.
5. Deploy. The reverse proxy must keep `/media/` and the 8 MB body limit (see
   [content-storage.md](content-storage.md#serving)).

### Phase 6 — Cleanup

Delete `public/admin/`, `public/assets/content/`, the `public/assets/js/*-data.js` files,
`assets/js/cms.js`, `src/lib/content/{store,json-file,settings}.ts`, `schema/` and `collections/`,
`src/lib/auth/`, `src/pages/admin/api/{content,collection,schema,settings,uploads}`,
`src/pages/uploads/`, `src/pages/logout.ts`, and the scripts `generate-*`, `prune-*`, `seed-*`,
`check-schema-drift`, `migrate-about-youtube`, `test-collections`, `hash-password` and `lib/`.
Rewrite SAFTA's README, and add the docs (architecture, content storage, i18n) adapted from this
repo's.

### After cutover

Content that is hardcoded today and can become singletons later, seeded from the current markup:
the legal pages (as waterstrip's `legal_*`), the footer and social links (`footer_social`), the
join banner, the partner strip's label and note, hero button links, the member page's contact email,
and "At a glance" with a `hidden` flag. Moving the public site to server-rendered language is also
optional and separate.

---

## Target content model

The summary. The field-level version is [safta-key-map.md](safta-key-map.md), which wins where the
two differ. Field names follow this repo's conventions; every text field is an `xAr`/`xEn` pair.

| Legacy source | Target | Notes |
|---|---|---|
| `index` hero: 3 images, 3 × eyebrow/heading/button label, 3 tab labels | `home_hero` | `panels` fixed at 3; add `ctaHref` (default to the current targets) |
| `index` section-2 | `home_discover` | intro plus 2 fixed tiles, each with an image |
| `index` challenges header | `home_challenges_intro` | items live in `challenges` below |
| `index` awards | `home_awards` | `hidden` from `settings.json`; the 5 categories become a list (max 12) |
| `partners` collection plus the strip's label | `home_partners` | list with `logoId`, `name`, `url` |
| `challenges` collection | `challenges` singleton | list (title, description, image); read by home and about |
| `about` sections | `about_hero`, `about_mission` (including `youtubeUrl`), `about_glance` (`hidden: true`), `about_roles_intro`, `about_challenges_intro`, `about_founding_statement` | |
| `roles` collection | inside `about_roles` | list, max 8 |
| `technologies` page text | `technologies_banner`, `technologies_intro` | the source note becomes prose |
| `groups` collection | `working_group` table | only SAFTA's 5 fields: name, scope, image, number, challenge category |
| `media` page text | `media_banner` | |
| `articles` collection | `article` table | `blocks` becomes a real list, so paragraphs can be added |
| `article` page text | `article_chrome` | breadcrumbs and back/register button labels |
| `events` collection | `event` table | `link` → `href`, validated like the current `safeHref` |
| `members-page` | `members_banner`, `members_intro`, `members_map` | `members_map` text is new |
| `members` collection plus map data | `member` table | adds `lat`, `lng`, city, country, and a fixed category |
| `member` page text | `member_chrome` | fact labels, collaboration list, contact block |
| `contact` | `contact_hero`, `contact_form`, `contact_info` | required markers move into the markup; select options are a fixed set |
| `register-interest` | `register_hero`, `register_form`, `register_info` | the consent line becomes prose; form labels stay content |

## Risks

- **Production data differs from the local copy.** Its keys may have drifted (the README documents
  this happening). The import must fail on unknown keys rather than guess; run it against the
  snapshot well before cutover.
- **SVG logos.** Partner and member logos may be SVG uploads, which the media pipeline refuses.
  The import lists them; they need converting to PNG or WebP by hand.
- **The `ar`-is-required rule.** Any record with an empty Arabic value fails validation on import.
  The dry run will show where; fill those in from the English before cutover.
- **Session loss at cutover.** All admin sessions end. Expected and harmless with one admin.

## Progress log

| Date | Phase | Notes |
|---|---|---|
| 2026-10-01 | — | Plan written. |
| 2026-10-01 | 1 | Done, from waterstrip `dcfba70`. Better Auth + SQLite + Drizzle, `seed-admin.ts` unchanged, `content_singleton` and `media` tables, migration `0000_init`. Login stays at `/{en,ar}/login` (now **email**, not username) posting to `/api/login`; CSRF check back on. The legacy dashboard keeps working: its APIs were only ever gated by the middleware, and `/logout` now delegates to `/api/logout`. `src/lib/auth/` and `hash-password` removed. Also: `data/` is created on first run (waterstrip lacks this), and 6 static pages got the missing `isLocale` guard so `astro check` is clean. Review fix: `security.allowedDomains` is derived from `BETTER_AUTH_URL` at build time; without it the re-enabled origin check 403s every login behind a TLS-terminating proxy (why SAFTA had turned it off in `93f55d1`). |
| 2026-10-01 | 2 | Done, from waterstrip `9526700`. 26 singletons (version 1, initial = current text) and the `member`, `working_group`, `article`, `event` tables (migration `0001_collections`). Seven dashboard pages built from `sections.ts`; see "As built" under Phase 2. Tested: `astro check` clean, `check:admin` passing, every save path over HTTP (field-level issues, unknown media, fixed options, YouTube, duplicate slugs), and a browser run (edit/save/reload, add and reorder a member, upload a logo). |
| 2026-10-01 | 4 (prep) | Key map written: all 221 page keys accounted for (202 mapped, 19 dropped with reasons). Changed the image rule to import bundled `assets/img` files. |
