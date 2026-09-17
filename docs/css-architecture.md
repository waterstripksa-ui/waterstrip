# CSS architecture

The public site and `/admin` are styled completely separately, on purpose (decided 2026-09-13,
after repeated pixel-parity drift — see below).

```
src/styles/
  admin.css            /admin's entry point — the only file besides mockup/style.css
                        that a layout imports directly
  mockup/
    style.css          vendored verbatim from waterstrip/assets/css/style.css — never edit
    overrides.css      the only public styling we author; mockup class vocabulary
  1-settings/          layout.css  z-index.css                — shared tokens, admin + mockup/*
  2-design-tokens/     breakpoints.css  color.css  typography.css  motion.css
  3-generic/           reset.css
  4-elements/          typography.css  links.css  forms.css
  6-components/        button.css  form.css  admin-bar.css  admin-nav.css  admin-shell.css
                       panel.css  item-list.css  image-field.css  editor.css  save-all-bar.css
  7-utilities/         visually-hidden.css  text.css  state.css
  shame.css
```

## Public pages: the mockup's own stylesheet

Public pages ([Layout.astro](../src/layouts/Layout.astro)) load
[public/mockup/style.css](../public/mockup/style.css) — the mockup's `assets/css/style.css`,
copied in **byte-for-byte** — plus [mockup/overrides.css](../src/styles/mockup/overrides.css) for
the small number of states the mockup never designed (a login error message, the skip link).
Behaviour is the mockup's own [main.js](../src/scripts/mockup/main.js), vendored with one
documented deviation (§15 FORMS, since login posts for real), running against self-hosted
GSAP/Lenis instead of the mockup's CDN copies.

**Why:** an earlier attempt re-authored `style.css` into this project's own BEM/ITCSS layers,
porting each component by hand. `style.css` is ~3,500 lines of stacked overrides — many
components (the hero especially) are redefined five or six times over the file, and each
redefinition wins by *appearing later*, not by higher specificity. Reading the source and
re-implementing "the same rule" reliably missed whichever override actually won, and every fix
uncovered another (hero scrim, hidden slide label, drawer width, page-hero padding, …). The
project owner decided the cost of maintaining a hand-authored equivalent wasn't worth it: **use
the mockup's CSS and markup directly**, and get parity by construction instead of by chasing it.

**Public pages therefore write mockup markup, not BEM.** Every `.astro` file under
`src/views/` (and the few public pages left in `src/pages/`, other than `admin/`) uses the mockup's own class names and structure verbatim —
`.btn-solid`, `.site-head`, `.mcard`, `.wgp__stat`, etc. — with CMS content substituted for the
mockup's hardcoded text, images and links. Copy `waterstrip/<page>.html`'s `<main>` (and its
`?id=`-filled sections' *rendered* output, for the pages that build markup client-side — see
below) when porting or touching a page; do not invent new class names or re-derive the mockup's
CSS from first principles.

**Rules for touching public markup:**
- Match the mockup's structure and class names exactly, including inline `style="…"` attributes
  it uses for one-off tweaks — these are load-bearing, not accidental.
- Never edit `waterstrip/` or `public/mockup/style.css`. A public style change belongs in
  `mockup/overrides.css`, written in the mockup's class vocabulary, with a comment saying what
  state it covers that the mockup never had.
