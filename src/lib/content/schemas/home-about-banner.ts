/**
 * The home page closing membership banner.
 *
 * The banner artwork is a build-time asset in src/lib/home-assets.ts, not content.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, siteHref } from './fields.ts';

const v1 = z.object({
  eyebrowAr: arText(1, 40),
  headingAr: arText(1, 120),
  ledeAr: arText(1, 300),
  ctaLabelAr: arText(1, 40),
  ctaHref: siteHref,
});

export type HomeAboutBanner = z.infer<typeof v1>;

export const homeAboutBanner = defineSingleton<HomeAboutBanner>({
  key: 'home_about_banner',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    eyebrowAr: 'العضوية',
    headingAr: 'انضم إلى الشريط',
    ledeAr: 'شارك في تشكيل مستقبل قطاع المياه في المملكة.',
    ctaLabelAr: 'سجّل اهتمامك',
    ctaHref: '#',
  },
});
