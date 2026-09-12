/**
 * The only writer for content tables.
 *
 * Every mutation validates with the same Zod schema the readers trust, writes in a
 * transaction, and then invalidates the affected cache key. Writing to
 * `content_singleton` or `event` from anywhere else — a page, an endpoint, an
 * ad-hoc script — breaks the cache's single-source invalidation and will serve
 * stale content until the process restarts.
 */
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db/index.ts';
import { contentSingleton, event } from '../../db/content-schema.ts';
import {
  singletons,
  singletonList,
  type AnySingleton,
  type SingletonData,
  type SingletonKey,
} from './schemas/index.ts';
import { siteHref } from './schemas/fields.ts';
import { invalidateEvents, invalidateSingleton, invalidateAll } from './cache.ts';

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
 * Replaces the whole event list in one transaction. Used by import; the dashboard
 * edits records one at a time through `upsertEvent`.
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
