/**
 * The home page strategic-partners strip.
 *
 * A partner's logo is a `media` id; with none set, the partner shows the shared
 * placeholder mark from src/lib/home-assets.ts. The marquee duplication is presentation and is
 * done in the page's script, not stored here.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, itemId, mediaId, siteHref } from './fields.ts';

const partner = z.object({
  id: itemId,
  /** Also the logo's alt text and the link's title. */
  nameAr: arText(1, 120),
  href: siteHref,
});

const v1 = z.object({
  labelAr: arText(1, 60),
  noteAr: arText(1, 200),
  items: z.array(partner).min(1).max(20),
});

const partnerV2 = partner.extend({
  /** A transparent PNG works best: it keeps its alpha through normalisation. */
  logoId: mediaId.nullable(),
});

const v2 = v1.extend({
  items: z.array(partnerV2).min(1).max(20),
});

/** v4 added the English siblings of the copy fields. */
const partnerV4 = partnerV2.extend({
  nameEn: enText(120),
});

const v4 = v2.extend({
  labelEn: enText(60),
  noteEn: enText(200),
  items: z.array(partnerV4).min(1).max(20),
});

export type HomePartner = z.infer<typeof partnerV4>;
export type HomePartners = z.infer<typeof v4>;

/** v2 made each partner's logo uploadable. Existing partners start with none. */
function v1_to_v2(data: unknown): unknown {
  const prev = data as z.infer<typeof v1>;
  return { ...prev, items: prev.items.map((item) => ({ ...item, logoId: null })) };
}

/** Every partner logo links to the members page; ported after they shipped as `'#'`. */
function v2_to_v3(data: unknown): unknown {
  const prev = data as z.infer<typeof v2>;
  return { ...prev, items: prev.items.map((item) => ({ ...item, href: '/members' })) };
}

export const homePartners = defineSingleton<HomePartners>({
  key: 'home_partners',
  version: 4,
  schema: v4,
  migrations: [v1_to_v2, v2_to_v3, addEnFields],
  initial: {
    labelAr: 'الجهات الاستراتيجية',
    labelEn: 'Strategic Partners',
    noteAr: 'جهات استراتيجية ضمن شريط شراكات الابتكار المائي.',
    noteEn: 'Strategic partners within Water STRIP.',
    items: [
      {
        id: 'pa-swa',
        nameAr: 'الهيئة السعودية للمياه',
        nameEn: 'Saudi Water Authority',
        href: '/members',
        logoId: null,
      },
      { id: 'pa-nwc', nameAr: 'الشركة الوطنية للمياه', nameEn: 'National Water Company', href: '/members', logoId: null },
      {
        id: 'pa-kaust',
        nameAr: 'جامعة الملك عبدالله للعلوم والتقنية',
        nameEn: 'King Abdullah University of Science and Technology (KAUST)',
        href: '/members',
        logoId: null,
      },
      { id: 'pa-acwa', nameAr: 'أكوا باور', nameEn: 'ACWA Power', href: '/members', logoId: null },
      { id: 'pa-veolia', nameAr: 'فيوليا', nameEn: 'Veolia', href: '/members', logoId: null },
      { id: 'pa-enowa', nameAr: 'نيوم ENOWA', nameEn: 'NEOM ENOWA', href: '/members', logoId: null },
      {
        id: 'pa-kaec',
        nameAr: 'مدينة الملك عبدالله الاقتصادية',
        nameEn: 'King Abdullah Economic City (KAEC)',
        href: '/members',
        logoId: null,
      },
    ],
  },
});
