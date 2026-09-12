# Architecture

## What this project is

The public site is being ported page by page from a finished static mockup
([waterstrip/](../waterstrip/)) into Astro, and an authenticated CMS dashboard is being built
alongside it so staff can edit the content without touching code.

The site is Arabic-only and RTL. The audience is a Saudi water-innovation initiative with
government stakeholders, so treat data residency and dependency count as real constraints.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Astro 7, `output: 'server'`, `@astrojs/node` in `standalone` mode |
| Database | SQLite on local disk via `better-sqlite3` |
| Query layer | Drizzle ORM + drizzle-kit migrations |
| Auth | Better Auth 1.7.4 with the `admin` plugin |
| Hosting | Self-managed VPS |

### Why this and not something else

- **SQLite over Postgres.** The deployment target is a single VPS. SQLite keeps the whole
  system to one process plus one file, with no network hop and nothing to provision. Drizzle
  keeps the door open: moving to Postgres later is a dialect change, not a rewrite.
- **Self-hosted auth over Clerk/Auth0.** The mockup implies a *member area*
  ([waterstrip/members.html](../waterstrip/members.html), [member.html](../waterstrip/member.html))
  on top of the admin dashboard, so a user table is needed regardless. A hosted IdP would
  mean per-seat cost for members *and* a local profile table anyway.
- **Database-backed CMS over a git-based one** (Decap/Sveltia/Tina). A git CMS would add a
  second content system next to the user database that already has to exist, and would require
  non-technical Arabic-speaking admins to hold GitHub accounts and wait on a rebuild per edit.
- **Server-side form POSTs over a client SDK.** Login and logout are plain HTML forms posting
  to Astro endpoints. No framework island, no hydration, works without JS. No UI framework is
  installed — do not add one unless a feature genuinely needs it.
- **All DB access is server-side.** The mockup ships a strict CSP
  ([waterstrip/netlify.toml](../waterstrip/netlify.toml)) with `connect-src 'self'`. Keeping
  queries on the server means that policy survives the port. A browser-side data client would
  force it open.

## Request flow

```
request
  └─ src/middleware.ts
       ├─ auth.api.getSession()  ->  locals.user / locals.session  (null when signed out)
       └─ /admin/* guard:  no user -> 302 /login  |  role !== 'admin' -> 403
            └─ page or endpoint
```

Login and logout do not go through Better Auth's catch-all route. They post to
[src/pages/api/login.ts](../src/pages/api/login.ts) and
[src/pages/api/logout.ts](../src/pages/api/logout.ts), which call `auth.api.*` with
`asResponse: true` and copy the resulting `Set-Cookie` headers onto a 302. The catch-all at
[src/pages/api/auth/[...all].ts](../src/pages/api/auth/%5B...all%5D.ts) still exists to serve
plugin endpoints.

## File map

| Path | Purpose |
| --- | --- |
| [src/lib/env.ts](../src/lib/env.ts) | Validated env, read from `process.env`. Throws on missing keys. |
| [src/lib/auth.ts](../src/lib/auth.ts) | The Better Auth instance. Single source of auth config. |
| [src/db/index.ts](../src/db/index.ts) | `better-sqlite3` connection (WAL, foreign keys on) wrapped in Drizzle. |
| [src/db/schema.ts](../src/db/schema.ts) | Drizzle tables. Auth tables are **generated**; CMS tables get added here by hand. |
| [src/middleware.ts](../src/middleware.ts) | Session lookup + `/admin` route guard. |
| [src/env.d.ts](../src/env.d.ts) | `App.Locals` types, inferred from the auth instance. |
| [scripts/seed-admin.ts](../scripts/seed-admin.ts) | Idempotent first-admin seed. |
| [drizzle.config.ts](../drizzle.config.ts) | drizzle-kit config. |
| [drizzle/](../drizzle/) | Generated SQL migrations — commit these, never edit them. |

## Environment variables

See [.env.example](../.env.example). `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `ADMIN_EMAIL` and
`ADMIN_PASSWORD` are required and the app refuses to boot without them. `DATABASE_PATH`
(default `./data/waterstrip.db`) and `ADMIN_NAME` are optional.

`BETTER_AUTH_URL` must match the real origin in production, or cookies will not be set.

## Database workflow

1. Edit [src/db/schema.ts](../src/db/schema.ts) (or regenerate the auth tables).
2. `npm run db:generate` — writes a new migration into [drizzle/](../drizzle/).
3. `npm run db:migrate` — applies it.
4. Commit both the schema change and the generated SQL.

`npm run dev` and `npm start` run migrate + seed first, so a fresh checkout with a filled-in
`.env` boots into a working state.

## Deployment sketch

`npm run build` emits `dist/server/entry.mjs`. `npm start` migrates, seeds, then serves it.
On the VPS put it behind a reverse proxy terminating TLS, set `BETTER_AUTH_URL` to the public
origin, and keep `data/` on persistent disk — it holds the entire database. The mockup's
security headers in [waterstrip/netlify.toml](../waterstrip/netlify.toml) are a good starting
point for the proxy config; they are not currently applied anywhere.

## Status

Done: auth end to end — schema, migrations, seeded admin, login, logout, `/admin` guarded by
role. Verified in both dev and a production build.

Not started: everything else. The `/admin` and `/login` pages are deliberately unstyled
scaffolding. No CMS tables, no content editing, no ported pages, no member area, no password
reset (there is no email sender configured), no media uploads.
