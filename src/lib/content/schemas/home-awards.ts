/**
 * The home page "الجوائز والتكريم" panel.
 *
 * The 01–04 ordinals the panel prints are *not* stored: they are derived from
 * list position at render time, so reordering cannot desync a number from its
 * award.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, itemId, siteHref } from './fields.ts';

const award = z.object({
  id: itemId,
  titleAr: arText(1, 200),
  bodyAr: arText(1, 400),
});

const v1 = z.object({
  eyebrowAr: arText(1, 40),
  headingAr: arText(1, 120),
  ledeAr: arText(1, 400),
  ctaLabelAr: arText(1, 40),
  ctaHref: siteHref,
  items: z.array(award).min(1).max(12),
});

const v2 = v1.extend({
  /** When true, the public home page skips rendering this section entirely. */
  hidden: z.boolean(),
});

/** v4 added the English siblings of the copy fields. */
const awardV4 = award.extend({
  titleEn: enText(200),
  bodyEn: enText(400),
});

const v4 = v2.extend({
  eyebrowEn: enText(40),
  headingEn: enText(120),
  ledeEn: enText(400),
  ctaLabelEn: enText(40),
  items: z.array(awardV4).min(1).max(12),
});

export type HomeAward = z.infer<typeof awardV4>;
export type HomeAwards = z.infer<typeof v4>;

/** `register-interest` was ported after this CTA shipped pointing at `'#'`. */
function v2_to_v3(data: unknown): unknown {
  return { ...(data as z.infer<typeof v2>), ctaHref: '/register-interest' };
}

export const homeAwards = defineSingleton<HomeAwards>({
  key: 'home_awards',
  version: 4,
  schema: v4,
  migrations: [(data) => ({ ...(data as object), hidden: false }), v2_to_v3, addEnFields],
  initial: {
    eyebrowAr: 'التميّز',
    eyebrowEn: '',
    headingAr: 'الجوائز والتكريم',
    headingEn: '',
    ledeAr:
      'تكريمات نالها الشريط وترشيحات دخلها خلال سنته الأولى، تعكس أثر العمل المشترك بين أعضائه في قطاع المياه.',
    ledeEn: '',
    ctaLabelAr: 'انضم إلى الشريط',
    ctaLabelEn: '',
    ctaHref: '/register-interest',
    hidden: false,
    items: [
      { id: 'aw-global-esg', titleAr: 'جائزة Global ESG', titleEn: '', bodyAr: 'تكريم حصل عليه الشريط في 2025.', bodyEn: '' },
      { id: 'aw-steves', titleAr: "جائزة Steve's Award", titleEn: '', bodyAr: 'تكريم حصل عليه الشريط في 2026.', bodyEn: '' },
      {
        id: 'aw-idra-ppp',
        titleAr: 'ترشيح — التميّز في الشراكات بين القطاعين العام والخاص',
        titleEn: '',
        bodyAr: 'ضمن جوائز IDRA للصناعة والاستدامة.',
        bodyEn: '',
      },
      {
        id: 'aw-idra-reuse',
        titleAr: 'ترشيح — القيادة الملهمة في سياسات إعادة استخدام المياه',
        titleEn: '',
        bodyAr: 'ضمن جوائز IDRA للصناعة والاستدامة.',
        bodyEn: '',
      },
    ],
  },
});
