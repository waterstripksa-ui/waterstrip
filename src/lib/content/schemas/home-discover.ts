/**
 * The home page "تعرّف على الشريط" section: an intro plus the tile cards under it.
 *
 * A tile's image is not content — it resolves from the tile `id` through the
 * build-time map in src/lib/home-assets.ts.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, itemId, siteHref } from './fields.ts';

const tile = z.object({
  id: itemId,
  eyebrowAr: arText(1, 40),
  headingAr: arText(1, 160),
  href: siteHref,
});

const v1 = z.object({
  eyebrowAr: arText(1, 40),
  headingAr: arText(1, 400),
  tiles: z.array(tile).min(1).max(4),
});

export type HomeDiscoverTile = z.infer<typeof tile>;
export type HomeDiscover = z.infer<typeof v1>;

export const homeDiscover = defineSingleton<HomeDiscover>({
  key: 'home_discover',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    eyebrowAr: 'تعرّف على الشريط',
    headingAr:
      'شريط شراكات الابتكار المائي مبادرة وطنية تمتدّ على ساحل البحر الأحمر، تجمع الجهات الحكومية والمؤسسات البحثية والقطاع الخاص لتسريع تطوير تقنيات المياه وتبنّيها في المملكة.',
    tiles: [
      {
        id: 'tile-groups',
        eyebrowAr: 'مجموعات العمل',
        headingAr: '٨ مجموعات عمل تعالج تحديات قطاع المياه في المملكة',
        href: '#',
      },
      {
        id: 'tile-whatwedo',
        eyebrowAr: 'ما نقوم به',
        headingAr: 'من التحلية وإعادة الاستخدام إلى الإدارة الذكية للمياه — الابتكار هو المفتاح',
        href: '#',
      },
    ],
  },
});
