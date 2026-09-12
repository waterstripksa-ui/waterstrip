/**
 * Resolves the home page's images: an uploaded `media` row when the payload
 * references one, placeholder artwork otherwise.
 *
 * The placeholders are repo assets under `public/img/` and are **not content** —
 * they are what a slot shows until an admin uploads a photo, so the page never
 * renders an empty frame. Each map is keyed by the *stable item id* in the
 * singleton payload, not by list position, so reordering or removing an item
 * cannot shuffle the artwork. An item an admin adds has no entry and falls back
 * to the shared mark.
 *
 * Never add a path here that stands in for a real photo: that is what an upload
 * is for.
 */
import { getMedia } from './content/cache.ts';

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

/** Every partner shows the shared mark until a logo is uploaded. */
export const partnerLogos: Record<string, string> = {};

/** The closing membership banner's placeholder. Fixed — the banner is not a list. */
export const ABOUT_BANNER_IMG = '/img/hero/banner.svg';

export function imageFor(map: Record<string, string>, id: string): string {
  return map[id] ?? PLACEHOLDER_IMG;
}

/** Spread onto an `<img>`. Dimensions are present only for uploads, which store them. */
export interface ResolvedImage {
  src: string;
  width?: number;
  height?: number;
}

/**
 * An uploaded image when `mediaId` resolves, `fallback` when it is null or
 * dangling — a reference imported ahead of its media rows renders the
 * placeholder rather than a broken image.
 *
 * Alt text is the caller's decision, not the media row's: a hero background is
 * decorative (`alt=""`) wherever it is used, and a partner logo is named by the
 * partner, not by how the file was described at upload.
 */
export function resolveImage(mediaId: string | null, fallback: string): ResolvedImage {
  const media = mediaId ? getMedia(mediaId) : null;
  return media ? { src: media.url, width: media.width, height: media.height } : { src: fallback };
}
