/**
 * The closing membership banner shared by every legal/utility page (terms,
 * privacy, cookies, accessibility, sitemap, 404, and the login/forgot-password
 * auth pages). Unlike about_banner and contact_banner —
 * each a primary page's own conversion moment, worth tuning independently —
 * these are secondary chrome pages that all show the identical mockup copy,
 * so they share one editable surface instead of four near-duplicate ones.
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

/** English siblings of the copy fields, added in v2. */
const v2 = v1.extend({
  eyebrowEn: enText(40),
  headingEn: enText(120),
  ledeEn: enText(300),
  ctaLabelEn: enText(40),
});

export type LegalBanner = z.infer<typeof v2>;

export const legalBanner = defineSingleton<LegalBanner>({
  key: 'legal_banner',
  version: 2,
  schema: v2,
  migrations: [addEnFields],
  initial: {
    eyebrowAr: 'العضوية',
    eyebrowEn: 'Membership',
    headingAr: 'انضم إلى الشريط',
    headingEn: 'Join the Strip',
    ledeAr: 'شارك في تشكيل مستقبل قطاع المياه في المملكة.',
    ledeEn: 'Help shape the future of the water sector in the Kingdom.',
    ctaLabelAr: 'سجّل اهتمامك',
    ctaLabelEn: 'Register your interest',
    ctaHref: '/register-interest',
    imageId: null,
  },
});
