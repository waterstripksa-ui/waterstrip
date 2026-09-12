# Content storage

How CMS content is stored, cached, versioned, and moved between environments. Read this before
adding any editable surface or writing anything under `src/lib/content/`.

The short version: **SQLite is the store, JSON is only the interchange format, and there are two
independent version ladders** — one for storage shape (drizzle-kit) and one for singleton payload
shape (a `schema_version` column plus per-key migration functions in code).

## Decision: SQLite for storage, JSON for interchange

JSON files on disk were considered as the store and rejected. They remain the *export* format.

- **Content edits must be transactional with the user table.** Every editable row carries
  `updated_by` referencing `user.id`. Two stores means that foreign key cannot be enforced and an
  edit plus its audit trail cannot commit together.
- **A file store needs its own write-temp-rename dance and a lock.** Astro serves form POSTs
  concurrently; a partial write to an `articles.json` is a broken public page. `db.transaction()`
  already solves this correctly.
- **IO was never the real cost.** `better-sqlite3` is synchronous and in-process, and reads come
  off the OS page cache in microseconds. The in-memory cache below exists for *render-path
  ergonomics* — components get one frozen object and no `await` — not to avoid disk.
- **Migrating the live environment forward is already solved.** `npm run setup` runs
  `db:migrate` before the server starts, on every `npm run dev` and `npm start`. That is
  infrastructure this project already has rather than something to build.

## Two content shapes

The mockup's data files split cleanly along a line worth preserving in the schema.

| | Storage | Versioned by | Examples |
| --- | --- | --- | --- |
| **Collections** | one Drizzle table each, real typed columns | drizzle-kit migrations | working groups, articles, events |
| **Singletons** | rows in one `content_singleton` table, JSON payload | `schema_version` + code ladder | `home_hero`, `about_intro`, `contact_details` |

### Collections get real tables

