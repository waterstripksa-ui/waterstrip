/**
 * Placeholder image maps for the home page's editable slots — repo assets
 * under `public/img/` shown until an admin uploads a photo. Each map is keyed
 * by the *stable item id* in the singleton payload, not by list position, so
 * reordering or removing an item cannot shuffle the artwork.
 *
 * See src/lib/media-assets.ts for how a slot resolves to an upload or a
 * placeholder.
 */
export const heroSlideImages: Record<string, string> = {
  'hero-1': '/img/hero/hero-1.svg',
  'hero-2': '/img/hero/hero-2.svg',
  'hero-3': '/img/hero/hero-3.svg',
};

export const discoverTileImages: Record<string, string> = {
  'tile-groups': '/img/ph/ph-group.svg',
  'tile-whatwedo': '/img/ph/ph-whatwedo.svg',
};

/** The working-group panel's photo until one is uploaded. */
export const WORKING_GROUPS_IMG = '/img/drip-irrigation.jpg';

/** Every partner shows the shared mark until a logo is uploaded. */
export const partnerLogos: Record<string, string> = {};
