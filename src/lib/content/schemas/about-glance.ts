/**
 * The about page "نظرة عامة" stat strip: exactly four figures, laid out in a
 * fixed four-column grid in the mockup — a fifth stat has nowhere to go, so
 * this is a fixed-length tuple rather than an open list.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, itemId } from './fields.ts';

const stat = z.object({
  id: itemId,
  value: z.number().int().min(0).max(999999),
  labelAr: arText(1, 60),
});

const v1 = z.object({
  /** When true, the public page skips rendering this section entirely. */
  hidden: z.boolean(),
  headingAr: arText(1, 60),
  stats: z.array(stat).length(4),
});

export type AboutGlanceStat = z.infer<typeof stat>;
export type AboutGlance = z.infer<typeof v1>;

export const aboutGlance = defineSingleton<AboutGlance>({
  key: 'about_glance',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    hidden: false,
    headingAr: 'نظرة عامة',
    stats: [
      { id: 'gl-members', value: 29, labelAr: 'عضوًا في الشريط' },
      { id: 'gl-countries', value: 7, labelAr: 'دول ممثَّلة' },
      { id: 'gl-groups', value: 8, labelAr: 'مجموعات عمل' },
      { id: 'gl-assets', value: 8, labelAr: 'أصول وجهات على الشريط' },
    ],
  },
});
