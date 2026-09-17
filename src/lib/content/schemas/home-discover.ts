/**
 * The home page "تعرّف على الشريط" section: an intro plus the tile cards under it.
 *
 * A tile's image is a `media` id; with none set, the tile shows the placeholder
 * artwork keyed by its `id` in src/lib/home-assets.ts.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, itemId, mediaId, siteHref } from './fields.ts';

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

const tileV2 = tile.extend({
  /** Decorative: the tile's own text is overlaid on it. */
  imageId: mediaId.nullable(),
});

const v2 = v1.extend({
  tiles: z.array(tileV2).min(1).max(4),
});

/** v4 added the English siblings of the copy fields. */
const tileV4 = tileV2.extend({
  eyebrowEn: enText(40),
  headingEn: enText(160),
});

const v4 = v2.extend({
  eyebrowEn: enText(40),
  headingEn: enText(400),
  tiles: z.array(tileV4).min(1).max(4),
});

export type HomeDiscoverTile = z.infer<typeof tileV4>;
export type HomeDiscover = z.infer<typeof v4>;

/** v2 made each tile's image uploadable. Existing tiles start with none. */
function v1_to_v2(data: unknown): unknown {
  const prev = data as z.infer<typeof v1>;
  return { ...prev, tiles: prev.tiles.map((t) => ({ ...t, imageId: null })) };
}

/** The pages these tiles link to were ported after the tiles shipped as `'#'`. */
const V2_TO_V3_HREFS: Record<string, string> = {
  'tile-groups': '/technologies',
  'tile-whatwedo': '/about',
};

function v2_to_v3(data: unknown): unknown {
  const prev = data as z.infer<typeof v2>;
  return {
    ...prev,
    tiles: prev.tiles.map((t) => ({ ...t, href: V2_TO_V3_HREFS[t.id] ?? t.href })),
  };
}

export const homeDiscover = defineSingleton<HomeDiscover>({
  key: 'home_discover',
  version: 4,
  schema: v4,
  migrations: [v1_to_v2, v2_to_v3, addEnFields],
  initial: {
    eyebrowAr: 'تعرّف على الشريط',
    eyebrowEn: '',
    headingAr:
      'شريط شراكات الابتكار المائي مبادرة وطنية تمتدّ على ساحل البحر الأحمر، تجمع الجهات الحكومية والمؤسسات البحثية والقطاع الخاص لتسريع تطوير تقنيات المياه وتبنّيها في المملكة.',
    headingEn: '',
    tiles: [
      {
        id: 'tile-groups',
        eyebrowAr: 'مجموعات العمل',
        eyebrowEn: '',
        headingAr: '٨ مجموعات عمل تعالج تحديات قطاع المياه في المملكة',
        headingEn: '',
        href: '/technologies',
        imageId: null,
      },
      {
        id: 'tile-whatwedo',
        eyebrowAr: 'ما نقوم به',
        eyebrowEn: '',
        headingAr: 'من التحلية وإعادة الاستخدام إلى الإدارة الذكية للمياه — الابتكار هو المفتاح',
        headingEn: '',
        href: '/about',
        imageId: null,
      },
    ],
  },
});
