/**
 * The migration step every singleton appended when English was added: next to
 * each Arabic field (`headingAr`, `bodyAr1`) it adds the English sibling
 * (`headingEn`, `bodyEn1`) as the empty string — "not translated yet" — walking
 * into nested objects and list items.
 *
 * Migrations are historical constants (see types.ts). Never change what this
 * returns; a later shape change appends its own migration instead.
 */
const AR_KEY = /^(.+)Ar(\d*)$/;

export function addEnFields(data: unknown): unknown {
  if (Array.isArray(data)) return data.map(addEnFields);
  if (data === null || typeof data !== 'object') return data;

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    out[key] = addEnFields(value);
    const match = AR_KEY.exec(key);
    if (!match) continue;
    const enKey = `${match[1]}En${match[2]}`;
    if (enKey in data) continue;
    if (typeof value === 'string') out[enKey] = '';
    else if (Array.isArray(value) && value.every((v) => typeof v === 'string')) out[enKey] = [];
  }
  return out;
}
