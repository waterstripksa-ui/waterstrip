/**
 * The home page closing membership banner.
 *
 * The banner artwork is a `media` id; with none set, it shows the placeholder
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
});

const v2 = v1.extend({
  /** Decorative background behind the banner copy. */
  imageId: mediaId.nullable(),
});

/** English siblings of the copy fields, added in v4. */
const v4 = v2.extend({
  eyebrowEn: enText(40),
  headingEn: enText(120),
  ledeEn: enText(300),
  ctaLabelEn: enText(40),
});

export type HomeAboutBanner = z.infer<typeof v4>;

/** v2 made the background uploadable. An existing banner starts with none. */
function v1_to_v2(data: unknown): unknown {
  return { ...(data as z.infer<typeof v1>), imageId: null };
}

/** `register-interest` was ported after this CTA shipped pointing at `'#'`. */
function v2_to_v3(data: unknown): unknown {
  return { ...(data as z.infer<typeof v2>), ctaHref: '/register-interest' };
}

export const homeAboutBanner = defineSingleton<HomeAboutBanner>({
  key: 'home_about_banner',
  version: 4,
  schema: v4,
  migrations: [v1_to_v2, v2_to_v3, addEnFields],
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
