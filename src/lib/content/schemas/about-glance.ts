/**
 * The about page "نظرة عامة" stat strip: exactly four figures, laid out in a
 * fixed four-column grid in the mockup — a fifth stat has nowhere to go, so
 * this is a fixed-length tuple rather than an open list.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, itemId } from './fields.ts';

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

/** v2 added the English siblings of the copy fields. */
const statV2 = stat.extend({
  labelEn: enText(60),
});

const v2 = v1.extend({
  headingEn: enText(60),
  stats: z.array(statV2).length(4),
});

export type AboutGlanceStat = z.infer<typeof statV2>;
export type AboutGlance = z.infer<typeof v2>;

export const aboutGlance = defineSingleton<AboutGlance>({
  key: 'about_glance',
  version: 2,
  schema: v2,
  migrations: [addEnFields],
  initial: {
    hidden: false,
    headingAr: 'نظرة عامة',
    headingEn: 'At a glance',
    stats: [
      { id: 'gl-members', value: 29, labelAr: 'عضوًا في الشريط', labelEn: 'members of the Strip' },
      { id: 'gl-countries', value: 7, labelAr: 'دول ممثَّلة', labelEn: 'countries represented' },
      { id: 'gl-groups', value: 8, labelAr: 'مجموعات عمل', labelEn: 'working groups' },
      { id: 'gl-assets', value: 8, labelAr: 'أصول وجهات على الشريط', labelEn: 'assets and sites on the Strip' },
    ],
  },
});
