/**
 * The home page "تعرّف على الشريط" intro. (Up to v4 it also carried two tile cards
 * under the intro, `tiles`; they are no longer part of the design and v5 drops them.)
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

const v5 = z.object({
  eyebrowAr: arText(1, 40),
  eyebrowEn: enText(40),
  headingAr: arText(1, 400),
  headingEn: enText(400),
});

export type HomeDiscover = z.infer<typeof v5>;

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

/** The tile cards are gone from the home page. */
function v4_to_v5(data: unknown): unknown {
  const { tiles: _tiles, ...rest } = data as z.infer<typeof v4>;
  return rest;
}

export const homeDiscover = defineSingleton<HomeDiscover>({
  key: 'home_discover',
  version: 5,
  schema: v5,
  migrations: [v1_to_v2, v2_to_v3, addEnFields, v4_to_v5],
  initial: {
    eyebrowAr: 'تعرّف على الشريط',
    eyebrowEn: 'Discover the Strip',
    headingAr:
      'شريط شراكات الابتكار المائي مبادرة وطنية تمتدّ على ساحل البحر الأحمر، تجمع الجهات الحكومية والمؤسسات البحثية والقطاع الخاص لتسريع تطوير تقنيات المياه وتبنّيها في المملكة.',
    headingEn:
      'Water STRIP is a national initiative along the Red Sea coast, bringing together government bodies, research institutions and the private sector to accelerate the development and adoption of water technologies in the Kingdom.',
  },
});
