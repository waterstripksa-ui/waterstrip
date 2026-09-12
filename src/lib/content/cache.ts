/**
 * The in-memory content cache.
 *
 * The node adapter runs standalone in a single process, so module state *is* the
 * cache. Getters are synchronous — `better-sqlite3` is a synchronous driver — so
 * Astro components read content without `await` and without a loading state.
 *
 * Invalidation has exactly one source: every write goes through `repo.ts`, which
 * refreshes the affected key after its transaction commits. There is no TTL and no
 * stale window. This is why nothing outside `repo.ts` may write to these tables.
 *
 * Keep this module's imports minimal — dev-mode module reloading can otherwise
 * leave two live copies of the cache with divergent contents.
 *
 * Single process is a deployment requirement, not an accident: see
 * docs/content-storage.md#the-in-memory-cache.
 */
import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/index.ts';
import { contentSingleton, event } from '../../db/content-schema.ts';
import { singletons, type SingletonData, type SingletonKey } from './schemas/index.ts';
import { upgrade } from './migrate.ts';

export type Event = typeof event.$inferSelect;

const singletonCache = new Map<SingletonKey, unknown>();
let eventCache: readonly Event[] | null = null;

/** Recursive freeze so a caller cannot mutate cached content in place. */
function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const inner of Object.values(value as Record<string, unknown>)) deepFreeze(inner);
  }
  return value;
}

function loadSingleton<K extends SingletonKey>(key: K): SingletonData<K> {
  const def = singletons[key];
  const row = db
    .select()
    .from(contentSingleton)
    .where(eq(contentSingleton.key, key))
    .get();

  // No row yet: fall back to the declared initial value rather than throwing, so a
  // half-seeded database still renders. `repo.ensureSingletons()` writes these in.
  const data = row
    ? upgrade(def, row.schemaVersion, row.data)
    : def.schema.parse(def.initial);

  return deepFreeze(data) as SingletonData<K>;
}

/** Reads one editable single-instance surface. Synchronous and cached. */
export function getSingleton<K extends SingletonKey>(key: K): SingletonData<K> {
  if (!singletonCache.has(key)) singletonCache.set(key, loadSingleton(key));
  return singletonCache.get(key) as SingletonData<K>;
}

/** Published events, in list order. Ordering within a list is not layout. */
export function listEvents(): readonly Event[] {
  if (!eventCache) {
    eventCache = deepFreeze(
      db
        .select()
        .from(event)
        .where(eq(event.published, true))
        .orderBy(asc(event.order), asc(event.slug))
        .all(),
    );
  }
  return eventCache;
}

/** Every event including unpublished ones — for the dashboard, not the public site. */
export function listAllEvents(): Event[] {
  return db.select().from(event).orderBy(asc(event.order), asc(event.slug)).all();
}

export function invalidateSingleton(key: SingletonKey): void {
  singletonCache.delete(key);
}

export function invalidateEvents(): void {
  eventCache = null;
}

/** Drops everything. Used after an import, which can touch every surface. */
export function invalidateAll(): void {
  singletonCache.clear();
  eventCache = null;
}
