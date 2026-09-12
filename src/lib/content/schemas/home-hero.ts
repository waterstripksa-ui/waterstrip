/**
 * The home page hero carousel.
 *
 * Every field is a named, typed value the hero component reads by name — never
 * HTML, never a list of component names (AGENTS.md, "Admins edit content, never
 * structure"). A panel's background image is *not* content: it resolves from the
 * panel `id` through the build-time map in src/lib/home-assets.ts.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, itemId, siteHref } from './fields.ts';

const v1 = z.object({
  /** The `h1` in `waterstrip/index.html`. Plain text: the component adds markup. */
  titleAr: z.string().trim().min(1).max(160),
});

const heroPanel = z.object({
  id: itemId,
  /** Doubles as the carousel tab label, so it stays short. */
  eyebrowAr: arText(1, 40),
  headingAr: arText(1, 160),
  ctaLabelAr: arText(1, 40),
  ctaHref: siteHref,
});

const v2 = z.object({
  /** Rendered in order; the first panel's heading is the page `h1`. */
  panels: z.array(heroPanel).min(1).max(6),
});

export type HomeHeroPanel = z.infer<typeof heroPanel>;
export type HomeHero = z.infer<typeof v2>;

/**
 * v1 stored a single `titleAr` — the first panel's heading. The other two panels
 * were hardcoded in the page at the time, so they are restored here as the
 * literals they were. Migrations are historical constants: this function must keep
 * producing the same output even after the initial value below changes.
 */
function v1_to_v2(data: unknown): unknown {
  const prev = data as z.infer<typeof v1>;
  return {
    panels: [
      {
        id: 'hero-1',
        eyebrowAr: 'رؤى الشريط',
        headingAr: prev.titleAr,
        ctaLabelAr: 'استعرض الرؤى',
        ctaHref: '#',
      },
      {
        id: 'hero-2',
        eyebrowAr: 'الشراكات',
        headingAr: 'جهات حكومية ومؤسسات بحثية وقطاع خاص — شريط واحد للابتكار المائي.',
        ctaLabelAr: 'تعرّف على الأعضاء',
        ctaHref: '#',
      },
      {
        id: 'hero-3',
        eyebrowAr: 'الإعلانات',
        headingAr: 'وزارة البيئة والمياه والزراعة تُطلق شريط شراكات الابتكار المائي من جدة.',
        ctaLabelAr: 'اعرف المزيد',
        ctaHref: '#',
      },
    ],
  };
}

export const homeHero = defineSingleton<HomeHero>({
  key: 'home_hero',
  version: 2,
  schema: v2,
  migrations: [v1_to_v2],
  initial: {
    panels: [
      {
        id: 'hero-1',
        eyebrowAr: 'رؤى الشريط',
        headingAr: 'معرفة تطبيقية تسرّع تبنّي تقنيات المياه في المملكة.',
        ctaLabelAr: 'استعرض الرؤى',
        ctaHref: '#',
      },
      {
        id: 'hero-2',
        eyebrowAr: 'الشراكات',
        headingAr: 'جهات حكومية ومؤسسات بحثية وقطاع خاص — شريط واحد للابتكار المائي.',
        ctaLabelAr: 'تعرّف على الأعضاء',
        ctaHref: '#',
      },
      {
        id: 'hero-3',
        eyebrowAr: 'الإعلانات',
        headingAr: 'وزارة البيئة والمياه والزراعة تُطلق شريط شراكات الابتكار المائي من جدة.',
        ctaLabelAr: 'اعرف المزيد',
        ctaHref: '#',
      },
    ],
  },
});