- Several mockup pages (`technologies`, `working-group`, `members`/`member`, `media`, `article`)
  build their markup **client-side** from a `window.WSTRIP_*` data global (`wg-data.js`,
  `article-data.js`, `events-data.js`) via a `main.js` module keyed to an `?id=` query param.
  These data files are **never shipped** — the corresponding `.astro` page renders that exact
  same output HTML *server-side* from the CMS/database instead, so the guarded `main.js` module
  (`if (!window.WSTRIP_X) return`) stays inert. When changing one of these pages, find its
  `main.js` section (search for the `id="..."` the mockup's JS targets) and match its template
  string precisely, not just the static HTML shell.
- Asset paths change from `assets/img/…` to `/img/…`, and `*.html?id=x` links become the port's
  real routes (`/working-group/x`, `/member/x`, `/article/x`).
- Logical-properties/RTL rules below still apply to anything in `overrides.css`.

## `/admin`: this project's own layered CSS

`/admin` was never part of the mockup, has its own design (dense, functional, not
brand-marketing), and must never accidentally inherit public styling. It keeps the original
ITCSS-style layering described below, entered through
[admin.css](../src/styles/admin.css) — imported only by
[AdminLayout.astro](../src/layouts/AdminLayout.astro). Nothing else is an admin entry point.

### What goes in each layer

| Layer | Holds | Must not hold |
| --- | --- | --- |
| `1-settings` | Global layout config as custom properties: `--wrap-max`, `--wrap-pad`, `--bleed`, `--gap`, `--sec-pad`, `--header-h`, the `--z-*` scale | Any selector that paints |
| `2-design-tokens` | Brand palette and semantic aliases, `--g-brand`, font stacks, the type scale, easing and durations, the `@custom-media` breakpoints | Component-specific values |
| `3-generic` | `box-sizing`, margin reset, `img`/`button`/`ul` normalisation, reduced-motion | Anything branded — the moment a rule needs a token it belongs in `4-elements` |
| `4-elements` | Bare `h1`–`h4`, `p`, `a`, `input`, `label`, `button` | Any class selector |
| `6-components` | One file per admin UI component, BEM | Anything another component needs — promote shared pieces down a layer instead |
| `7-utilities` | `.u-*` helpers and `.is-*` / `.has-*` states, `!important` allowed here and only here | Anything not intended as an override |
| `shame.css` | Documented hacks | Anything that fits a layer cleanly |

The rule that matters: **a layer may only depend on layers above it.** A component may use a
token; a token may never reference a component. `1-settings`/`2-design-tokens` are shared with
the public mockup styling (breakpoints, colour, typography, motion, z-index, layout) since both
sides need the same brand tokens and the same `--bp-*` custom-media scale — but the components
in `6-components/` here are admin-only (`admin-bar`, `admin-nav`, `admin-shell`, `panel`,
`item-list`, `image-field`, `editor`, `save-all-bar`, plus `button`/`form` for the editor forms).

### BEM

```
.block            .admin-nav
.block__element   .admin-nav__link
.block--modifier  .button--solid
```

- One block per file, named after the file: `6-components/panel.css` defines `.panel`.
- Elements are one level deep. `.panel__facts__term` is a smell — it means the inner part wants
  to be its own block.
- Modifiers never appear alone in markup: always `class="button button--solid"`.
- States are the exception to BEM and live in `7-utilities`: `.is-active`, `.is-hidden`. A
  component styles its own state by keying off the shared class, e.g. `.admin-nav__link.is-active`.

### Adding an admin component

1. Create `6-components/<block>.css` with a header comment saying what the block is for.
2. Add one `@import` to `admin.css`, in the components group.
3. Use tokens for every colour, size and duration. A raw hex or a bare `z-index` in a component
   file is a bug — add a token instead.
4. Add responsive rules with `@media (--bp-*)` at the bottom of the same file, not in a separate
   responsive layer.

## Breakpoints

Media queries cannot read custom properties, so breakpoints are `@custom-media` rules in
[2-design-tokens/breakpoints.css](../src/styles/2-design-tokens/breakpoints.css), resolved at
build time by `postcss-custom-media` ([postcss.config.mjs](../postcss.config.mjs)). This applies
to `admin.css` and `mockup/overrides.css` — never to `mockup/style.css`, which is untouched and
carries its own literal `max-width`/`min-width` breakpoints exactly as the mockup wrote them.

```css
@media (--bp-tab) { ... }      /* correct, in admin.css / overrides.css */
@media (max-width: 900px) { }  /* never write this in our own files */
```

The scale is `--bp-lap` 1150px, `--bp-tab` 900px (the main layout break), `--bp-phone` 480px,
plus `--bp-desk` (min-width: 901px) and `--motion-reduce`.

This works because Vite `unshift`s `postcss-import` ahead of user plugins, so `admin.css` is
fully inlined before `postcss-custom-media` runs. `breakpoints.css` is therefore imported
**first**, before `1-settings` — it emits no CSS itself, and `1-settings` is responsive, so the
declarations must already be in scope.

To confirm the transform is still working after a build:

```sh
grep -c '@custom-media --bp' dist/client/_astro/*.css   # must be 0
grep -o '@media[^{]*' dist/client/_astro/*.css | sort | uniq -c
```

The minifier rewrites `(max-width: 900px)` to the range syntax `(width<=900px)`. That is
expected, not a bug.

## RTL

Arabic pages render `<html dir="rtl" lang="ar">`; English pages under `/en` render
`<html dir="ltr" lang="en">` from the same markup (see [i18n.md](i18n.md)). The dashboard is
always RTL.

**In `admin.css` and `mockup/overrides.css`, author with logical properties** —
`margin-inline`, `padding-inline-start`, `inset-inline-start`, `border-inline-end`,
`text-align: start` — never `left`/`right`. If you find yourself reaching for a `[dir="rtl"]`
selector there, there is almost certainly a logical property that does the job instead.

**`mockup/style.css` is the one exception**, because it is never edited: it was authored
left-to-right and undoes itself with its own `31. RTL` override section plus a `32. HOTFIXES`
block. That is what lets the English pages run `dir="ltr"` with no new CSS. An LTR-only defect
goes in `overrides.css` under `[dir="ltr"]`. Do not "fix" either direction by editing the
vendored file — it is intentionally kept byte-identical to the mockup.

Latin runs inside Arabic prose (emails, URLs, the Water STRIP wordmark) need isolating, or the
bidi algorithm reorders punctuation: the mockup uses `.u-ltr`; match it in overrides.

## shame.css

Last in the cascade (loaded by `admin.css` only), and the only place a hack is allowed. Every
rule must carry a comment saying what it fixes, why the proper fix was skipped, and what the
proper fix is.

It is currently **empty**. If something lands there, treat it as a signal that a layer boundary
was wrong, and open the question of fixing the boundary rather than growing the file.

## Judging pixel parity against the mockup

If you're checking whether a public page still matches `waterstrip/<page>.html`: since the page
now *is* the mockup's markup against the mockup's own stylesheet, a real difference means either
a markup slip (a class name, an attribute, an inline `style=`) or CMS content that differs from
`content/seed.json`. There is no cascade-ordering pitfall to reason about anymore — that was the
entire reason for this architecture. Compare computed styles/screenshots in a real browser at a
few widths if in doubt (font rasterisation and any frozen media are the only expected noise), and
remember the mockup needs its real Google Fonts request unblocked, or its own text metrics shift.
