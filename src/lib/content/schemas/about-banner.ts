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
import { arText, mediaId, siteHref } from './fields.ts';

const v1 = z.object({
  eyebrowAr: arText(1, 40),
  headingAr: arText(1, 120),
  ledeAr: arText(1, 300),
  ctaLabelAr: arText(1, 40),
  ctaHref: siteHref,
  imageId: mediaId.nullable(),
});

export type AboutBanner = z.infer<typeof v1>;

export const aboutBanner = defineSingleton<AboutBanner>({
  key: 'about_banner',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    eyebrowAr: 'العضوية',
    headingAr: 'انضم إلى الشريط',
    ledeAr: 'شارك في تشكيل مستقبل قطاع المياه في المملكة.',
    ctaLabelAr: 'سجّل اهتمامك',
    ctaHref: '#',
    imageId: null,
  },
});
