/**
 * Build-time imagery for the home page. **This is not CMS content.**
 *
 * The dashboard edits text only. Images stay repo assets under `public/img/`
 * because the media pipeline (a `media` table, hashed blobs on disk, an upload
 * endpoint) is designed in docs/content-storage.md but not built yet, and that
 * doc rules out storing a path, a URL or a filename as a content value.
 *
 * Each map is keyed by the *stable item id* in the singleton payload, not by list
 * position, so an admin reordering or removing an item cannot shuffle the
 * artwork. An item an admin adds has no entry here and falls back to the
 * placeholder below — giving it real artwork is a code change, by design.
 *
 * When the media pipeline lands, these maps become media ids on the payload and
 * this module goes away.
 */

/** Shown for any list item without an entry in the maps below. */
export const PLACEHOLDER_IMG = '/img/mark-waterstrip.svg';

export const heroSlideImages: Record<string, string> = {
  'hero-1': '/img/hero/hero-1.svg',
  'hero-2': '/img/hero/hero-2.svg',
  'hero-3': '/img/hero/hero-3.svg',
};

export const discoverTileImages: Record<string, string> = {
  'tile-groups': '/img/ph/ph-group.svg',
  'tile-whatwedo': '/img/ph/ph-whatwedo.svg',
};

export const challengeImages: Record<string, string> = {
  'ch-scarcity': '/img/ph/ph-scarcity.svg',
  'ch-desal': '/img/ph/ph-desal.svg',
  'ch-wastewater': '/img/ph/ph-wastewater.svg',
  'ch-infra': '/img/ph/ph-infra.svg',
  'ch-consumption': '/img/ph/ph-consumption.svg',
  'ch-groundwater': '/img/ph/ph-groundwater.svg',
  'ch-fragmentation': '/img/ph/ph-fragmentation.svg',
};

/** Every partner shows the shared mark until real logos are supplied. */
export const partnerLogos: Record<string, string> = {};

/** The closing membership banner's artwork. Fixed — the banner is not a list. */
export const ABOUT_BANNER_IMG = '/img/hero/banner.svg';

export function imageFor(map: Record<string, string>, id: string): string {
  return map[id] ?? PLACEHOLDER_IMG;
}
