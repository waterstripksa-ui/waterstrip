/**
 * The singleton registry. Adding a surface means adding it here — the migration
 * script, the export envelope and the cache all iterate this object, so nothing
 * else needs to learn about a new key.
 */
import { homeHero } from './home-hero.ts';
import { homeDiscover } from './home-discover.ts';
import { homeChallenges } from './home-challenges.ts';
import { homeAwards } from './home-awards.ts';
import { homeMap } from './home-map.ts';
import { homeWorkingGroups } from './home-working-groups.ts';
import { corridorHero } from './corridor-hero.ts';
import { homePartners } from './home-partners.ts';
import { homeAboutBanner } from './home-about-banner.ts';
import { aboutHero } from './about-hero.ts';
import { aboutMission } from './about-mission.ts';
import { aboutGlance } from './about-glance.ts';
import { aboutGoals } from './about-goals.ts';
import { aboutFoundingStatement } from './about-founding-statement.ts';
import { aboutBanner } from './about-banner.ts';
import { contactHero } from './contact-hero.ts';
import { contactInfo } from './contact-info.ts';
import { contactBanner } from './contact-banner.ts';
import { registerHero } from './register-hero.ts';
import { registerInfo } from './register-info.ts';
import { legalBanner } from './legal-banner.ts';
import { legalTerms } from './legal-terms.ts';
import { legalPrivacy } from './legal-privacy.ts';
import { legalCookies } from './legal-cookies.ts';
import { legalAccessibility } from './legal-accessibility.ts';
import { technologiesBanner } from './technologies-banner.ts';
import { mediaBanner } from './media-banner.ts';
import { membersBanner } from './members-banner.ts';
import { footerSocial } from './footer-social.ts';
import type { SingletonDefinition } from './types.ts';

/** Iteration type. The payload generic is erased because the surfaces differ. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySingleton = SingletonDefinition<any>;

export const singletons = {
  home_hero: homeHero,
  home_discover: homeDiscover,
  home_challenges: homeChallenges,
  home_awards: homeAwards,
  home_map: homeMap,
  home_working_groups: homeWorkingGroups,
  corridor_hero: corridorHero,
  home_partners: homePartners,
  home_about_banner: homeAboutBanner,
  about_hero: aboutHero,
  about_mission: aboutMission,
  about_glance: aboutGlance,
  about_goals: aboutGoals,
  about_founding_statement: aboutFoundingStatement,
  about_banner: aboutBanner,
  contact_hero: contactHero,
  contact_info: contactInfo,
  contact_banner: contactBanner,
  register_hero: registerHero,
  register_info: registerInfo,
  legal_banner: legalBanner,
  legal_terms: legalTerms,
  legal_privacy: legalPrivacy,
  legal_cookies: legalCookies,
  legal_accessibility: legalAccessibility,
  technologies_banner: technologiesBanner,
  media_banner: mediaBanner,
  members_banner: membersBanner,
  footer_social: footerSocial,
} as const;

export type SingletonKey = keyof typeof singletons;
export type SingletonData<K extends SingletonKey> = (typeof singletons)[K]['initial'];

export const singletonList: AnySingleton[] = Object.values(singletons);

/** Narrows an arbitrary string — a route param, an import envelope key — to a known surface. */
export function isSingletonKey(value: string): value is SingletonKey {
  return Object.prototype.hasOwnProperty.call(singletons, value);
}

export {
  homeHero,
  homeDiscover,
  homeChallenges,
  homeAwards,
  homeMap,
  homeWorkingGroups,
  corridorHero,
  homePartners,
  homeAboutBanner,
  aboutHero,
  aboutMission,
  aboutGlance,
  aboutGoals,
  aboutFoundingStatement,
  aboutBanner,
  contactHero,
  contactInfo,
  contactBanner,
  registerHero,
  registerInfo,
  legalBanner,
  legalTerms,
  legalPrivacy,
  legalCookies,
  legalAccessibility,
  technologiesBanner,
  mediaBanner,
  membersBanner,
  footerSocial,
};
export type { SingletonDefinition };
