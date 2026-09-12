# Water STRIP

Astro site for **شريط شراكات الابتكار المائي / Water STRIP** — a Saudi water-innovation
initiative. Two things are being built:

1. The public site, ported **incrementally** from the finished static mockup in [waterstrip/](waterstrip/).
2. An authenticated **CMS dashboard** at `/admin` so staff can edit site content.

Arabic-only, RTL (`<html dir="rtl" lang="ar">`). Deploys to a self-managed VPS.

> `CLAUDE.md` is a symlink to this file — edit `AGENTS.md`, never replace the symlink.

## Hard rules

- **Admins edit content, never structure.** The CMS must not let an admin change layout,
  swap components, or reorder sections. Model each editable surface as a *fixed, typed
  set of fields* — never a block/page builder. See [docs/porting-the-mockup.md](docs/porting-the-mockup.md#content-model-rules).
- **No new infrastructure.** SQLite on local disk, everything server-side. Do not
  introduce a hosted DB, an external auth provider, or a SaaS CMS without asking.
- **Never edit [waterstrip/](waterstrip/).** It is the read-only design reference.
- **Public sign-up is disabled.** Accounts are seeded or admin-created.

## Commands

```sh
npm run dev              # migrate + seed, then astro dev
npm run dev -- --host    # ...exposed on the network
npm run build            # production build (node adapter, standalone)
npm start                # migrate + seed, then serve dist/
npm run db:generate      # drizzle-kit: schema.ts -> drizzle/*.sql
npm run db:migrate       # apply migrations
npm run db:seed          # create/promote the .env admin (idempotent)
npx astro check          # typecheck — must stay clean
```

Background dev server: `astro dev --background`, then `astro dev stop | status | logs`.
Note that bare `astro dev` skips migrations and seeding; prefer `npm run dev`.

Copy [.env.example](.env.example) to `.env` before anything else. `.env` and `data/` are gitignored.

## Gotchas that will bite you

- **Use explicit `.ts` extensions** in imports under `src/lib/`, `src/db/`, and `scripts/`.
  [scripts/seed-admin.ts](scripts/seed-admin.ts) runs under plain Node, which — unlike Vite —
  resolves neither directory nor extensionless imports.
- **Env comes from `process.env`**, via [src/lib/env.ts](src/lib/env.ts) — not `import.meta.env`,
  which does not exist outside Astro.
- **Astro's CSRF origin check is on.** Form POSTs without an `Origin` header get a 403.
  Browsers are fine; `curl` needs `-H "Origin: http://localhost:4321"`.
- **Better Auth 1.7.x differs from most tutorials online.** Before writing auth code, read
  [docs/better-auth.md](docs/better-auth.md) — the Drizzle adapter is a separate package and the
  CLI was renamed.
- **[src/db/schema.ts](src/db/schema.ts) is generated** for the auth tables. Regenerate rather
  than hand-editing them; see [docs/better-auth.md](docs/better-auth.md#regenerating-the-schema).
- **`better-sqlite3` needs its install script allowed** — this repo pins `allowScripts` in
  [package.json](package.json). After a fresh `npm ci`, run `npm rebuild better-sqlite3` if the
  native binding fails to load.
- **[tsconfig.json](tsconfig.json) excludes `waterstrip/` and `drizzle/`** so the mockup's
  vendored JS does not pollute `astro check`.
- **CSS goes in the right layer, never at the bottom of an existing file.**
  [src/styles/](src/styles/) is layered 1-settings -> 7-utilities and a layer may only depend on
  the layers above it. Breakpoints are `@media (--bp-tab)`, never a literal pixel value, and
  everything is authored with logical properties because the site is RTL. Read
  [docs/css-architecture.md](docs/css-architecture.md) before writing any CSS.

## Reference

- [docs/architecture.md](docs/architecture.md) — stack, decisions and why, request flow, file map
- [docs/better-auth.md](docs/better-auth.md) — version-specific auth API, seeding, session access
- [docs/css-architecture.md](docs/css-architecture.md) — style layers, BEM, breakpoints, RTL rules
- [docs/porting-the-mockup.md](docs/porting-the-mockup.md) — mockup inventory, porting order, CMS content model

## Astro docs

Full documentation: https://docs.astro.build

- [Routing, dynamic routes, middleware](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling](https://docs.astro.build/en/guides/styling/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
