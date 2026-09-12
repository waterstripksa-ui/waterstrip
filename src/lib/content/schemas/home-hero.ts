/**
 * The home page hero.
 *
 * Deliberately starts at a single field. Every field added here must be a named,
 * typed value the hero component reads by name — never HTML, never a list of
 * component names (AGENTS.md, "Admins edit content, never structure").
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';

const v1 = z.object({
  /** The `h1` in `waterstrip/index.html`. Plain text: the component adds markup. */
  titleAr: z.string().trim().min(1).max(160),
});

export type HomeHero = z.infer<typeof v1>;

export const homeHero = defineSingleton<HomeHero>({
  key: 'home_hero',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    titleAr: 'معرفة تطبيقية تسرّع تبنّي تقنيات المياه في المملكة.',
  },
});
