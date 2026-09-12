# Content storage

How CMS content is stored, cached, versioned, and moved between environments. Read this before
adding any editable surface or writing anything under `src/lib/content/`.

The short version: **SQLite is the store, JSON is only the interchange format, and there are two
independent version ladders** — one for storage shape (drizzle-kit) and one for singleton payload
shape (a `schema_version` column plus per-key migration functions in code).

Uploaded images are the one exception to the first clause: their bytes live on disk under
`UPLOAD_PATH` and SQLite holds only a metadata row. See [Media](#media-uploaded-images).

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

## Content shapes

Three, and the first two come straight from the mockup: its data files split cleanly along a line
worth preserving in the schema. Media is the later addition, and the only shape whose payload is
not a database row.

| | Storage | Versioned by | Examples |
| --- | --- | --- | --- |
| **Collections** | one Drizzle table each, real typed columns | drizzle-kit migrations | working groups, articles, events |
| **Singletons** | rows in one `content_singleton` table, JSON payload | `schema_version` + code ladder | `home_hero`, `about_intro`, `contact_details` |
| **Media** | metadata row in `media`, bytes on disk | drizzle-kit migrations | uploaded photos |

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

## Media: uploaded images

The third shape, and the only one whose payload does not live in SQLite. **Bytes go on disk under
`UPLOAD_PATH`; SQLite holds one metadata row per image.**

> Status: designed and agreed, **not yet implemented**. The table, module and commands below are
> the intended shape, not a description of code that exists.

BLOB columns were considered and rejected. SQLite would handle them perfectly well — the problem
is everything downstream. The cache holds deep-frozen content objects, so a BLOB means either
image bytes end up frozen into module state or `media` becomes the one table that bypasses the
cache. And a BLOB can only be served by waking Node for every request, which forecloses letting
the reverse proxy serve the file directly. A metadata row is a few hundred bytes and caches
exactly like a collection record, so it needs no new pattern.

### Uploads go in `data/uploads/`, never `public/`

`public/` is **build input** — Astro copies it into `dist/client/` at build time. An upload
written there appears to work in development and then disappears at the next `npm run build`.
`data/` is already where mutable state lives and is already gitignored, so uploads inherit the
backup story the database file already has.

```
UPLOAD_PATH=./data/uploads
```

### Content-addressed layout

SHA-256 of the bytes, stored at `data/uploads/<ab>/<cd>/<hash>.<ext>` — two levels of fanout so
no single directory grows past a few hundred entries.

Four consequences follow, and the last one carries more weight on this project than it usually
would:

- **Immutable URLs.** `Cache-Control: public, max-age=31536000, immutable` is unconditionally
  correct, because content cannot change underneath a hash. That matters with no CDN in front.
- **The ETag is free** — it *is* the hash.
- **Dedupe.** Re-uploading an identical file returns the existing record rather than a second copy.
- **User filenames never reach the filesystem.** The dashboard is Arabic: uploads will arrive
  named `شعار-الوزارة.png`, with spaces, and occasionally with a bidi override character embedded.
  Sanitizing that safely is a genuinely awkward problem, and content addressing removes it rather
  than mitigating it. The original name is kept in a column for display only.

A duplicate upload must return the existing row *and say so in the UI*. That is the one
user-visible edge of dedupe, and it belongs in explicit copy rather than arriving as a surprise.

### The table

```ts
export const media = sqliteTable('media', {
  id: text('id').primaryKey(),            // sha256 hex — stable across environments
  ext: text('ext').notNull(),             // 'webp' | 'jpg' | 'png'
  mimeType: text('mime_type').notNull(),
  bytes: integer('bytes').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  altAr: text('alt_ar').notNull(),
  originalName: text('original_name'),    // display only; never a path
  updatedAt: updatedAt(),
  updatedBy: text('updated_by').references(() => user.id, { onDelete: 'set null' }),
});
```

`width` and `height` are stored rather than measured at render time so components can emit
`<img width height>` and pages do not shift as images load. `altAr` is `notNull` on purpose: on a
public Arabic site with accessibility in its own pre-launch checklist, optional alt text is how
alt text ends up empty everywhere.

### How content references an image

Collections carry a real foreign key:

```ts
imageId: text('image_id').references(() => media.id, { onDelete: 'restrict' }),
```

`restrict`, not `set null` — deleting an image the live home page still uses must fail loudly in
the dashboard instead of silently blanking the hero.

**Singletons cannot have that foreign key, and this is the first place the JSON-payload deviation
costs something concrete.** The reference lives inside the payload — the `image_key` field that
[porting-the-mockup.md](porting-the-mockup.md#content-model-rules) already anticipates — so two
things move into code that a column would otherwise have guaranteed:

- `repo.ts` checks the media row exists when validating a singleton write. Zod can assert the
  *shape* of a media id; only the repository can assert that it resolves.
- `migrate.ts` must tolerate a dangling id. A payload imported from another environment can
  legitimately reference an image whose row and blob have not arrived yet, and failing the whole
  import over that would make backups unusable. See the import rules below.

### Processing: one sharp pass on upload

`sharp` already ships inside `node_modules` as an Astro dependency. Promote it to a direct
dependency: no install cost, and it pins the version this project actually tests against instead
of inheriting whatever Astro bumps to.

On upload, once: reject anything sharp cannot identify, strip EXIF, cap the long edge at 2400px,
convert raster input to WebP, and record the real dimensions. EXIF stripping is not pedantry —
staff upload photos straight off phones, and those carry GPS coordinates.

Two deliberate omissions:

- **No responsive variants yet.** Content addressing makes `<hash>/800.webp` a purely additive
  change later. Do not build the machinery before a page needs it.
- **No `astro:assets` for uploaded images.** `<Image>` on a runtime upload optimizes per request
  through Astro's own endpoint, which puts Node back in the path for every image — the thing this
  layout exists to avoid. Use a plain `<img>` with the stored dimensions. `astro:assets` remains
  fine for images committed to the repo.

### SVG uploads are refused, not sanitized

SVG is executable: scripts, external entity references, embedded foreign objects. The brand SVGs
under `public/img/` are code and ship with the repo, and the pre-launch item this feature serves
is "replace placeholder imagery with **real photos**". One line in the validator removes an entire
vulnerability class at no cost to the actual use case.

Type validation sniffs magic bytes through sharp's `metadata()`. Never trust the declared
`Content-Type` or the file extension — both are attacker-controlled.

### Serving

One URL shape, `/media/<hash>.<ext>`, served two ways:

- **Production:** the reverse proxy serves `UPLOAD_PATH` directly with `expires max`. Node never
  sees an image request.
- **Development:** `src/pages/media/[...file].ts` streams from `UPLOAD_PATH` with the hash as the
  ETag.

The endpoint is the fallback, not the primary — but write it correctly anyway, so
`npm run build && npm start` works on a bare box with no proxy configured.

### Size limits belong at three layers

Reverse proxy `client_max_body_size`, a `Content-Length` check in the endpoint, and the sharp
pass. 8 MB. The proxy limit is the one that matters most: without it an oversized upload is
rejected only after being buffered in full.

### Deferred: orphan collection

Content addressing plus `onDelete: restrict` means unused uploads accumulate. A
`content:media-gc` reporting media rows nothing references, and files on disk with no row, will be
needed eventually. It should report by default and delete only when explicitly asked. Not
day-one work.

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
  "collections": { "events": [], "media": [] }
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
- **Media travels as metadata, not as bytes.** `media` rows export like any other collection, so
  alt text, dimensions and provenance stay versioned and diffable. The files themselves move with
  `rsync data/uploads/`. Import reports `missingBlobs` as a **warning, not a failure**: the common
  case is importing a production backup onto a development machine to reproduce a content bug,
  where 200 MB of photos are not wanted. Because ids are content hashes, a row and its file cannot
  drift apart — rsync the directory later and every reference resolves with no fixup step. This is
  also why a dangling `image_key` inside a singleton payload must not fail a migration.
- **Base64-in-the-envelope was rejected.** A 20 MB gallery becomes a ~27 MB JSON document that
  `JSON.parse` must hold whole in memory. If a genuinely self-contained bundle is ever needed,
  bump `formatVersion` to 2 and make the container a tar holding `content.json` plus `uploads/` —
  old envelopes still import through the existing ladder. That is precisely what `formatVersion`
  is for.
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

The envelope is a *content* backup, not a machine backup. A full restore needs `data/` in its
entirety — the database, its WAL, and `data/uploads/`.

## The in-memory cache

```
src/lib/content/
  cache.ts        # module-level store, frozen objects, synchronous getters
  repo.ts         # the only writer; after commit, refreshes the affected key
  migrate.ts      # runs a payload up its ladder; pure, no database access
  io.ts           # export / import envelope
  media.ts        # upload pipeline: hash, sharp normalise, write to disk
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
  live copies of the cache with divergent contents. In particular `cache.ts` must not import
  `media.ts` — `getMedia()` reads the metadata row like any other record, and the
  filesystem-and-sharp half of media handling has no business on the render path.
- **The cache assumes one process.** Running more than one Node process — cluster mode, a second
  container against the same file — silently breaks invalidation, because a write in one process
  cannot refresh another's module state. If that ever becomes necessary, the cheap guard is
  checking `PRAGMA data_version` (it increments when another connection commits) before serving
  a cached value. Until then, treat single-process as a deployment requirement.

## Dependencies

Two, both libraries rather than infrastructure, so neither engages the no-new-infrastructure rule
in [AGENTS.md](../AGENTS.md#hard-rules).

**Zod 4** — installed. It is what turns a JSON column into a fixed field set, and a form boundary
needs it regardless of storage choice.

**sharp** — to be promoted from a transitive Astro dependency to a direct one when media lands. It
does the single normalise pass on upload and doubles as the format validator, since identifying
the bytes is the only trustworthy type check.

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
4. Validate on the way in, at the form boundary, with the same schema the reader trusts. A field
   holding an image is a `media` id — a foreign key on a collection table, or a string inside
   a singleton payload that is validated *and* existence-checked. Never a path, a URL, or a
   filename.
5. Singletons reach the export envelope automatically through the registry. A new *collection*
   needs its own entry in [io.ts](../src/lib/content/io.ts) and in
   [content/seed.json](../content/seed.json).

When changing an existing singleton's shape, bump `version`, append a migration function, and
leave the old ones in place — an export taken before the change must still import.
