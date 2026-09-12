/**
 * The media (news & events) page's own closing membership banner — same shape
 * as about_banner and technologies_banner, kept as a separate surface so each
 * page's copy can be edited independently.
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

export type MediaBanner = z.infer<typeof v1>;

export const mediaBanner = defineSingleton<MediaBanner>({
  key: 'media_banner',
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
