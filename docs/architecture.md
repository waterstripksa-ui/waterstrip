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
| Dashboard UI | React 19 islands via `@astrojs/react` — **`/admin` only** |
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
- **Server-side form POSTs on the public site; React islands in the dashboard.** Login and
  logout stay plain HTML forms posting to Astro endpoints — no hydration, works without JS —
  and every public page is zero-JS-framework, with the index page's carousel and sliders
  written as vanilla inline scripts.

  The dashboard is the exception, and deliberately so. A content editor is a long-lived form
  over nested data: repeatable rows that reorder and delete, dirty tracking, a save per
  section, and server validation issues mapped back onto individual fields. Doing that with
  full-page POSTs means either losing unsaved work on every round trip or hand-rolling the
  same state machine in imperative DOM code. So `@astrojs/react` is installed and the
  `/admin` panels are islands (`src/components/admin/`). **The scope is a rule, not an
  accident:** React must not spread to public pages, because the reason the public site is
  framework-free — payload size and the CSP below — has not changed. This reverses the
  original "no UI framework is installed" decision; it does not widen it.
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

Done, verified in both dev and a production build:

- Auth end to end — schema, migrations, seeded admin, login, logout, `/admin` guarded by role.
- The CSS foundation and the **index page**, ported from the mockup.
- The content layer — `content_singleton` and `event` tables, the cache, the repository, the
  payload migration ladder, and import/export ([content-storage.md](content-storage.md)).
- The **index page's dashboard** at `/admin/home`: six singleton surfaces
  (`home_hero`, `home_discover`, `home_challenges`, `home_awards`, `home_partners`,
  `home_about_banner`) edited through React islands that `PUT` to
  `/admin/api/content/<key>`, with the public page reading the same content through the cache.

Not started: the remaining 17 mockup pages, the collection-backed surfaces (working groups,
articles, events have a table but no dashboard), the member area, and password reset (there is
no email sender configured).

**Media uploads** cover every image slot on the index page: the dashboard uploads to
`/admin/api/media`, and the section stores the returned media id. A slot with no upload shows
placeholder artwork from `src/lib/home-assets.ts`. See
[content-storage.md](content-storage.md#media-uploaded-images).
