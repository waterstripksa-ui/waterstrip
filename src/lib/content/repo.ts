/**
 * The only writer for content tables.
 *
 * Every mutation validates with the same Zod schema the readers trust, writes in a
 * transaction, and then invalidates the affected cache key. Writing to
 * `content_singleton` or `event` from anywhere else — a page, an endpoint, an
 * ad-hoc script — breaks the cache's single-source invalidation and will serve
 * stale content until the process restarts.
 */
import { eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db/index.ts';
import { article, contentSingleton, event, media, workingGroup } from '../../db/content-schema.ts';
import {
  singletons,
  singletonList,
  type AnySingleton,
  type SingletonData,
  type SingletonKey,
} from './schemas/index.ts';
import type { MediaRef } from './schemas/fields.ts';
import { arText, collectMediaIds, mediaId, siteHref } from './schemas/fields.ts';
import {
  invalidateArticles,
  invalidateEvents,
  invalidateWorkingGroups,
  invalidateSingleton,
  invalidateAll,
  invalidateMedia,
  type Media,
} from './cache.ts';

/**
 * Note the plain field assignment rather than a TypeScript parameter property:
 * these modules are loaded by `node scripts/*.ts` under type-stripping, which
 * rejects parameter properties outright.
 */
export class ContentValidationError extends Error {
  issues: z.core.$ZodIssue[];

  constructor(message: string, issues: z.core.$ZodIssue[] = []) {
    super(message);
    this.issues = issues;
  }
}

/** The event fields an admin may set. `updatedAt`/`updatedBy` are server-owned. */
export const eventInput = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be a lowercase slug, e.g. ev-kaust'),
  day: z.string().trim().min(1).max(8),
  monthAr: z.string().trim().min(1).max(40),
  titleAr: z.string().trim().min(1).max(200),
  descAr: z.string().trim().min(1).max(600),
  /** Relative path or on-site anchor. No absolute URLs: this is not a link manager. */
  href: siteHref,
  order: z.number().int().min(0).max(9999).default(0),
  published: z.boolean().default(true),
});

export type EventInput = z.input<typeof eventInput>;

function parse<T>(schema: z.ZodType<T>, value: unknown, what: string): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new ContentValidationError(
      `${what} is not valid: ` +
        result.error.issues
          .map((i) => `${i.path.join('.') || '(root)'} ${i.message}`)
          .join('; '),
      result.error.issues,
    );
  }
  return result.data;
}

/** Writes one singleton surface at its current schema version. */
export function setSingleton<K extends SingletonKey>(
  key: K,
  data: unknown,
  updatedBy?: string | null,
): SingletonData<K> {
  // Widened to the erased definition type: with several surfaces registered,
  // `singletons[key]` is a union whose `schema` TypeScript cannot correlate with
  // `SingletonData<K>`. The cast on the return below is what re-narrows it.
  const def: AnySingleton = singletons[key];
  const valid = parse(def.schema, data, `singleton "${key}"`);
  assertMediaExists(collectMediaIds(def.schema, valid));

  db.insert(contentSingleton)
    .values({
      key,
      schemaVersion: def.version,
      data: valid,
      updatedBy: updatedBy ?? null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: contentSingleton.key,
      set: {
        schemaVersion: def.version,
        data: valid,
        updatedBy: updatedBy ?? null,
        updatedAt: new Date(),
      },
    })
    .run();

  invalidateSingleton(key);
  return valid as SingletonData<K>;
}

/**
 * Inserts the declared initial payload for any singleton with no row yet.
 * Idempotent — existing rows are left alone. Runs as part of `npm run setup`.
 */
export function ensureSingletons(): string[] {
  const created: string[] = [];
  db.transaction((tx) => {
    for (const def of singletonList) {
      const existing = tx
        .select({ key: contentSingleton.key })
        .from(contentSingleton)
        .where(eq(contentSingleton.key, def.key))
        .get();
      if (existing) continue;

      tx.insert(contentSingleton)
        .values({
          key: def.key,
          schemaVersion: def.version,
          data: def.schema.parse(def.initial),
          updatedAt: new Date(),
        })
        .run();
      created.push(def.key);
    }
  });
  if (created.length) invalidateAll();
  return created;
}

export function upsertEvent(input: EventInput, updatedBy?: string | null) {
  const valid = parse(eventInput, input, 'event');
  const row = db
    .insert(event)
    .values({ ...valid, updatedBy: updatedBy ?? null, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: event.slug,
      set: { ...valid, updatedBy: updatedBy ?? null, updatedAt: new Date() },
    })
    .returning()
    .get();

  invalidateEvents();
  return row;
}

