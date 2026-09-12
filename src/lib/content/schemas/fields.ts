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
 * re-keyed afterwards, so reordering and removal cannot shuffle the placeholder
 * artwork map in src/lib/home-assets.ts.
 */
export const itemId = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'معرّف غير صالح.');

/**
 * A reference to a `media` row: the SHA-256 of the stored file. Never a path, a
 * URL or a filename.
 *
 * Zod checks the *shape* only. Whether the row exists is the repository's job
 * (`setSingleton`), because a migration must tolerate a dangling id — an import
 * can legitimately arrive before its image files do. Every image field must be
 * built from this exact schema object: `collectMediaIds` finds references by
 * identity, not by field name.
 */
export const mediaId = z.string().regex(/^[0-9a-f]{64}$/, 'معرّف صورة غير صالح.');

export interface MediaRef {
  path: Array<string | number>;
  id: string;
}

/**
 * Walks a schema and a payload that satisfies it in step, returning every
 * non-null value sitting at a `mediaId` position.
 *
 * Driven by the schema rather than by key names, so an image field is checked
 * whatever it is called (`imageId`, `logoId`), and a string that merely looks
 * like a hash is not.
 */
export function collectMediaIds(schema: z.core.$ZodType, data: unknown): MediaRef[] {
  const refs: MediaRef[] = [];

  function walk(node: z.core.$ZodType, value: unknown, path: Array<string | number>): void {
    if (value === null || value === undefined) return;
    if (node === mediaId) {
      if (typeof value === 'string') refs.push({ path, id: value });
      return;
    }

    const def = node._zod.def as z.core.$ZodTypeDef & {
      shape?: Record<string, z.core.$ZodType>;
      element?: z.core.$ZodType;
      innerType?: z.core.$ZodType;
      in?: z.core.$ZodType;
    };

    switch (def.type) {
      case 'object':
        if (typeof value !== 'object') return;
        for (const [key, child] of Object.entries(def.shape ?? {})) {
          walk(child, (value as Record<string, unknown>)[key], [...path, key]);
        }
        return;
      case 'array':
        if (!Array.isArray(value) || !def.element) return;
        value.forEach((item, i) => walk(def.element!, item, [...path, i]));
        return;
      case 'nullable':
      case 'optional':
      case 'default':
      case 'prefault':
      case 'readonly':
      case 'nonoptional':
      case 'catch':
        if (def.innerType) walk(def.innerType, value, path);
        return;
      case 'pipe':
        if (def.in) walk(def.in, value, path);
        return;
      default:
        return;
    }
  }

  walk(schema, data, []);
  return refs;
}
