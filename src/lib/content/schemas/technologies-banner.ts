/**
 * The working-group detail page's closing membership banner — same shape as
 * about_banner, but a separate surface so this page's copy can be edited
 * independently. The technologies listing page has no banner section (see
 * waterstrip/technologies.html), so this is the only banner surface this
 * feature needs.
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

export type TechnologiesBanner = z.infer<typeof v1>;

export const technologiesBanner = defineSingleton<TechnologiesBanner>({
  key: 'technologies_banner',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    eyebrowAr: 'العضوية',
    headingAr: 'انضم إلى الشريط',
    ledeAr: 'شارك في تشكيل مستقبل قطاع المياه في المملكة.',
    ctaLabelAr: 'سجّل اهتمامك بالمشاركة',
    ctaHref: '/register-interest',
    imageId: null,
  },
});
