/**
 * The about page's own closing membership banner — same shape as
 * home_about_banner, but a separate surface so the two pages' copy can be
 * edited independently.
 *
 * The background is a `media` id; with none set, it shows the placeholder
 * artwork in src/lib/media-assets.ts.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, mediaId, siteHref } from './fields.ts';

const v1 = z.object({
  eyebrowAr: arText(1, 40),
  headingAr: arText(1, 120),
  ledeAr: arText(1, 300),
  ctaLabelAr: arText(1, 40),
  ctaHref: siteHref,
  imageId: mediaId.nullable(),
});

/** English siblings of the copy fields, added in v3. */
const v3 = v1.extend({
  eyebrowEn: enText(40),
  headingEn: enText(120),
  ledeEn: enText(300),
  ctaLabelEn: enText(40),
});

export type AboutBanner = z.infer<typeof v3>;

/** `register-interest` was ported after this CTA shipped pointing at `'#'`. */
function v1_to_v2(data: unknown): unknown {
  return { ...(data as z.infer<typeof v1>), ctaHref: '/register-interest' };
}

export const aboutBanner = defineSingleton<AboutBanner>({
  key: 'about_banner',
  version: 3,
  schema: v3,
  migrations: [v1_to_v2, addEnFields],
  initial: {
    eyebrowAr: 'العضوية',
    eyebrowEn: '',
    headingAr: 'انضم إلى الشريط',
    headingEn: '',
    ledeAr: 'شارك في تشكيل مستقبل قطاع المياه في المملكة.',
    ledeEn: '',
    ctaLabelAr: 'سجّل اهتمامك',
    ctaLabelEn: '',
    ctaHref: '/register-interest',
    imageId: null,
  },
});
