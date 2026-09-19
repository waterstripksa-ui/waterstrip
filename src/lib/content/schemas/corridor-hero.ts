/**
 * The /corridor page's title band, rendered through the shared PageHero
 * component. The map and asset table below it are the home page's `home_map`
 * surface, so they are edited once and read in both places.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, enText } from './fields.ts';

const v1 = z.object({
  /** The last breadcrumb, shorter than the title. */
  crumbAr: arText(1, 60),
  crumbEn: enText(60),
  titleAr: arText(1, 80),
  titleEn: enText(80),
  ledeAr: arText(1, 300),
  ledeEn: enText(300),
});

export type CorridorHero = z.infer<typeof v1>;

export const corridorHero = defineSingleton<CorridorHero>({
  key: 'corridor_hero',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    crumbAr: 'ممر ووتر ستريب',
    crumbEn: 'The Water STRIP Corridor',
    titleAr: 'ممر ووتر ستريب — من رابغ إلى جدة',
    titleEn: 'The Water STRIP Corridor — Rabigh to Jeddah',
    ledeAr: 'صفحة واحدة تجمع خريطة الممر التفاعلية وكل المعلومات عن مناطقه الأربع والجهات المشاركة فيه.',
    ledeEn: "One page with the corridor's interactive map and everything about its four areas and the entities taking part.",
  },
});
