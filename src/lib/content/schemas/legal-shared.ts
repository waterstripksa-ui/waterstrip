/**
 * Shared shape for the legal/policy pages (terms, privacy, cookies,
 * accessibility): a page title plus a dynamic, admin-managed list of
 * (title, prose) sections.
 *
 * Unlike every other surface in this codebase, admins here may add, remove,
 * reorder and retitle sections — not just edit fixed fields. That is a
 * deliberate, narrow exception to "admins edit content, never structure"
 * (see docs/porting-the-mockup.md's Content model rules): every section
 * renders through the exact same heading+prose template, so nothing an
 * admin does here can swap a component or change the page's layout, and the
 * prose body itself is never raw HTML — it only ever produces the small,
 * fixed set of tags `src/lib/prose.ts` knows how to render.
 *
 * Version 2 of every legal page added the English (`xEn`) siblings; version 1
 * had only the Arabic fields, and `addEnFields` upgrades it.
 */
import { z } from 'zod';
import { arText, enText, itemId } from './fields.ts';

export const legalSection = z.object({
  id: itemId,
  titleAr: arText(1, 120),
  titleEn: enText(120),
  bodyAr: arText(1, 6000),
  bodyEn: enText(6000),
});

export type LegalSection = z.infer<typeof legalSection>;

export const legalPageSchema = z.object({
  titleAr: arText(1, 80),
  titleEn: enText(80),
  updatedLabelAr: arText(1, 60),
  updatedLabelEn: enText(60),
  sections: z.array(legalSection).min(1).max(20),
});

export type LegalPage = z.infer<typeof legalPageSchema>;
