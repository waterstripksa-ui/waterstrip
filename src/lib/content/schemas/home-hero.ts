/**
 * The home page hero carousel.
 *
 * Every field is a named, typed value the hero component reads by name — never
 * HTML, never a list of component names (AGENTS.md, "Admins edit content, never
 * structure"). A panel's background image is a `media` id; with none set, the
 * panel shows the placeholder artwork keyed by its `id` in src/lib/home-assets.ts.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, itemId, mediaId, siteHref } from './fields.ts';

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

const heroPanelV3 = heroPanel.extend({
  /** The slide background. Decorative: the panel's heading carries the meaning. */
  imageId: mediaId.nullable(),
});

const v3 = z.object({
  panels: z.array(heroPanelV3).min(1).max(6),
});

/** v6 added the English siblings of each panel's copy. */
const heroPanelV6 = heroPanelV3.extend({
  eyebrowEn: enText(40),
  headingEn: enText(160),
  ctaLabelEn: enText(40),
});

const v6 = z.object({
  panels: z.array(heroPanelV6).min(1).max(6),
});

export type HomeHeroPanel = z.infer<typeof heroPanelV6>;
export type HomeHero = z.infer<typeof v6>;

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

/** v3 made each slide's background an uploadable image. Existing slides start with none. */
function v2_to_v3(data: unknown): unknown {
  const prev = data as z.infer<typeof v2>;
  return { ...prev, panels: prev.panels.map((panel) => ({ ...panel, imageId: null })) };
}

/** The pages these `ctaHref`s point at were ported after the panels shipped as `'#'`. */
const v3_TO_V4_HREFS: Record<string, string> = {
  'hero-1': '/media#news',
  'hero-2': '/members',
  'hero-3': '/about',
};

function v3_to_v4(data: unknown): unknown {
  const prev = data as z.infer<typeof v3>;
  return {
    ...prev,
    panels: prev.panels.map((panel) => ({
      ...panel,
      ctaHref: v3_TO_V4_HREFS[panel.id] ?? panel.ctaHref,
    })),
  };
}

/** v4 sent the "الإعلانات" panel's "المزيد" button to `/about` instead of the news hub. */
const v4_TO_V5_HREFS: Record<string, string> = {
  'hero-3': '/media#news',
};

function v4_to_v5(data: unknown): unknown {
  const prev = data as z.infer<typeof v3>;
  return {
    ...prev,
    panels: prev.panels.map((panel) => ({
      ...panel,
      ctaHref: v4_TO_V5_HREFS[panel.id] ?? panel.ctaHref,
    })),
  };
}

export const homeHero = defineSingleton<HomeHero>({
  key: 'home_hero',
  version: 6,
  schema: v6,
  migrations: [v1_to_v2, v2_to_v3, v3_to_v4, v4_to_v5, addEnFields],
  initial: {
    panels: [
      {
        id: 'hero-1',
        eyebrowAr: 'رؤى الشريط',
        eyebrowEn: 'Strip Insights',
        headingAr: 'معرفة تطبيقية تسرّع تبنّي تقنيات المياه في المملكة.',
        headingEn: 'Applied knowledge accelerating the adoption of water technologies in the Kingdom.',
        ctaLabelAr: 'استعرض الرؤى',
        ctaLabelEn: 'Browse insights',
        ctaHref: '/media#news',
        imageId: null,
      },
      {
        id: 'hero-2',
        eyebrowAr: 'الشراكات',
        eyebrowEn: 'Partnerships',
        headingAr: 'جهات حكومية ومؤسسات بحثية وقطاع خاص — شريط واحد للابتكار المائي.',
        headingEn: 'Government bodies, research institutions and the private sector — one strip for water innovation.',
        ctaLabelAr: 'تعرّف على الأعضاء',
        ctaLabelEn: 'Meet the members',
        ctaHref: '/members',
        imageId: null,
      },
      {
        id: 'hero-3',
        eyebrowAr: 'الإعلانات',
        eyebrowEn: 'Announcements',
        headingAr: 'وزارة البيئة والمياه والزراعة تُطلق شريط شراكات الابتكار المائي من جدة.',
        headingEn: 'The Ministry of Environment, Water and Agriculture launches Water STRIP from Jeddah.',
        ctaLabelAr: 'اعرف المزيد',
        ctaLabelEn: 'Learn more',
        ctaHref: '/media#news',
        imageId: null,
      },
    ],
  },
});
