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