They are queried, filtered, ordered by `order` or `published_at`, and indexed. Typed columns are
what makes [the hard rule](../AGENTS.md#hard-rules) — admins edit content, never structure — a
database-level guarantee rather than a UI promise. Port them from the mockup's data files as
described in [porting-the-mockup.md](porting-the-mockup.md#the-data-files-are-already-a-content-model).

### Singletons share one table

```ts
export const contentSingleton = sqliteTable('content_singleton', {
  key: text('key').primaryKey(),                          // 'home_hero'
  schemaVersion: integer('schema_version').notNull(),
  data: text('data', { mode: 'json' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  updatedBy: text('updated_by').references(() => user.id),
});
```

This deviates from "a fixed table per editable surface", so the reasoning matters:

- Singletons are always read whole. They are never filtered, sorted, or joined on a field, so
  columns buy no query capability.
- There will be twenty-odd of them across 18 pages. A table each means twenty schema migrations
  to ship what is really copy editing.
- The typing is not lost, it moves to a runtime validator — which is required at the form
  boundary regardless of how the row is stored.

**This is not a page builder, and the validator is what keeps it from becoming one.** The rules
that actually matter still hold: a fixed, named field set per key; no freeform HTML field; no
`sections` array that maps to component names. A JSON column is only as permissive as the schema
that admits writes into it, so the validator is load-bearing, not decorative. Reviewers should
treat a loosened singleton schema the same way they would treat a block builder.

## Versioning

Two ladders. Do not conflate them — the second one is what makes an *old export* importable,
which is the entire reason content shape is versioned separately from storage shape.

### 1. Storage shape — drizzle-kit

Already in place: `drizzle/*.sql` with `drizzle/meta/_journal.json` as the ledger. Covers
collections entirely, and the `content_singleton` table itself. Workflow is unchanged — edit
[src/db/schema.ts](../src/db/schema.ts), `npm run db:generate`, commit the SQL.

### 2. Singleton payload shape — `schema_version` plus a code ladder

Each surface declares its current version, its validator, and the functions that upgrade older
payloads:

```ts
// src/lib/content/schemas/home-hero.ts
export const homeHero = {
  key: 'home_hero',
  version: 3,
  schema: v3Schema,                    // validates the current shape
  migrations: [v1_to_v2, v2_to_v3],    // index i upgrades version i+1 -> i+2
};
```

[scripts/migrate-content.ts](../scripts/migrate-content.ts) walks every row behind its declared
version, runs the ladder, validates the result, and writes it back in one transaction. It also
inserts rows for surfaces that have no row yet, from the `initial` value in their definition.
`npm run setup` runs it after `content:seed` and before the server starts.

**Migrate eagerly, not lazily on read.** Lazy migration means every read path carries version
branches forever. Eager migration means the app may assume current-version data everywhere, and
old shapes exist only inside the ladder functions.

## Import and export

One envelope, one code path, used for seeding as well as for backups.

```json
{
  "format": "waterstrip-content",
  "formatVersion": 1,
  "exportedAt": "2026-09-12T14:00:00Z",
  "singletons": { "home_hero": { "schemaVersion": 1, "data": { "titleAr": "…" } } },
  "collections": { "events": [] }
}
```

- **Export** serializes from the database, never from the cache.
- **Export is content only.** No `user`, `session`, or `account` rows. Password hashes must never
  leave in a file an admin can download.
- **Import** parses, runs each singleton up its ladder, validates every record, then upserts
  inside `db.transaction()`. An import that fails validation writes nothing at all. `--dry-run`
  prints the diff without touching the database.
- **Unknown singleton keys are skipped, not fatal.** An envelope from a newer build, or one
  holding a since-retired surface, imports what it can and reports the rest. A *newer*
  `schemaVersion` for a key this build does know is an error: the fix is upgrading the app, not
  downgrading its data.
- **Server-owned columns stay out.** `updated_at` and `updated_by` are dropped on export — a
  user id is meaningless in the environment the envelope lands in.
- **Initial content ships as a checked-in export.** The ported mockup content lives at
  [content/seed.json](../content/seed.json), and `content:seed` imports it when the tables are
  empty. This is deliberate: it exercises the import path from day one instead of leaving it
  untested until the first time someone actually needs a restore.

### Commands

```sh
npm run content:export > backup.json    # or: npm run content:export -- backup.json
npm run content:import -- backup.json
npm run content:import -- backup.json --dry-run
npm run content:migrate                 # ladder + insert missing surfaces
npm run content:seed                    # import content/seed.json, if content is empty
```

`npm run setup` — and therefore `npm run dev` and `npm start` — runs
`db:migrate → content:seed → content:migrate → db:seed`. That order matters: seeding before
migrating means a fresh database gets the checked-in content, and `content:migrate` then finds
nothing to do. Reversing them would let `content:migrate` create `home_hero` from its `initial`
value first, making the database look non-empty and skipping the seed entirely.

## The in-memory cache

```
src/lib/content/
  cache.ts        # module-level store, frozen objects, synchronous getters
  repo.ts         # the only writer; after commit, refreshes the affected key
  migrate.ts      # runs a payload up its ladder; pure, no database access
  io.ts           # export / import envelope
  schemas/
    types.ts      # the SingletonDefinition contract + defineSingleton()
    index.ts      # the registry everything else iterates
    home-hero.ts  # one file per surface: validator, version, ladder, initial
```

The node adapter runs in `standalone` mode as a single process, so module state *is* the cache.
Warm each key on first access. Invalidate by routing every mutation through `repo.ts`, which
refreshes that key after the transaction commits. No TTL and no stale window, because writes are
the only source of change and all of them are local.

Two constraints that follow from this:

- **Keep `cache.ts` dependency-light.** Astro's dev-mode module reloading can otherwise leave two
  live copies of the cache with divergent contents.
- **The cache assumes one process.** Running more than one Node process — cluster mode, a second
  container against the same file — silently breaks invalidation, because a write in one process
  cannot refresh another's module state. If that ever becomes necessary, the cheap guard is
  checking `PRAGMA data_version` (it increments when another connection commits) before serving
  a cached value. Until then, treat single-process as a deployment requirement.

## Dependency: a runtime validator

**Zod 4** is installed and is the only dependency this design adds. It is what turns a JSON
column into a fixed field set, and a form boundary needs it regardless of storage choice. It is
a library, not infrastructure, so it does not engage the no-new-infrastructure rule in
[AGENTS.md](../AGENTS.md#hard-rules).

`drizzle-zod` was considered for deriving collection input schemas from the tables and rejected:
the input schema is deliberately *not* the table shape. `eventInput` in
[repo.ts](../src/lib/content/repo.ts) omits the server-owned `updatedAt`/`updatedBy` columns and
adds constraints no column can express — a slug pattern, and a site-relative-path check on
`href` so the CMS cannot become a link manager pointing at arbitrary origins. A derived schema
would have to be overridden into that shape anyway.

## Gotcha: no TypeScript parameter properties

Anything reachable from `scripts/*.ts` is loaded by plain Node under type-stripping, which
rejects parameter properties (`constructor(readonly x: T)`) with
`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`. Declare the field and assign it in the constructor body.
This is the same family of constraint as the explicit-`.ts`-extension rule in
[AGENTS.md](../AGENTS.md#gotchas-that-will-bite-you).

## Checklist for adding an editable surface

1. Decide collection or singleton by asking whether anything queries it by field.
2. Collection: add the table to [src/db/content-schema.ts](../src/db/content-schema.ts) — never
   to `schema.ts`, which the auth generator overwrites — then `npm run db:generate` and commit
   the SQL. Singleton: add `src/lib/content/schemas/<key>.ts` with `defineSingleton` at
   `version: 1`, and register it in `schemas/index.ts`.
3. Add a reader to `cache.ts` and, if the surface is editable, a writer to `repo.ts`. Never write
   to these tables from a page, an endpoint, or an ad-hoc script — that silently defeats cache
   invalidation and serves stale content until restart.
4. Validate on the way in, at the form boundary, with the same schema the reader trusts.
5. Singletons reach the export envelope automatically through the registry. A new *collection*
   needs its own entry in [io.ts](../src/lib/content/io.ts) and in
   [content/seed.json](../content/seed.json).

When changing an existing singleton's shape, bump `version`, append a migration function, and
leave the old ones in place — an export taken before the change must still import.
