/**
 * The singleton registry. Adding a surface means adding it here — the migration
 * script, the export envelope and the cache all iterate this object, so nothing
 * else needs to learn about a new key.
 */
import { homeHero } from './home-hero.ts';
import { homeDiscover } from './home-discover.ts';
import { homeChallenges } from './home-challenges.ts';
import { homeAwards } from './home-awards.ts';
import { homePartners } from './home-partners.ts';
import { homeAboutBanner } from './home-about-banner.ts';
import type { SingletonDefinition } from './types.ts';

/** Iteration type. The payload generic is erased because the surfaces differ. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySingleton = SingletonDefinition<any>;

export const singletons = {
  home_hero: homeHero,
  home_discover: homeDiscover,
  home_challenges: homeChallenges,
  home_awards: homeAwards,
  home_partners: homePartners,
  home_about_banner: homeAboutBanner,
} as const;

export type SingletonKey = keyof typeof singletons;
export type SingletonData<K extends SingletonKey> = (typeof singletons)[K]['initial'];

export const singletonList: AnySingleton[] = Object.values(singletons);

/** Narrows an arbitrary string — a route param, an import envelope key — to a known surface. */
export function isSingletonKey(value: string): value is SingletonKey {
  return Object.prototype.hasOwnProperty.call(singletons, value);
}

export { homeHero, homeDiscover, homeChallenges, homeAwards, homePartners, homeAboutBanner };
export type { SingletonDefinition };
