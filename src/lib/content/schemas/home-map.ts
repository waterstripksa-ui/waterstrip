/**
 * The corridor map section ("الامتداد الجغرافي"), shown on the home page and on
 * /corridor: an aerial map of the Rabigh → Jeddah coast beside a table of assets.
 *
 * The map marks four fixed areas (Rabigh, KAEC, Thuwal, Jeddah) — their position
 * on the coast is real-world geography (src/scripts/corridor-map.js), not
 * content, so each is a named field rather than a list an admin could reorder or
 * extend. `hubs` is the repeatable asset list: each asset names the area it sits
 * in (`clusterId`), which is a choice among those four, and the table's 01, 02, …
 * ordinal is derived from list position. The map's popup for an area is the
 * assets that name it. The table is capped at twelve rows, the mockup's limit.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, itemId } from './fields.ts';

export const CLUSTER_IDS = ['rabigh', 'kaec', 'thuwal', 'jeddah'] as const;
export type ClusterId = (typeof CLUSTER_IDS)[number];

const cluster = z.object({
  nameAr: arText(1, 40),
  taglineAr: arText(1, 140),
});

const hub = z.object({
  id: itemId,
  nameAr: arText(1, 120),
  descriptionAr: arText(1, 200),
});

const v1 = z.object({
  eyebrowAr: arText(1, 40),
  headingAr: arText(1, 120),
  ledeAr: arText(1, 400),
  clusters: z.object({
    rabigh: cluster,
    kaec: cluster,
    thuwal: cluster,
    jeddah: cluster,
  }),
  hubs: z.array(hub).min(1).max(12),
});

/** v2 added the English siblings of the copy fields. */
const clusterV2 = cluster.extend({
  nameEn: enText(40),
  taglineEn: enText(140),
});

const hubV2 = hub.extend({
  nameEn: enText(120),
  descriptionEn: enText(200),
});

const v2 = v1.extend({
  eyebrowEn: enText(40),
  headingEn: enText(120),
  ledeEn: enText(400),
  clusters: z.object({
    rabigh: clusterV2,
    kaec: clusterV2,
    thuwal: clusterV2,
    jeddah: clusterV2,
  }),
  hubs: z.array(hubV2).min(1).max(12),
});

/**
 * v3 rebuilt the section as the mockup's corridor map + asset table: an asset now
 * names its area, the areas lose their tagline (the popup lists their assets
 * instead), and the section gains a CTA to /corridor.
 */
const clusterV3 = z.object({
  nameAr: arText(1, 40),
  nameEn: enText(40),
});

const hubV3 = hubV2.extend({
  clusterId: z.enum(CLUSTER_IDS),
});

const v3 = v2.extend({
  ctaLabelAr: arText(1, 40),
  ctaLabelEn: enText(40),
  clusters: z.object({
    rabigh: clusterV3,
    kaec: clusterV3,
    thuwal: clusterV3,
    jeddah: clusterV3,
  }),
  hubs: z.array(hubV3).min(1).max(12),
});

export type HomeMapCluster = z.infer<typeof clusterV3>;
export type HomeMapHub = z.infer<typeof hubV3>;
export type HomeMap = z.infer<typeof v3>;

/** Where v2 drew each list position's dot: its position picked the area. */
const V2_SLOT_CLUSTERS: ClusterId[] = [
  'thuwal', 'thuwal', 'kaec', 'rabigh', 'rabigh', 'kaec', 'thuwal', 'rabigh', 'rabigh', 'kaec', 'kaec', 'thuwal',
];

/** The two Jeddah assets v2 only carried inside the Jeddah area's tagline. */
const JEDDAH_HUBS: HomeMapHub[] = [
  {
    id: 'hub-kaia',
    clusterId: 'jeddah',
    nameAr: 'مطار الملك عبدالعزيز الدولي',
    nameEn: 'King Abdulaziz International Airport',
    descriptionAr: 'البوابة الجوية للممر',
    descriptionEn: "The corridor's air gateway",
  },
  {
    id: 'hub-haramain',
    clusterId: 'jeddah',
    nameAr: 'قطار الحرمين السريع',
    nameEn: 'Haramain High Speed Railway',
    descriptionAr: 'الربط البري السريع',
    descriptionEn: 'Fast rail connection',
  },
];

