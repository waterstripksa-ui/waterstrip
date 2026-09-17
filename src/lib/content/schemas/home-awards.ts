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
    eyebrowEn: 'Excellence',
    headingAr: 'الجوائز والتكريم',
    headingEn: 'Awards & Recognition',
    ledeAr:
      'تكريمات نالها الشريط وترشيحات دخلها خلال سنته الأولى، تعكس أثر العمل المشترك بين أعضائه في قطاع المياه.',
    ledeEn:
      "Honors received and nominations earned by the Strip during its founding year, reflecting the impact of joint work among its members in the water sector.",
    ctaLabelAr: 'انضم إلى الشريط',
    ctaLabelEn: 'Join the Strip',
    ctaHref: '/register-interest',
    hidden: false,
    items: [
      { id: 'aw-global-esg', titleAr: 'جائزة Global ESG', titleEn: 'Global ESG Award', bodyAr: 'تكريم حصل عليه الشريط في 2025.', bodyEn: 'An honor received by the Strip in 2025.' },
      { id: 'aw-steves', titleAr: "جائزة Steve's Award", titleEn: "Steve's Award", bodyAr: 'تكريم حصل عليه الشريط في 2026.', bodyEn: 'An honor received by the Strip in 2026.' },
      {
        id: 'aw-idra-ppp',
        titleAr: 'ترشيح — التميّز في الشراكات بين القطاعين العام والخاص',
        titleEn: 'Nomination — Excellence in Public-Private Partnerships',
        bodyAr: 'ضمن جوائز IDRA للصناعة والاستدامة.',
        bodyEn: 'Part of the IDRA Industry & Sustainability Awards.',
      },
      {
        id: 'aw-idra-reuse',
        titleAr: 'ترشيح — القيادة الملهمة في سياسات إعادة استخدام المياه',
        titleEn: 'Nomination — Inspirational Leadership in Water Reuse Policy',
        bodyAr: 'ضمن جوائز IDRA للصناعة والاستدامة.',
        bodyEn: 'Part of the IDRA Industry & Sustainability Awards.',
      },
    ],
  },
});
