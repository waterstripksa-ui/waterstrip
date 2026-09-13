/**
 * The members listing and member detail pages' shared closing membership
 * banner — same shape as media_banner, and shared the same way media_banner
 * is shared between /media and /article/[slug]: both member pages carry an
 * identical `.about-banner` section in the reference.
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

export type MembersBanner = z.infer<typeof v1>;

export const membersBanner = defineSingleton<MembersBanner>({
  key: 'members_banner',
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
