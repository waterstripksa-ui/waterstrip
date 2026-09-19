/**
 * The home page "مجموعة العمل" panel: a photo on one side, the title, blurb and a
 * link to the working groups on the other. The photo is a `media` id; with none
 * set it shows the repo's placeholder (src/lib/home-assets.ts).
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, enText, mediaId, siteHref } from './fields.ts';

const v1 = z.object({
  titleAr: arText(1, 60),
  titleEn: enText(60),
  ledeAr: arText(1, 300),
  ledeEn: enText(300),
  textAr: arText(1, 400),
  textEn: enText(400),
  ctaLabelAr: arText(1, 40),
  ctaLabelEn: enText(40),
  ctaHref: siteHref,
  imageId: mediaId.nullable(),
  imageAltAr: arText(1, 200),
  imageAltEn: enText(200),
});

export type HomeWorkingGroups = z.infer<typeof v1>;

export const homeWorkingGroups = defineSingleton<HomeWorkingGroups>({
  key: 'home_working_groups',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    titleAr: 'مجموعة العمل',
    titleEn: 'Working Groups',
    ledeAr: 'مجموعات عمل الخبراء في الشريط، مصنّفة حسب التحدي الذي تعالجه في قطاع المياه.',
    ledeEn: "The Strip's expert working groups, classified by the water-sector challenge each one addresses.",
    textAr:
      'ثماني مجموعات عمل خبراء تُعنى بتطوير الحلول والمبادرات التقنية التي تسرّع تبنّي تقنيات المياه في منظومة القطاع.',
    textEn:
      'Eight expert working groups develop the technical solutions and initiatives that accelerate the adoption of water technologies across the sector.',
    ctaLabelAr: 'استعرض مجموعات العمل',
    ctaLabelEn: 'Explore the working groups',
    ctaHref: '/technologies',
    imageId: null,
    imageAltAr: 'ريّ بالتنقيط يسقي شتلة في حقل، ويدان تثبّتان الشتلة في التربة',
    imageAltEn: 'Drip irrigation watering a seedling in a field, with two hands setting the seedling in the soil',
  },
});
