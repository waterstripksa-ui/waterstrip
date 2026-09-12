/**
 * Placeholder image map for articles with no uploaded photo yet. See
 * src/lib/media-assets.ts for how a slot resolves to an upload or a
 * placeholder. Keyed by slug, matching the reference's per-article `ph-news-*`
 * art in waterstrip/assets/img/ph/.
 */
export const articleImages: Record<string, string> = {
  launch: '/img/ph/ph-news-1.svg',
  'esg-award': '/img/ph/ph-news-2.svg',
  'steves-award': '/img/ph/ph-news-3.svg',
  'idra-host': '/img/ph/ph-news-4.svg',
};
