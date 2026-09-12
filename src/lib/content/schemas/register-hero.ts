/**
 * The register-interest page's title band. Rendered through the shared
 * PageHero component; the breadcrumb is page structure, not admin-editable
 * content.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText } from './fields.ts';

const v1 = z.object({
  titleAr: arText(1, 80),
  ledeAr: arText(1, 300),
});

export type RegisterHero = z.infer<typeof v1>;

export const registerHero = defineSingleton<RegisterHero>({
  key: 'register_hero',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    titleAr: 'سجّل اهتمامك',
    ledeAr: 'عرّفنا بجهتك والتحدي الذي ترغب بالعمل عليه، وسنتواصل معك بحزمة العضوية.',
  },
});
