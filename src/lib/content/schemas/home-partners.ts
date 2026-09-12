/**
 * The home page strategic-partners strip.
 *
 * A partner's logo is not content — it resolves from the item `id` through the
 * build-time map in src/lib/home-assets.ts, which currently points every partner
 * at the shared placeholder mark. The marquee duplication is presentation and is
 * done in the page's script, not stored here.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, itemId, siteHref } from './fields.ts';

const partner = z.object({
  id: itemId,
  /** Also the logo's alt text and the link's title. */
  nameAr: arText(1, 120),
  href: siteHref,
});

const v1 = z.object({
  labelAr: arText(1, 60),
  noteAr: arText(1, 200),
  items: z.array(partner).min(1).max(20),
});

export type HomePartner = z.infer<typeof partner>;
export type HomePartners = z.infer<typeof v1>;

export const homePartners = defineSingleton<HomePartners>({
  key: 'home_partners',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    labelAr: 'الجهات الاستراتيجية',
    noteAr: 'جهات استراتيجية ضمن شريط شراكات الابتكار المائي.',
    items: [
      { id: 'pa-swa', nameAr: 'الهيئة السعودية للمياه', href: '#' },
      { id: 'pa-nwc', nameAr: 'الشركة الوطنية للمياه', href: '#' },
      { id: 'pa-kaust', nameAr: 'جامعة الملك عبدالله للعلوم والتقنية', href: '#' },
      { id: 'pa-acwa', nameAr: 'أكوا باور', href: '#' },
      { id: 'pa-veolia', nameAr: 'فيوليا', href: '#' },
      { id: 'pa-enowa', nameAr: 'نيوم ENOWA', href: '#' },
      { id: 'pa-kaec', nameAr: 'مدينة الملك عبدالله الاقتصادية', href: '#' },
    ],
  },
});
