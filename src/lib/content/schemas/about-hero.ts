/**
 * The about page's title band. Rendered through the shared PageHero
 * component; the breadcrumb is page structure, not admin-editable content.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText } from './fields.ts';

const v1 = z.object({
  titleAr: arText(1, 80),
  ledeAr: arText(1, 300),
});

export type AboutHero = z.infer<typeof v1>;

export const aboutHero = defineSingleton<AboutHero>({
  key: 'about_hero',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    titleAr: 'عن الشريط',
    ledeAr:
      'مبادرة وطنية للتعاون والتنسيق وتبادل المعرفة في ابتكار تقنيات المياه، دعمًا لرؤية السعودية 2030.',
  },
});
