/**
 * The members listing and member detail pages' shared closing membership
 * banner — same shape as media_banner, and shared the same way media_banner
 * is shared between /media and /article/[slug]: both member pages carry an
 * identical `.about-banner` section in the reference.
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

export type MembersBanner = z.infer<typeof v2>;

export const membersBanner = defineSingleton<MembersBanner>({
  key: 'members_banner',
  version: 2,
  schema: v2,
  migrations: [addEnFields],
  initial: {
    eyebrowAr: 'العضوية',
    eyebrowEn: 'Membership',
    headingAr: 'انضم إلى الشريط',
    headingEn: 'Join Water STRIP',
    ledeAr: 'شارك في تشكيل مستقبل قطاع المياه في المملكة.',
    ledeEn: "Help shape the future of the water sector in the Kingdom.",
    ctaLabelAr: 'سجّل اهتمامك',
    ctaLabelEn: 'Register Interest',
    ctaHref: '/register-interest',
    imageId: null,
  },
});
