/**
 * Locales and locale-aware paths.
 *
 * Arabic is the default and lives at the site root with no prefix; English lives
 * under `/en` (Astro's `i18n` config in astro.config.mjs, `prefixDefaultLocale:
 * false`). Plain module with no Astro imports, so scripts and React can use it.
 */
export const LOCALES = ['ar', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ar';

const EN_PREFIX = '/en';

/**
 * Paths that exist once, whatever the page language: uploads, static assets,
 * the dashboard, and the auth pages that front it (see docs/i18n.md).
 */
const UNLOCALIZED = /^\/(?:media\/|img\/|mockup\/|_astro\/|api\/|admin(?:[/?#]|$)|login(?:[/?#]|$)|forgot-password(?:[/?#]|$))/;

/** Narrows `Astro.currentLocale` (or any string) to a supported locale. */
export function toLocale(value: string | undefined | null): Locale {
  return value === 'en' ? 'en' : DEFAULT_LOCALE;
}

/**
 * The locale a URL path belongs to. Pages use this rather than
 * `Astro.currentLocale` so a rewrite to a 404 and an unmatched `/en/...` path
 * resolve the same way as a normal page.
 */
export function localeOfPath(pathname: string): Locale {
  return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`) ? 'en' : 'ar';
}

export function dirOf(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/** `/en/about` → `/about`; an Arabic path is returned unchanged. */
export function stripLocale(pathname: string): string {
  if (pathname === EN_PREFIX) return '/';
  if (pathname.startsWith(`${EN_PREFIX}/`)) return pathname.slice(EN_PREFIX.length);
  return pathname;
}

/** False for pages that only exist in Arabic, e.g. `/login`. */
export function isLocalizable(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//') && !UNLOCALIZED.test(href);
}

/**
 * Points an on-site href at the given locale's version of the page. Anchors,
 * `mailto:`, external URLs and unlocalized paths pass through unchanged, so
 * every stored or literal href can be run through this.
 */
export function localizePath(href: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE || !isLocalizable(href)) return href;
  if (localeOfPath(href.replace(/[?#].*$/, '')) === 'en') return href;
  return `${EN_PREFIX}${href}`;
}

/** The same page in the other language, for the language switcher and hreflang. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const base = stripLocale(pathname);
  return isLocalizable(base) ? localizePath(base, target) : localizePath('/', target);
}
