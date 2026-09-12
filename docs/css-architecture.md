# CSS architecture

All styling lives in [src/styles/](../src/styles/), organised as ITCSS-style layers of
increasing specificity, with [BEM](#bem) class names. Plain CSS — no preprocessor.

[src/styles/main.css](../src/styles/main.css) is the **only** file containing `@import`, and it
imports the layers in strict cascade order. Nothing else is an entry point; both
[Layout.astro](../src/layouts/Layout.astro) and [AdminLayout.astro](../src/layouts/AdminLayout.astro)
import `main.css` and nothing else.

```
src/styles/
  main.css
  1-settings/        layout.css  z-index.css
  2-design-tokens/   breakpoints.css  color.css  typography.css  motion.css
  3-generic/         reset.css
  4-elements/        typography.css  links.css  forms.css
  5-skeleton/        wrap.css  ribbon.css
  6-components/      button.css  eyebrow.css  lede.css  cta-circle.css
                     site-header.css  scroll-progress.css  drawer.css  site-footer.css
                     hero.css  tile.css  challenge-slider.css  awards.css
                     partners.css  about-banner.css
                     page-hero.css  breadcrumbs.css  section-head.css  split.css
                     stats.css  feature-grid.css  goal-grid.css
                     form.css  login-card.css
                     admin-bar.css  admin-nav.css  admin-shell.css  panel.css
                     item-list.css  editor.css
  7-utilities/       visually-hidden.css  text.css  state.css  reveal.css
  shame.css
```

## What goes in each layer

| Layer | Holds | Must not hold |
| --- | --- | --- |
| `1-settings` | Global layout config as custom properties: `--wrap-max`, `--wrap-pad`, `--bleed`, `--gap`, `--sec-pad`, `--header-h`, the `--z-*` scale | Any selector that paints |
| `2-design-tokens` | Brand palette and semantic aliases, `--g-brand`, font stacks, the type scale, easing and durations, the `@custom-media` breakpoints | Component-specific values |
| `3-generic` | `box-sizing`, margin reset, `img`/`button`/`ul` normalisation, reduced-motion | Anything branded — the moment a rule needs a token it belongs in `4-elements` |
| `4-elements` | Bare `h1`–`h4`, `p`, `a`, `input`, `label`, `button` | Any class selector |
| `5-skeleton` | Reusable layout objects: `.wrap`, `.ribbon` | Colour, type, anything cosmetic |
| `6-components` | One file per UI component, BEM | Anything another component needs — promote shared pieces down a layer instead |
| `7-utilities` | `.u-*` helpers and `.is-*` / `.has-*` states, `!important` allowed here and only here | Anything not intended as an override |
| `shame.css` | Documented hacks | Anything that fits a layer cleanly |

The rule that matters: **a layer may only depend on layers above it.** A component may use a
token; a token may never reference a component.

## BEM

```
.block            .login-card
.block__element   .login-card__title
.block--modifier  .button--solid
```

- One block per file, named after the file: `6-components/panel.css` defines `.panel`.
- Elements are one level deep. `.panel__facts__term` is a smell — it means the inner part wants
  to be its own block.
- Modifiers never appear alone in markup: always `class="button button--solid"`.
- States are the exception to BEM and live in `7-utilities`: `.is-active`, `.is-hidden`. A
  component styles its own state by keying off the shared class, e.g. `.admin-nav__link.is-active`.

Class names **deliberately differ from the mockup's.** The mockup is not BEM (`.btn-solid`,
`.login-shell`, `.field`); its markup is ported faithfully, its class names are not. Mapping so
far: `.btn-solid` → `.button--solid`, `.btn-pill` → `.button--pill`, `.login-shell` →
`.login-card`, `.field` → `.form__field`, `.crumbs` → `.breadcrumbs`, `.site-head` →
`.site-header`, `.page-hero--plain` → `.page-hero`.

## Breakpoints

Media queries cannot read custom properties, so breakpoints are `@custom-media` rules in
[2-design-tokens/breakpoints.css](../src/styles/2-design-tokens/breakpoints.css), resolved at
build time by `postcss-custom-media` ([postcss.config.mjs](../postcss.config.mjs)).

```css
@media (--bp-tab) { ... }      /* correct */
@media (max-width: 900px) { }  /* never write this */
```

The scale is `--bp-lap` 1150px, `--bp-tab` 900px (the main layout break), `--bp-phone` 480px,
plus `--bp-desk` (min-width: 901px) and `--motion-reduce`.

This works across every file because Vite `unshift`s `postcss-import` ahead of user plugins, so
`main.css` is fully inlined before `postcss-custom-media` runs. `breakpoints.css` is therefore
imported **first** in `main.css`, before `1-settings` — it emits no CSS itself, and `1-settings`
is responsive, so the declarations must already be in scope.

To confirm the transform is still working after a build:

```sh
grep -c '@custom-media --bp' dist/client/_astro/*.css   # must be 0
grep -o '@media[^{]*' dist/client/_astro/*.css | sort | uniq -c
```

The minifier rewrites `(max-width: 900px)` to the range syntax `(width<=900px)`. That is
expected, not a bug.

## RTL

The site is Arabic-only and renders `<html dir="rtl" lang="ar">`. **Author with logical
properties** — `margin-inline`, `padding-inline-start`, `inset-inline-start`, `border-inline-end`,
`text-align: start` — never `left`/`right`.

This is the one place the port improves on the mockup rather than copying it: `style.css` was
authored left-to-right and needs a whole `31. RTL` override section plus a `32. HOTFIXES` block
to undo itself. Written logically, this tree needs neither. If you find yourself reaching for a
`[dir="rtl"]` selector, there is almost certainly a logical property that does the job.

Latin runs inside Arabic prose (emails, URLs, the Water STRIP wordmark) need isolating, or the
bidi algorithm reorders punctuation: use the `.u-ltr` utility, or `--ltr` element modifiers such
as `.panel__detail--ltr`.

## Adding a component

1. Create `6-components/<block>.css` with a header comment saying what the block is for.
2. Add one `@import` to `main.css`, in the components group.
3. Use tokens for every colour, size and duration. A raw hex or a bare `z-index` in a component
   file is a bug — add a token instead.
4. Add responsive rules with `@media (--bp-*)` at the bottom of the same file, not in a separate
   responsive layer.

## shame.css

Last in the cascade, and the only place a hack is allowed. Every rule must carry a comment
saying what it fixes, why the proper fix was skipped, and what the proper fix is.

It is currently **empty**. If something lands there, treat it as a signal that a layer boundary
was wrong, and open the question of fixing the boundary rather than growing the file.
