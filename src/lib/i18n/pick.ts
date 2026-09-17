/**
 * Choosing between a field's Arabic and English values.
 *
 * English copy is optional (`enText` in src/lib/content/schemas/fields.ts). An
 * untranslated field shows its Arabic value on the English site, and the element
 * holding it is marked `lang="ar" dir="rtl"` so screen readers pronounce it as
 * Arabic and the text shapes right-to-left inside the LTR page.
 */
import { localizePath, type Locale } from './locale.ts';

function hasEnglish(en: string | null | undefined): en is string {
  return typeof en === 'string' && en.trim() !== '';
}

/** The text to show. Use alone for attribute values (`alt`, `<title>`, `content`). */
export function pick(locale: Locale, ar: string, en: string | null | undefined): string {
  return locale === 'en' && hasEnglish(en) ? en : ar;
}

/** Whether `pick` would fall back to Arabic on the English site. */
export function isFallback(locale: Locale, en: string | null | undefined): boolean {
  return locale === 'en' && !hasEnglish(en);
}

/**
 * Attributes to spread on the element that renders `pick(...)`. Spread onto the
 * mockup's own element rather than wrapping it, so the markup stays verbatim.
 */
export function fallbackAttrs(
  locale: Locale,
  en: string | null | undefined,
): { lang?: 'ar'; dir?: 'rtl' } {
  return isFallback(locale, en) ? { lang: 'ar', dir: 'rtl' } : {};
}

/**
 * For string lists (article tags): the English list when it has entries,
 * otherwise the Arabic one.
 */
export function pickList(
  locale: Locale,
  ar: readonly string[],
  en: readonly string[] | null | undefined,
): { items: readonly string[]; fallback: boolean } {
  const useEn = locale === 'en' && !!en && en.length > 0;
  return { items: useEn ? en : ar, fallback: locale === 'en' && !useEn };
}

/** Any content object with an `xAr` field and, optionally, its `xEn` sibling. */
export type Bilingual<K extends string> = { readonly [P in `${K}Ar`]: string } & {
  readonly [P in `${K}En`]?: string | null;
};

/**
 * Binds the helpers above to one locale, keyed by a field's base name, for
 * terse markup: `<h2 {...L.attrs(banner, 'heading')}>{L.text(banner, 'heading')}</h2>`.
 */
export function localizer(locale: Locale) {
  const en = <K extends string>(obj: Bilingual<K>, key: K) =>
    (obj as Record<string, string | null | undefined>)[`${key}En`];
  const ar = <K extends string>(obj: Bilingual<K>, key: K) =>
    (obj as Record<string, string>)[`${key}Ar`];
  return {
    locale,
    text: <K extends string>(obj: Bilingual<K>, key: K): string =>
      pick(locale, ar(obj, key), en(obj, key)),
    attrs: <K extends string>(obj: Bilingual<K>, key: K) => fallbackAttrs(locale, en(obj, key)),
    href: (href: string): string => localizePath(href, locale),
  };
}

export type Localizer = ReturnType<typeof localizer>;
