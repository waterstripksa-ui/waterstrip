/**
 * The home page "أصول الشريط" corridor map.
 *
 * The map draws four fixed geographic clusters (Rabigh, KAEC, Thuwal, Jeddah) —
 * their position on the coastline is real-world geography, not content, so it is
 * a named field per cluster rather than a list an admin could reorder or extend.
 *
 * `hubs` is a repeatable list, but its dot on the map is placed by list
 * position (`src/views/Home.astro`'s `MAP_HUB_SLOTS`), the same way an award's
 * 01–04 ordinal is derived from position rather than stored. Reordering the list
 * moves a dot to a different fixed slot; it cannot invent a new one, since the
 * slot table only has twelve entries.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, itemId } from './fields.ts';

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

export type HomeMapCluster = z.infer<typeof clusterV2>;
export type HomeMapHub = z.infer<typeof hubV2>;
export type HomeMap = z.infer<typeof v2>;

export const homeMap = defineSingleton<HomeMap>({
  key: 'home_map',
  version: 2,
  schema: v2,
  migrations: [addEnFields],
  initial: {
    eyebrowAr: 'أصول الشريط',
    eyebrowEn: 'Strip Assets',
    headingAr: 'ممر واحد، من رابغ إلى جدة.',
    headingEn: 'One corridor, from Rabigh to Jeddah.',
    ledeAr:
      'يمتد الشريط على طول ساحل البحر الأحمر، ليجمع أبرز أصول المياه في المنطقة — محطات المعالجة، والحرم الجامعي، ومرافق التحلية — ضمن ممر واحد متصل.',
    ledeEn:
      "The Strip extends along the Red Sea coast, bringing together the region's key water assets — treatment plants, the university campus and desalination facilities — within a single connected corridor.",
    clusters: {
      rabigh: { nameAr: 'رابغ', nameEn: 'Rabigh', taglineAr: 'أكوا باور · فيوليا · واحة هيئة المياه السعودية', taglineEn: 'ACWA Power · Veolia · Saudi Water Authority Oasis' },
      kaec: { nameAr: 'مدينة الملك عبدالله الاقتصادية', nameEn: 'King Abdullah Economic City (KAEC)', taglineAr: 'مجمع الأعمال · محطة معالجة شركة المياه الوطنية', taglineEn: 'Business park · National Water Company treatment plant' },
      thuwal: { nameAr: 'ثول', nameEn: 'Thuwal', taglineAr: 'كاوست · WTIIRA · محطة معالجة الصرف الصحي', taglineEn: 'KAUST · WTIIRA · wastewater treatment plant' },
      jeddah: { nameAr: 'جدة', nameEn: 'Jeddah', taglineAr: '✈ مطار الملك عبدالعزيز الدولي · قطار الحرمين السريع', taglineEn: '✈ King Abdulaziz International Airport · Haramain High Speed Railway' },
    },
    hubs: [
      {
        id: 'hub-thuwal-stp',
        nameAr: 'محطة معالجة الصرف الصحي بثول',
        nameEn: 'Thuwal Wastewater Treatment Plant',
        descriptionAr: 'معالجة مياه الصرف الصحي التي تغذي مشاريع إعادة الاستخدام التجريبية',
        descriptionEn: 'Wastewater treatment feeding pilot water-reuse projects',
      },
      {
        id: 'hub-kaust',
        nameAr: 'حرم جامعة الملك عبدالله للعلوم والتقنية',
        nameEn: 'King Abdullah University of Science and Technology (KAUST) Campus',
        descriptionAr: 'مرتكز بحثي ومختبر حي للتجارب',
        descriptionEn: 'A research hub and living lab for experimentation',
      },
      {
        id: 'hub-kaec-park',
        nameAr: 'مجمع أعمال مدينة الملك عبدالله الاقتصادية',
        nameEn: 'King Abdullah Economic City Business Park',
        descriptionAr: 'قاعدة التسويق التجاري والصناعة',
        descriptionEn: 'Commercial and industrial marketing base',
      },
      {
        id: 'hub-acwa',
        nameAr: 'منشآت أكوا باور',
        nameEn: 'ACWA Power Facilities',
        descriptionAr: 'طاقة وقدرة تحلية',
        descriptionEn: 'Power and desalination capacity',
      },
      {
        id: 'hub-veolia',
        nameAr: 'فيوليا (رابغ 3)',
        nameEn: 'Veolia (Rabigh 3)',
        descriptionAr: 'عمليات تحلية المياه',
        descriptionEn: 'Water desalination operations',
      },
      {
        id: 'hub-nwc-stp',
        nameAr: 'محطة معالجة الصرف الصحي التابعة لشركة المياه الوطنية',
        nameEn: 'National Water Company Wastewater Treatment Plant',
        descriptionAr: 'معالجة تابعة لشركة المياه الوطنية',
        descriptionEn: 'Treatment operated by the National Water Company',
      },
      {
        id: 'hub-wtiira',
        nameAr: 'مركز أبحاث وتقنيات المياه (WTIIRA)',
        nameEn: 'Water Technologies & Innovation Research Institute (WTIIRA)',
        descriptionAr: 'ابتكار وأبحاث تقنيات المياه',
        descriptionEn: 'Water technology innovation and research',
      },
      {
        id: 'hub-swa-oasis',
        nameAr: 'واحة المياه برابغ',
        nameEn: 'Rabigh Water Oasis',
        descriptionAr: 'منشأة تابعة لهيئة المياه السعودية',
        descriptionEn: 'A facility operated by the Saudi Water Authority',
      },
    ],
  },
});
