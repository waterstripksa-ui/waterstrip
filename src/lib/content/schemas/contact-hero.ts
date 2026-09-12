/**
 * The contact page's title band. Rendered through the shared PageHero
 * component; the breadcrumb is page structure, not admin-editable content.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText } from './fields.ts';

const v1 = z.object({
  titleAr: arText(1, 80),
  ledeAr: arText(1, 300),
});

export type ContactHero = z.infer<typeof v1>;

export const contactHero = defineSingleton<ContactHero>({
  key: 'contact_hero',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    titleAr: 'تواصل معنا',
    ledeAr: 'للاستفسارات وفرص الشراكة وطلبات الدعم، تواصل معنا.',
  },
});
