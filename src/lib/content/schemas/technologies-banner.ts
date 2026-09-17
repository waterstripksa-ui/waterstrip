/**
 * The working-group detail page's closing membership banner — same shape as
 * about_banner, but a separate surface so this page's copy can be edited
 * independently. The technologies listing page has no banner section (see
 * waterstrip/technologies.html), so this is the only banner surface this
 * feature needs.
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

/** English siblings of the copy fields, added in v2. */
const v2 = v1.extend({
  eyebrowEn: enText(40),
  headingEn: enText(120),
  ledeEn: enText(300),
  ctaLabelEn: enText(40),
});

export type TechnologiesBanner = z.infer<typeof v2>;

export const technologiesBanner = defineSingleton<TechnologiesBanner>({
  key: 'technologies_banner',
  version: 2,
  schema: v2,
  migrations: [addEnFields],
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
