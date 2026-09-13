/**
 * The home page closing membership banner.
 *
 * The banner artwork is a `media` id; with none set, it shows the placeholder
 * artwork in src/lib/media-assets.ts.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, mediaId, siteHref } from './fields.ts';

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

export type HomeAboutBanner = z.infer<typeof v2>;

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
  version: 3,
  schema: v2,
  migrations: [v1_to_v2, v2_to_v3],
  initial: {
    eyebrowAr: 'العضوية',
    headingAr: 'انضم إلى الشريط',
    ledeAr: 'شارك في تشكيل مستقبل قطاع المياه في المملكة.',
    ctaLabelAr: 'سجّل اهتمامك',
    ctaHref: '/register-interest',
    imageId: null,
  },
});
