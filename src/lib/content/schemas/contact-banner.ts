/**
 * The contact page's own closing membership banner — same shape as
 * home_about_banner and about_banner, but a separate surface so each page's
 * copy can be edited independently.
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

export type ContactBanner = z.infer<typeof v1>;

/** `register-interest` was ported after this CTA shipped pointing at `'#'`. */
function v1_to_v2(data: unknown): unknown {
  return { ...(data as z.infer<typeof v1>), ctaHref: '/register-interest' };
}

export const contactBanner = defineSingleton<ContactBanner>({
  key: 'contact_banner',
  version: 2,
  schema: v1,
  migrations: [v1_to_v2],
  initial: {
    eyebrowAr: 'العضوية',
    headingAr: 'انضم إلى الشريط',
    ledeAr: 'شارك في تشكيل مستقبل قطاع المياه في المملكة.',
    ctaLabelAr: 'سجّل اهتمامك',
    ctaHref: '/register-interest',
    imageId: null,
  },
});