export function deleteEvent(slug: string): boolean {
  const removed = db.delete(event).where(eq(event.slug, slug)).returning().all();
  if (removed.length) invalidateEvents();
  return removed.length > 0;
}

/**
 * Replaces the whole event list in one transaction. Used by import and by the
 * dashboard's bulk editor, same reasoning as `replaceWorkingGroups`.
 */
export function replaceEvents(inputs: unknown[], updatedBy?: string | null): number {
  const valid = inputs.map((input, i) => parse(eventInput, input, `event[${i}]`));
  db.transaction((tx) => {
    tx.delete(event).run();
    for (const row of valid) {
      tx.insert(event)
        .values({ ...row, updatedBy: updatedBy ?? null, updatedAt: new Date() })
        .run();
    }
  });
  invalidateEvents();
  return valid.length;
}

const workingGroupStat = z.object({
  n: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(20, 'الحد الأقصى 20 حرفًا.'),
  labelAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(80, 'الحد الأقصى 80 حرفًا.'),
});

const workingGroupRec = z.object({
  titleAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(200, 'الحد الأقصى 200 حرف.'),
  bodyAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(600, 'الحد الأقصى 600 حرف.'),
});

/** The working-group fields an admin may set. `updatedAt`/`updatedBy` are server-owned. */
export const workingGroupInput = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be a lowercase slug, e.g. flood-platform'),
  no: z.string().trim().min(1).max(8),
  challenge: z.enum(['supply', 'treat', 'reuse', 'smart']),
  nameAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(200, 'الحد الأقصى 200 حرف.'),
  statusAr: z.string().trim().max(60, 'الحد الأقصى 60 حرفًا.').default(''),
  leadAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(200, 'الحد الأقصى 200 حرف.'),
  headAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(200, 'الحد الأقصى 200 حرف.'),
  orgsAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(300, 'الحد الأقصى 300 حرف.'),
  scopeAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(600, 'الحد الأقصى 600 حرف.'),
  stats: z.array(workingGroupStat).max(6).default([]),
  recs: z.array(workingGroupRec).max(12).default([]),
  noteAr: z.string().trim().max(600, 'الحد الأقصى 600 حرف.').default(''),
  src: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(300, 'الحد الأقصى 300 حرف.'),
  order: z.number().int().min(0).max(9999).default(0),
  published: z.boolean().default(true),
});

export type WorkingGroupInput = z.input<typeof workingGroupInput>;

export function upsertWorkingGroup(input: WorkingGroupInput, updatedBy?: string | null) {
  const valid = parse(workingGroupInput, input, 'working group');
  const row = db
    .insert(workingGroup)
    .values({ ...valid, updatedBy: updatedBy ?? null, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: workingGroup.slug,
      set: { ...valid, updatedBy: updatedBy ?? null, updatedAt: new Date() },
    })
    .returning()
    .get();

  invalidateWorkingGroups();
  return row;
}

export function deleteWorkingGroup(slug: string): boolean {
  const removed = db.delete(workingGroup).where(eq(workingGroup.slug, slug)).returning().all();
  if (removed.length) invalidateWorkingGroups();
  return removed.length > 0;
}

/**
 * Replaces the whole working-group list in one transaction. Used by import and by
 * the dashboard's bulk editor — with only eight groups today, editing the whole
 * list at once is simpler than per-row endpoints, unlike `event`'s one-at-a-time
 * dashboard flow.
 */
export function replaceWorkingGroups(inputs: unknown[], updatedBy?: string | null): number {
  const valid = inputs.map((input, i) => parse(workingGroupInput, input, `workingGroup[${i}]`));
  db.transaction((tx) => {
    tx.delete(workingGroup).run();
    for (const row of valid) {
      tx.insert(workingGroup)
        .values({ ...row, updatedBy: updatedBy ?? null, updatedAt: new Date() })
        .run();
    }
  });
  invalidateWorkingGroups();
  return valid.length;
}

const articleBlock = z.object({
  headingAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(120, 'الحد الأقصى 120 حرفًا.'),
  bodyAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(2000, 'الحد الأقصى 2000 حرف.'),
});

