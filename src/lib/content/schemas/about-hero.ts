/**
 * The about page's title band. Rendered through the shared PageHero
 * component; the breadcrumb is page structure, not admin-editable content.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText } from './fields.ts';

const v1 = z.object({
  titleAr: arText(1, 80),
  ledeAr: arText(1, 300),
});

/** v2 added the English siblings of the copy fields. */
const v2 = v1.extend({
  titleEn: enText(80),
  ledeEn: enText(300),
});

export type AboutHero = z.infer<typeof v2>;

export const aboutHero = defineSingleton<AboutHero>({
  key: 'about_hero',
  version: 2,
  schema: v2,
  migrations: [addEnFields],
  initial: {
    titleAr: 'عن الشريط',
    titleEn: 'About the Strip',
    ledeAr:
      'مبادرة وطنية للتعاون والتنسيق وتبادل المعرفة في ابتكار تقنيات المياه، دعمًا لرؤية السعودية 2030.',
    ledeEn:
      'A national initiative for collaboration, coordination and knowledge-sharing in water innovation, in support of Saudi Vision 2030.',
  },
});
