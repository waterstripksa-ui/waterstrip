/**
 * The home page "الجوائز والتكريم" panel.
 *
 * The 01–04 ordinals the panel prints are *not* stored: they are derived from
 * list position at render time, so reordering cannot desync a number from its
 * award.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, itemId, siteHref } from './fields.ts';

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

export type HomeAward = z.infer<typeof award>;
export type HomeAwards = z.infer<typeof v1>;

export const homeAwards = defineSingleton<HomeAwards>({
  key: 'home_awards',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    eyebrowAr: 'التميّز',
    headingAr: 'الجوائز والتكريم',
    ledeAr:
      'تكريمات نالها الشريط وترشيحات دخلها خلال سنته الأولى، تعكس أثر العمل المشترك بين أعضائه في قطاع المياه.',
    ctaLabelAr: 'انضم إلى الشريط',
    ctaHref: '#',
    items: [
      { id: 'aw-global-esg', titleAr: 'جائزة Global ESG', bodyAr: 'تكريم حصل عليه الشريط في 2025.' },
      { id: 'aw-steves', titleAr: "جائزة Steve's Award", bodyAr: 'تكريم حصل عليه الشريط في 2026.' },
      {
        id: 'aw-idra-ppp',
        titleAr: 'ترشيح — التميّز في الشراكات بين القطاعين العام والخاص',
        bodyAr: 'ضمن جوائز IDRA للصناعة والاستدامة.',
      },
      {
        id: 'aw-idra-reuse',
        titleAr: 'ترشيح — القيادة الملهمة في سياسات إعادة استخدام المياه',
        bodyAr: 'ضمن جوائز IDRA للصناعة والاستدامة.',
      },
    ],
  },
});
