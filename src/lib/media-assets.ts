/**
 * Resolves an image field to what actually renders: an uploaded `media` row
 * when the payload references one, placeholder artwork otherwise.
 *
 * Placeholder maps are page-specific and live next to each page (e.g.
 * src/lib/home-assets.ts, src/lib/about-assets.ts), keyed by the *stable item
 * id* in that page's singleton payload, not by list position, so reordering or
 * removing an item cannot shuffle the artwork. An item an admin adds has no
 * entry and falls back to the shared mark.
 *
 * Never add a path here that stands in for a real photo: that is what an
 * upload is for.
 */
import { getMedia } from './content/cache.ts';

/** Shown for any list item without an entry in its page's placeholder map. */
export const PLACEHOLDER_IMG = '/img/mark-ws-color.svg';

/** The closing membership banner's placeholder. Shared by every page that ends with it. */
export const MEMBERSHIP_BANNER_IMG = '/img/hero/banner.svg';

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