/** v2's shipped copy and the mockup's replacement for it, per Arabic field. */
const V3_COPY_REFRESH: Record<string, [old: string, next: string]> = {
  eyebrowAr: ['أصول الشريط', 'الامتداد الجغرافي'],
  eyebrowEn: ['Strip Assets', 'Geographic Reach'],
  ledeAr: [
    'يمتد الشريط على طول ساحل البحر الأحمر، ليجمع أبرز أصول المياه في المنطقة — محطات المعالجة، والحرم الجامعي، ومرافق التحلية — ضمن ممر واحد متصل.',
    'يمتد الشريط على ساحل البحر الأحمر، ويجمع أبرز الأصول المائية في المنطقة — محطات المعالجة والحرم الجامعي ومرافق التحلية — ضمن ممر جغرافي واحد متصل.',
  ],
  ledeEn: [
    "The Strip extends along the Red Sea coast, bringing together the region's key water assets — treatment plants, the university campus and desalination facilities — within a single connected corridor.",
    "The Strip runs along the Red Sea coast, bringing together the region's key water assets — treatment plants, the university campus and desalination facilities — in a single connected geographic corridor.",
  ],
};

/** The mockup's table wording for the assets v2 shipped, keyed by the asset's id. */
const V3_HUB_REFRESH: Record<string, Partial<Record<'nameAr' | 'descriptionAr', [old: string, next: string]>>> = {
  'hub-thuwal-stp': {
    descriptionAr: ['معالجة مياه الصرف الصحي التي تغذي مشاريع إعادة الاستخدام التجريبية', 'مياه معالجة تغذّي تجارب إعادة الاستخدام'],
  },
  'hub-kaust': { descriptionAr: ['مرتكز بحثي ومختبر حي للتجارب', 'مرساة بحثية ومختبر حي'] },
  'hub-kaec-park': { descriptionAr: ['قاعدة التسويق التجاري والصناعة', 'قاعدة التسويق والصناعة'] },
  'hub-acwa': { descriptionAr: ['طاقة وقدرة تحلية', 'قدرات الطاقة والتحلية'] },
  'hub-veolia': { nameAr: ['فيوليا (رابغ 3)', 'فيوليا — رابغ 3'], descriptionAr: ['عمليات تحلية المياه', 'عمليات التحلية'] },
  'hub-nwc-stp': {
    nameAr: ['محطة معالجة الصرف الصحي التابعة لشركة المياه الوطنية', 'محطة معالجة الصرف — الشركة الوطنية للمياه'],
    descriptionAr: ['معالجة تابعة لشركة المياه الوطنية', 'معالجة مياه الصرف الصحي'],
  },
  'hub-wtiira': { nameAr: ['مركز أبحاث وتقنيات المياه (WTIIRA)', 'مركز WTIIRA'] },
  'hub-swa-oasis': { nameAr: ['واحة المياه برابغ', 'واحة مياه رابغ'], descriptionAr: ['منشأة تابعة لهيئة المياه السعودية', 'منشأة الهيئة السعودية للمياه'] },
};

/**
 * Copy an admin never touched moves to the mockup's new wording; anything they
 * edited is left alone. Assets are placed in the area their list position used
 * to draw them in, and the two Jeddah assets join the list.
 */
function v2_to_v3(data: unknown): unknown {
  const prev = data as z.infer<typeof v2>;
  const refreshed: Record<string, unknown> = { ...prev };
  for (const [field, [old, next]] of Object.entries(V3_COPY_REFRESH)) {
    if (refreshed[field] === old) refreshed[field] = next;
  }

  const hubs: HomeMapHub[] = prev.hubs.map((hub, i) => {
    const out: Record<string, unknown> = { ...hub, clusterId: V2_SLOT_CLUSTERS[i] ?? 'thuwal' };
    for (const [field, [old, next]] of Object.entries(V3_HUB_REFRESH[hub.id] ?? {})) {
      if (out[field] === old) out[field] = next;
    }
    return out as HomeMapHub;
  });
  const taken = new Set(hubs.map((hub) => hub.id));
  for (const jeddah of JEDDAH_HUBS) {
    if (hubs.length < 12 && !taken.has(jeddah.id)) hubs.push(jeddah);
  }

  // The map label is the short name (the table's area button repeats it), and a long
  // label would run off the narrow map.
  const kaecAr = prev.clusters.kaec.nameAr === 'مدينة الملك عبدالله الاقتصادية' ? 'مدينة الملك عبدالله' : prev.clusters.kaec.nameAr;
  const kaecEn = prev.clusters.kaec.nameEn === 'King Abdullah Economic City (KAEC)' ? 'KAEC' : prev.clusters.kaec.nameEn;
  const clusters = Object.fromEntries(
    CLUSTER_IDS.map((id) => [
      id,
      {
        nameAr: id === 'kaec' ? kaecAr : prev.clusters[id].nameAr,
        nameEn: id === 'kaec' ? kaecEn : prev.clusters[id].nameEn,
      },
    ]),
  );
  return { ...refreshed, ctaLabelAr: 'استعرض الممر كاملاً', ctaLabelEn: 'Explore the full corridor', clusters, hubs };
}

