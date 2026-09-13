/**
 * Renders one legal/policy section body into markup.
 *
 * Admins write plain text with a tiny, fixed set of conventions — a blank
 * line starts a new paragraph, a line starting with "- " joins a bullet
 * list, `**text**` is bold, and `[text](url)` is a link restricted to
 * relative paths, mailto:, and https:. This is deliberately not a rich-text
 * or raw-HTML field: the admin can only ever produce this handful of tags,
 * never arbitrary markup, so the "no freeform HTML field" rule in
 * docs/porting-the-mockup.md holds even though the *set* of sections on a
 * legal page is itself dynamic. See that doc's Content model rules section.
 */

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const LINK = /\[([^\]]+)\]\((\/[^\s")]*|https:\/\/[^\s")]+|mailto:[^\s")]+)\)/g;
const BOLD = /\*\*([^*]+)\*\*/g;

function renderInline(text: string): string {
  return escapeHtml(text)
    .replace(LINK, (_m, label: string, url: string) => `<a href="${url}" style="color:var(--c-link)">${label}</a>`)
    .replace(BOLD, (_m, bold: string) => `<b>${bold}</b>`);
}

export function renderProse(text: string): string {
  return text
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      const isList = lines.length > 0 && lines.every((line) => line.startsWith('- '));
      if (isList) {
        return `<ul>${lines.map((line) => `<li>${renderInline(line.slice(2))}</li>`).join('')}</ul>`;
      }
      return `<p>${renderInline(lines.join(' '))}</p>`;
    })
    .join('');
}
