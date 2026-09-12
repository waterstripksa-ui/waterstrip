/**
 * Field builders shared by the singleton schemas.
 *
 * These exist so every surface validates the same way — an href is an href
 * everywhere, a list item id has one shape — rather than each schema
 * re-deriving the rules and drifting.
 */
import { z } from 'zod';

/**
 * Required Arabic copy. Trimmed, so whitespace-only fails `min`.
 *
 * The messages are Arabic because they are rendered verbatim next to the field
 * in the dashboard, which is Arabic-only like the rest of the site.
 */
export function arText(min: number, max: number) {
  return z
    .string()
    .trim()
    .min(min, min === 1 ? 'هذا الحقل مطلوب.' : `الحد الأدنى ${min} حرفًا.`)
    .max(max, `الحد الأقصى ${max} حرفًا.`);
}

/**
 * A relative path or an on-site anchor. No absolute URLs and no
 * protocol-relative ones: the CMS is not a link manager pointing at arbitrary
 * origins. `'#'` passes, which is what links to not-yet-ported pages use.
 */
export const siteHref = z
  .string()
  .trim()
  .min(1, 'هذا الحقل مطلوب.')
  .max(200, 'الحد الأقصى 200 حرف.')
  .refine(
    (v) => !/^[a-z]+:/i.test(v) && !v.startsWith('//'),
    'يجب أن يكون مسارًا داخليًا — الروابط الخارجية غير مسموحة.',
  );

/**
 * A list item's stable identity. Generated when an admin adds an item and never
 * re-keyed afterwards, so reordering and removal cannot shuffle the build-time
 * image map in src/lib/home-assets.ts.
 */
export const itemId = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'معرّف غير صالح.');
