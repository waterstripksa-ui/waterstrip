/**
 * The closing membership banner shared by every legal/utility page (terms,
 * privacy, cookies, accessibility). Unlike about_banner and contact_banner —
 * each a primary page's own conversion moment, worth tuning independently —
 * these are secondary chrome pages that all show the identical mockup copy,
 * so they share one editable surface instead of four near-duplicate ones.
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

export type LegalBanner = z.infer<typeof v1>;

export const legalBanner = defineSingleton<LegalBanner>({
  key: 'legal_banner',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    eyebrowAr: 'العضوية',
    headingAr: 'انضم إلى الشريط',
    ledeAr: 'شارك في تشكيل مستقبل قطاع المياه في المملكة.',
    ctaLabelAr: 'سجّل اهتمامك',
    ctaHref: '/register-interest',
    imageId: null,
  },
});
