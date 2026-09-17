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
  /** Optional; the English site falls back to `altAr`. */
  altEn: text('alt_en').notNull().default(''),
  /** Display only; never a path. */
  originalName: text('original_name'),
  updatedAt: updatedAt(),
  updatedBy: text('updated_by').references(() => user.id, { onDelete: 'set null' }),
});

/**
 * Events, ported from `waterstrip/assets/js/events-data.js`.
 *
 * The mockup carries both `x` and `x_ar` variants of every string, but its `x`
 * values are Arabic copies, so only the `_ar` fields came forward. Each has an
 * English `_en` sibling that defaults to '' — untranslated — and the English site
 * falls back to the Arabic value (src/lib/i18n/pick.ts). `day` and `monthAr` are text
 * rather than a real date because the reference prints them as written labels
 * ("يونيو – يوليو", "نوفمبر 2026") that no date type can round-trip.
 */
export const event = sqliteTable(
  'event',
  {
    slug: text('slug').primaryKey(),
    day: text('day').notNull(),
    monthAr: text('month_ar').notNull(),
    monthEn: text('month_en').notNull().default(''),
    titleAr: text('title_ar').notNull(),
    titleEn: text('title_en').notNull().default(''),
    descAr: text('desc_ar').notNull(),
    descEn: text('desc_en').notNull().default(''),
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
 * As with `event`, only the `_ar` string variants came forward, each with an
 * English `_en` sibling. Inside `stats` and `recs`, older rows may lack the `En`
 * keys, so they are optional in the stored type. `stats` and `recs` are small open repeatable lists (see
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
    nameEn: text('name_en').notNull().default(''),
    statusAr: text('status_ar').notNull().default(''),
    statusEn: text('status_en').notNull().default(''),
    leadAr: text('lead_ar').notNull(),
    leadEn: text('lead_en').notNull().default(''),
    headAr: text('head_ar').notNull(),
    headEn: text('head_en').notNull().default(''),
    orgsAr: text('orgs_ar').notNull(),
    orgsEn: text('orgs_en').notNull().default(''),
    scopeAr: text('scope_ar').notNull(),
    scopeEn: text('scope_en').notNull().default(''),
    stats: text('stats', { mode: 'json' })
      .notNull()
      .$type<{ n: string; labelAr: string; labelEn?: string }[]>(),
    recs: text('recs', { mode: 'json' })
      .notNull()
      .$type<{ titleAr: string; titleEn?: string; bodyAr: string; bodyEn?: string }[]>(),
    noteAr: text('note_ar').notNull().default(''),
    noteEn: text('note_en').notNull().default(''),
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
 * As with `event` and `workingGroup`, only the `_ar` string variants came
 * forward, each with an English `_en` sibling (optional inside `blocks`, which
 * older rows store without it). `blocks` is a small open repeatable list of heading/body pairs, and
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
    kindEn: text('kind_en').notNull().default(''),
    dateAr: text('date_ar').notNull(),
    dateEn: text('date_en').notNull().default(''),
    readAr: text('read_ar').notNull(),
    readEn: text('read_en').notNull().default(''),
    imageId: text('image_id'),
    titleAr: text('title_ar').notNull(),
    titleEn: text('title_en').notNull().default(''),
    ledeAr: text('lede_ar').notNull(),
    ledeEn: text('lede_en').notNull().default(''),
    blocks: text('blocks', { mode: 'json' })
      .notNull()
      .$type<{ headingAr: string; headingEn?: string; bodyAr: string; bodyEn?: string }[]>(),
    quoteAr: text('quote_ar').notNull().default(''),
    quoteEn: text('quote_en').notNull().default(''),
    quoteByAr: text('quote_by_ar').notNull().default(''),
    quoteByEn: text('quote_by_en').notNull().default(''),
    tagsAr: text('tags_ar', { mode: 'json' }).notNull().$type<string[]>(),
    /** Independent of `tagsAr`: an English list may be shorter or empty. */
    tagsEn: text('tags_en', { mode: 'json' }).notNull().default([]).$type<string[]>(),
    /** Ordering within the list only — not layout. Lower sorts first. */
    order: integer('order').notNull().default(0),
    published: integer('published', { mode: 'boolean' }).notNull().default(true),
    updatedAt: updatedAt(),
    updatedBy: text('updated_by').references(() => user.id, { onDelete: 'set null' }),
  },
  (table) => [index('article_order_idx').on(table.order)],
);

/**
 * Alliance members, ported from `waterstrip/member.html`'s inline
 * `WSTRIP_MEMBERS` object (there is no separate `member-data.js`; the mockup
 * embeds it directly in the detail page's markup).
 *
 * `categoryAr` is free text rather than a closed enum: the reference's
 * category filter chips (`main.js`'s "MEMBER CATEGORY FILTER" block) have no
 * matching markup left in the current `members.html`, so there is no feature
 * left that depends on the set of categories being fixed. `logoId` is a plain
 * media reference, same reasoning as `article.imageId` — every member in the
 * reference currently uses the shared placeholder mark, so a dangling or
 * absent id is the common case, not the exception.
 */
export const member = sqliteTable(
  'member',
  {
    slug: text('slug').primaryKey(),
    categoryAr: text('category_ar').notNull(),
    categoryEn: text('category_en').notNull().default(''),
    nameAr: text('name_ar').notNull(),
    nameEn: text('name_en').notNull().default(''),
    logoId: text('logo_id'),
    roleAr: text('role_ar').notNull(),
    roleEn: text('role_en').notNull().default(''),
    sectorAr: text('sector_ar').notNull(),
    sectorEn: text('sector_en').notNull().default(''),
    sinceAr: text('since_ar').notNull(),
    sinceEn: text('since_en').notNull().default(''),
    bioAr: text('bio_ar').notNull(),
    bioEn: text('bio_en').notNull().default(''),
    /** Ordering within the list only — not layout. Lower sorts first. */
    order: integer('order').notNull().default(0),
    published: integer('published', { mode: 'boolean' }).notNull().default(true),
    updatedAt: updatedAt(),
    updatedBy: text('updated_by').references(() => user.id, { onDelete: 'set null' }),
  },
  (table) => [index('member_order_idx').on(table.order)],
);