export const homeMap = defineSingleton<HomeMap>({
  key: 'home_map',
  version: 3,
  schema: v3,
  migrations: [addEnFields, v2_to_v3],
  initial: {
    eyebrowAr: 'الامتداد الجغرافي',
    eyebrowEn: 'Geographic Reach',
    headingAr: 'ممر واحد، من رابغ إلى جدة.',
    headingEn: 'One corridor, from Rabigh to Jeddah.',
    ledeAr: V3_COPY_REFRESH.ledeAr[1],
    ledeEn: V3_COPY_REFRESH.ledeEn[1],
    ctaLabelAr: 'استعرض الممر كاملاً',
    ctaLabelEn: 'Explore the full corridor',
    clusters: {
      rabigh: { nameAr: 'رابغ', nameEn: 'Rabigh' },
      kaec: { nameAr: 'مدينة الملك عبدالله', nameEn: 'KAEC' },
      thuwal: { nameAr: 'ثول', nameEn: 'Thuwal' },
      jeddah: { nameAr: 'جدة', nameEn: 'Jeddah' },
    },
    hubs: [
      {
        id: 'hub-thuwal-stp',
        clusterId: 'thuwal',
        nameAr: 'محطة معالجة الصرف الصحي بثول',
        nameEn: 'Thuwal Wastewater Treatment Plant',
        descriptionAr: 'مياه معالجة تغذّي تجارب إعادة الاستخدام',
        descriptionEn: 'Wastewater treatment feeding pilot water-reuse projects',
      },
      {
        id: 'hub-kaust',
        clusterId: 'thuwal',
        nameAr: 'حرم جامعة الملك عبدالله للعلوم والتقنية',
        nameEn: 'King Abdullah University of Science and Technology (KAUST) Campus',
        descriptionAr: 'مرساة بحثية ومختبر حي',
        descriptionEn: 'A research hub and living lab for experimentation',
      },
      {
        id: 'hub-kaec-park',
        clusterId: 'kaec',
        nameAr: 'مجمع أعمال مدينة الملك عبدالله الاقتصادية',
        nameEn: 'King Abdullah Economic City Business Park',
        descriptionAr: 'قاعدة التسويق والصناعة',
        descriptionEn: 'Commercial and industrial marketing base',
      },
      {
        id: 'hub-acwa',
        clusterId: 'rabigh',
        nameAr: 'منشآت أكوا باور',
        nameEn: 'ACWA Power Facilities',
        descriptionAr: 'قدرات الطاقة والتحلية',
        descriptionEn: 'Power and desalination capacity',
      },
      {
        id: 'hub-veolia',
        clusterId: 'rabigh',
        nameAr: 'فيوليا — رابغ 3',
        nameEn: 'Veolia (Rabigh 3)',
        descriptionAr: 'عمليات التحلية',
        descriptionEn: 'Water desalination operations',
      },
      {
        id: 'hub-nwc-stp',
        clusterId: 'kaec',
        nameAr: 'محطة معالجة الصرف — الشركة الوطنية للمياه',
        nameEn: 'National Water Company Wastewater Treatment Plant',
        descriptionAr: 'معالجة مياه الصرف الصحي',
        descriptionEn: 'Treatment operated by the National Water Company',
      },
      {
        id: 'hub-wtiira',
        clusterId: 'thuwal',
        nameAr: 'مركز WTIIRA',
        nameEn: 'Water Technologies & Innovation Research Institute (WTIIRA)',
        descriptionAr: 'ابتكار وأبحاث تقنيات المياه',
        descriptionEn: 'Water technology innovation and research',
      },
      {
        id: 'hub-swa-oasis',
        clusterId: 'rabigh',
        nameAr: 'واحة مياه رابغ',
        nameEn: 'Rabigh Water Oasis',
        descriptionAr: 'منشأة الهيئة السعودية للمياه',
        descriptionEn: 'A facility operated by the Saudi Water Authority',
      },
      ...JEDDAH_HUBS,
    ],
  },
});
