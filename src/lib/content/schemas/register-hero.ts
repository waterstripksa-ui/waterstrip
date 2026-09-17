/**
 * The register-interest page's title band. Rendered through the shared
 * PageHero component; the breadcrumb is page structure, not admin-editable
 * content.
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

export type RegisterHero = z.infer<typeof v2>;

export const registerHero = defineSingleton<RegisterHero>({
  key: 'register_hero',
  version: 2,
  schema: v2,
  migrations: [addEnFields],
  initial: {
    titleAr: 'سجّل اهتمامك',
    titleEn: '',
    ledeAr: 'عرّفنا بجهتك والتحدي الذي ترغب بالعمل عليه، وسنتواصل معك بحزمة العضوية.',
    ledeEn: '',
  },
});