/** The article fields an admin may set. `updatedAt`/`updatedBy` are server-owned. */
export const articleInput = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be a lowercase slug, e.g. esg-award'),
  kindAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(40, 'الحد الأقصى 40 حرفًا.'),
  dateAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(40, 'الحد الأقصى 40 حرفًا.'),
  readAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(40, 'الحد الأقصى 40 حرفًا.'),
  imageId: mediaId.nullable().default(null),
  titleAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(200, 'الحد الأقصى 200 حرف.'),
  ledeAr: z.string().trim().min(1, 'هذا الحقل مطلوب.').max(400, 'الحد الأقصى 400 حرف.'),
  blocks: z.array(articleBlock).max(8).default([]),
  quoteAr: z.string().trim().max(400, 'الحد الأقصى 400 حرف.').default(''),
  quoteByAr: z.string().trim().max(120, 'الحد الأقصى 120 حرفًا.').default(''),
  tagsAr: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  order: z.number().int().min(0).max(9999).default(0),
  published: z.boolean().default(true),
});

export type ArticleInput = z.input<typeof articleInput>;

export function upsertArticle(input: ArticleInput, updatedBy?: string | null) {
  const valid = parse(articleInput, input, 'article');
  const row = db
    .insert(article)
    .values({ ...valid, updatedBy: updatedBy ?? null, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: article.slug,
      set: { ...valid, updatedBy: updatedBy ?? null, updatedAt: new Date() },
    })
    .returning()
    .get();

  invalidateArticles();
  return row;
}

export function deleteArticle(slug: string): boolean {
  const removed = db.delete(article).where(eq(article.slug, slug)).returning().all();
  if (removed.length) invalidateArticles();
  return removed.length > 0;
}

/**
 * Replaces the whole article list in one transaction. Used by import and by the
 * dashboard's bulk editor, same reasoning as `replaceWorkingGroups`.
 */
export function replaceArticles(inputs: unknown[], updatedBy?: string | null): number {
  const valid = inputs.map((input, i) => parse(articleInput, input, `article[${i}]`));
  db.transaction((tx) => {
    tx.delete(article).run();
    for (const row of valid) {
      tx.insert(article)
        .values({ ...row, updatedBy: updatedBy ?? null, updatedAt: new Date() })
        .run();
    }
  });
  invalidateArticles();
  return valid.length;
}

/**
 * Alt text is required on every upload. Optional alt text is how alt text ends
 * up empty everywhere; see docs/content-storage.md#the-table.
 */
export const mediaAlt = arText(1, 200);

/**
 * A media row as the pipeline produces it and as an import envelope carries it.
 * `updatedAt`/`updatedBy` are server-owned, as on every other content table.
 */
export const mediaInput = z.object({
  id: mediaId,
  ext: z.enum(['webp', 'jpg', 'png']),
  mimeType: z.enum(['image/webp', 'image/jpeg', 'image/png']),
  bytes: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  altAr: mediaAlt,
  originalName: z.string().max(200).nullable().default(null),
});

export type MediaInput = z.input<typeof mediaInput>;

export function findMedia(id: string): Media | null {
  return db.select().from(media).where(eq(media.id, id)).get() ?? null;
}

/**
 * Singleton payloads cannot carry a foreign key, so this is the check a column
 * would otherwise have guaranteed. Issues carry the field path, so the dashboard
 * marks the image field that failed rather than the whole section.
 */
function assertMediaExists(refs: MediaRef[]): void {
  if (!refs.length) return;
  const ids = [...new Set(refs.map((r) => r.id))];
  const found = new Set(
    db.select({ id: media.id }).from(media).where(inArray(media.id, ids)).all().map((r) => r.id),
  );
  const missing = refs.filter((r) => !found.has(r.id));
  if (!missing.length) return;

  throw new ContentValidationError(
    `unknown media id(s): ${missing.map((r) => r.id).join(', ')}`,
    missing.map((r) => ({
      code: 'custom',
      path: r.path,
      message: 'الصورة غير موجودة. ارفعها من جديد.',
      input: r.id,
    })) as z.core.$ZodIssue[],
  );
}

/**
 * Records an uploaded image. Idempotent by content hash: inserting bytes that are
 * already stored returns the existing row, alt text included, and says so.
 */
export function insertMedia(
  input: MediaInput,
  updatedBy?: string | null,
): { media: Media; duplicate: boolean } {
  const valid = parse(mediaInput, input, 'media');
  const inserted = db
    .insert(media)
    .values({ ...valid, updatedBy: updatedBy ?? null, updatedAt: new Date() })
    .onConflictDoNothing({ target: media.id })
    .returning()
    .get();

  if (inserted) {
    invalidateMedia(inserted.id);
    return { media: inserted, duplicate: false };
  }
  return { media: findMedia(valid.id)!, duplicate: true };
}
