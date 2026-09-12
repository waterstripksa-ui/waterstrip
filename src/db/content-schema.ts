/**
 * CMS content tables.
 *
 * Kept out of `schema.ts` on purpose: that file is overwritten wholesale by
 * `npx auth generate` (see docs/better-auth.md#regenerating-the-schema). Anything
 * hand-written there is lost on the next auth config change, so app tables live
 * here and `src/db/index.ts` re-exports both modules as one schema.
 */
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { user } from './schema.ts';

const updatedAt = () =>
  integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull();

/**
 * One row per editable single-instance surface — `home_hero`, `about_intro`, and
 * so on. `data` is a JSON payload whose shape is fixed by the Zod schema declared
 * for that key in `src/lib/content/schemas/`, and `schema_version` records which
 * version of that shape the row currently holds.
 *
 * The JSON column is not licence for a page builder: see
 * docs/content-storage.md#singletons-share-one-table.
 */
export const contentSingleton = sqliteTable('content_singleton', {
  key: text('key').primaryKey(),
  schemaVersion: integer('schema_version').notNull(),
  data: text('data', { mode: 'json' }).notNull(),
  updatedAt: updatedAt(),
  updatedBy: text('updated_by').references(() => user.id, { onDelete: 'set null' }),
});

/**
 * Uploaded images. The bytes live on disk under `UPLOAD_PATH`; this row is the
 * metadata, and the only thing content refers to.
 *
 * `id` is the SHA-256 of the stored file, so it is stable across environments
 * and the file path is derived from it — a user-supplied filename never reaches
 * the filesystem. See docs/content-storage.md#media-uploaded-images.
 */
export const media = sqliteTable('media', {
  id: text('id').primaryKey(),
  ext: text('ext').notNull(),
  mimeType: text('mime_type').notNull(),
  bytes: integer('bytes').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  altAr: text('alt_ar').notNull(),
  /** Display only; never a path. */
  originalName: text('original_name'),
  updatedAt: updatedAt(),
  updatedBy: text('updated_by').references(() => user.id, { onDelete: 'set null' }),
});

/**
 * Events, ported from `waterstrip/assets/js/events-data.js`.
 *
 * The mockup carries both `x` and `x_ar` variants of every string; the site is
 * Arabic-only, so only the `_ar` fields come forward. `day` and `monthAr` are text
 * rather than a real date because the reference prints them as written labels
 * ("يونيو – يوليو", "نوفمبر 2026") that no date type can round-trip.
 */
export const event = sqliteTable(
  'event',
  {
    slug: text('slug').primaryKey(),
    day: text('day').notNull(),
    monthAr: text('month_ar').notNull(),
    titleAr: text('title_ar').notNull(),
    descAr: text('desc_ar').notNull(),
    href: text('href').notNull(),
    /** Ordering within the list only — not layout. Lower sorts first. */
    order: integer('order').notNull().default(0),
    published: integer('published', { mode: 'boolean' }).notNull().default(true),
    updatedAt: updatedAt(),
    updatedBy: text('updated_by').references(() => user.id, { onDelete: 'set null' }),
  },
  (table) => [index('event_order_idx').on(table.order)],
);

/**
 * Expert working groups, ported from `waterstrip/assets/js/wg-data.js`.
 *
 * As with `event`, only the `_ar` string variants come forward — the site is
 * Arabic-only. `stats` and `recs` are small open repeatable lists (see
 * docs/porting-the-mockup.md#content-model-rules); every group in the reference
 * currently has both empty, so they store as JSON rather than earning their own
 * tables. `challenge` drives which of the mockup's four fixed icon/colour themes
 * a group's card renders with (src/lib/wg-visuals.ts) — it is a closed set, not
 * free text.
 */
export const workingGroup = sqliteTable(
  'working_group',
  {
    slug: text('slug').primaryKey(),
    /** Display ordinal as printed in the reference, e.g. "01". Not a sort key. */
    no: text('no').notNull(),
    challenge: text('challenge', { enum: ['supply', 'treat', 'reuse', 'smart'] }).notNull(),
    nameAr: text('name_ar').notNull(),
    statusAr: text('status_ar').notNull().default(''),
    leadAr: text('lead_ar').notNull(),
    headAr: text('head_ar').notNull(),
    orgsAr: text('orgs_ar').notNull(),
    scopeAr: text('scope_ar').notNull(),
    stats: text('stats', { mode: 'json' }).notNull().$type<{ n: string; labelAr: string }[]>(),
    recs: text('recs', { mode: 'json' })
      .notNull()
      .$type<{ titleAr: string; bodyAr: string }[]>(),
    noteAr: text('note_ar').notNull().default(''),
    src: text('src').notNull(),
    /** Ordering within the list only — not layout. Lower sorts first. */
    order: integer('order').notNull().default(0),
    published: integer('published', { mode: 'boolean' }).notNull().default(true),
    updatedAt: updatedAt(),
    updatedBy: text('updated_by').references(() => user.id, { onDelete: 'set null' }),
  },
  (table) => [index('working_group_order_idx').on(table.order)],
);

/**
 * News articles, ported from `waterstrip/assets/js/article-data.js`.
 *
 * As with `event` and `workingGroup`, only the `_ar` string variants come
 * forward. `blocks` is a small open repeatable list of heading/body pairs, and
 * `tagsAr` an open list of short labels — both store as JSON rather than
 * earning their own tables, same reasoning as `workingGroup`'s `stats`/`recs`.
 * `imageId` is a `media` row id like a singleton's image field, but this is a
 * plain column rather than something `collectMediaIds` walks: that helper
 * walks a Zod *schema* tree, which only singletons have. A dangling id here
 * (imported ahead of its media row) is tolerated the same way — see the note
 * on `mediaId` in schemas/fields.ts — and simply renders the placeholder.
 */
export const article = sqliteTable(
  'article',
  {
    slug: text('slug').primaryKey(),
    kindAr: text('kind_ar').notNull(),
    dateAr: text('date_ar').notNull(),
    readAr: text('read_ar').notNull(),
    imageId: text('image_id'),
    titleAr: text('title_ar').notNull(),
    ledeAr: text('lede_ar').notNull(),
    blocks: text('blocks', { mode: 'json' })
      .notNull()
      .$type<{ headingAr: string; bodyAr: string }[]>(),
    quoteAr: text('quote_ar').notNull().default(''),
    quoteByAr: text('quote_by_ar').notNull().default(''),
    tagsAr: text('tags_ar', { mode: 'json' }).notNull().$type<string[]>(),
    /** Ordering within the list only — not layout. Lower sorts first. */
    order: integer('order').notNull().default(0),
    published: integer('published', { mode: 'boolean' }).notNull().default(true),
    updatedAt: updatedAt(),
    updatedBy: text('updated_by').references(() => user.id, { onDelete: 'set null' }),
  },
  (table) => [index('article_order_idx').on(table.order)],
);
