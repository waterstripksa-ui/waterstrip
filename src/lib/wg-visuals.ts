/**
 * Working-group card art, ported from waterstrip/assets/js/main.js's grid
 * builder (§22) and detail-page filler (§18). No group in the reference has an
 * uploaded photo, so cards render a themed icon instead — keyed by `challenge`,
 * not by slug, so a new group with a known challenge gets a sensible default.
 */

export const WORKING_GROUP_ICONS: Record<string, string> = {
  'flood-platform':
    'M3 16c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0M3 20c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0M12 3v7M9.5 7.5L12 10l2.5-2.5',
  'brine-mining': 'M12 3c3 4.2 5 6.4 5 8.8a5 5 0 11-10 0C7 9.4 9 7.2 12 3zM9.5 12.5h5M12 10v5',
  'sludge-plant': 'M4 8h16v9a3 3 0 01-3 3H7a3 3 0 01-3-3zM4 8l2-4h12l2 4M8 12h8M8 16h5',
  'tank-platform':
    'M5 7c0-1.1 1.3-2 3-2s3 .9 3 2v10c0 1.1-1.3 2-3 2s-3-.9-3-2zM13 7c0-1.1 1.3-2 3-2s3 .9 3 2v10c0 1.1-1.3 2-3 2s-3-.9-3-2zM5 11h6M13 13h6',
  'aquifer-storage':
    'M3 9h18M3 14h18M12 2v6M9.5 5.5L12 8l2.5-2.5M7 18.5c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0',
  'zeolite-irrigation':
    'M12 3c3 4.2 5 6.5 5 9a5 5 0 11-10 0c0-2.5 2-4.8 5-9zM12 22v-4M9.5 20h5',
  antiscalant: 'M6 4v16M10 4v16M14 4v16M18 4v16M4 9h16M4 15h16',
  'solutions-link':
    'M12 4.5a2.2 2.2 0 100 4.4 2.2 2.2 0 000-4.4zM5 15.1a2.2 2.2 0 100 4.4 2.2 2.2 0 000-4.4zM19 15.1a2.2 2.2 0 100 4.4 2.2 2.2 0 000-4.4zM10.4 8.4L6.4 14.2M13.6 8.4l4 5.8M7.2 17.3h9.6',
};

/** Fallback icon per challenge, for a slug the map above does not name. */
const CHALLENGE_ICON: Record<string, string> = {
  supply: WORKING_GROUP_ICONS['aquifer-storage'],
  treat: WORKING_GROUP_ICONS['sludge-plant'],
  reuse: WORKING_GROUP_ICONS['brine-mining'],
  smart: WORKING_GROUP_ICONS['solutions-link'],
};

export function iconFor(slug: string, challenge: string): string {
  return WORKING_GROUP_ICONS[slug] ?? CHALLENGE_ICON[challenge] ?? WORKING_GROUP_ICONS['solutions-link'];
}

/** Card/hero art background per challenge — main.js §22's THEME, verbatim. */
export const WORKING_GROUP_THEME: Record<string, string> = {
  supply: 'linear-gradient(135deg,#0F3D78 0%,#1A77BC 100%)',
  treat: 'linear-gradient(135deg,#123F80 0%,#2B8CCC 100%)',
  reuse: 'linear-gradient(135deg,#154A91 0%,#2FB2DC 100%)',
  smart: 'linear-gradient(135deg,#0E3568 0%,#2B8CCC 100%)',
};

export const CHALLENGE_LABELS_AR: Record<string, string> = {
  supply: 'الإمداد',
  treat: 'المعالجة',
  reuse: 'إعادة الاستخدام',
  smart: 'الحلول الذكية',
};
