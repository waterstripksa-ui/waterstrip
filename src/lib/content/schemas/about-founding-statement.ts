/**
 * The about page "البيان التأسيسي" closing quote, next to an illustration.
 *
 * The illustration is a `media` id; with none set, it shows the placeholder
 * artwork in src/lib/about-assets.ts.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, mediaId, siteHref } from './fields.ts';

const v1 = z.object({
  eyebrowAr: arText(1, 40),
  quoteAr: arText(1, 500),
  attributionAr: arText(1, 120),
  ctaLabelAr: arText(1, 40),
  ctaHref: siteHref,
  imageId: mediaId.nullable(),
});

export type AboutFoundingStatement = z.infer<typeof v1>;

/** `members` was ported after this CTA shipped pointing at `'#'`. */
function v1_to_v2(data: unknown): unknown {
  return { ...(data as z.infer<typeof v1>), ctaHref: '/members' };
}

export const aboutFoundingStatement = defineSingleton<AboutFoundingStatement>({
  key: 'about_founding_statement',
  version: 2,
  schema: v1,
  migrations: [v1_to_v2],
  initial: {
    eyebrowAr: 'البيان التأسيسي',
    quoteAr:
      'تمثّل المبادرة فرصة تحوّلية لتشكيل مستقبل قطاع المياه في المملكة العربية السعودية، ونتطلّع إلى انضمام أصحاب المصلحة الرئيسيين في دفع هذه الرؤية للأمام.',
    attributionAr: 'وكالة البحث والابتكار — وزارة البيئة والمياه والزراعة',
    ctaLabelAr: 'تعرّف على الأعضاء',
    ctaHref: '/members',
    imageId: null,
  },
});
