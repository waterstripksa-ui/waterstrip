/**
 * The member grid's purely-decorative accent-colour rotation — ported from
 * waterstrip/members.html's `.member-card--a`..`--f` modifiers. Six colours
 * cycling by list position, unrelated to any field (see the note in
 * member-grid.css).
 */
const ACCENTS = ['a', 'b', 'c', 'd', 'e', 'f'] as const;

export function accentFor(index: number): string {
  return ACCENTS[index % ACCENTS.length];
}
