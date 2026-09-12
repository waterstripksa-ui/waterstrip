/**
 * The singleton registry. Adding a surface means adding it here — the migration
 * script, the export envelope and the cache all iterate this object, so nothing
 * else needs to learn about a new key.
 */
import { homeHero } from './home-hero.ts';
import type { SingletonDefinition } from './types.ts';

/** Iteration type. The payload generic is erased because the surfaces differ. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySingleton = SingletonDefinition<any>;

export const singletons = {
  home_hero: homeHero,
} as const;

export type SingletonKey = keyof typeof singletons;
export type SingletonData<K extends SingletonKey> = (typeof singletons)[K]['initial'];

export const singletonList: AnySingleton[] = Object.values(singletons);

export { homeHero };
export type { SingletonDefinition };
