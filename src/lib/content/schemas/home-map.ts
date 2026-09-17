/**
 * The home page "أصول الشريط" corridor map.
 *
 * The map draws four fixed geographic clusters (Rabigh, KAEC, Thuwal, Jeddah) —
 * their position on the coastline is real-world geography, not content, so it is
 * a named field per cluster rather than a list an admin could reorder or extend.
 *
 * `hubs` is a repeatable list, but its dot on the map is placed by list
 * position (`src/pages/index.astro`'s `MAP_HUB_SLOTS`), the same way an award's
 * 01–04 ordinal is derived from position rather than stored. Reordering the list
 * moves a dot to a different fixed slot; it cannot invent a new one, since the
 * slot table only has eight entries.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, itemId } from './fields.ts';

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
  hubs: z.array(hub).min(1).max(8),
});

export type HomeMapCluster = z.infer<typeof cluster>;
export type HomeMapHub = z.infer<typeof hub>;
export type HomeMap = z.infer<typeof v1>;

export const homeMap = defineSingleton<HomeMap>({
  key: 'home_map',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    eyebrowAr: 'أصول الشريط',
    headingAr: 'ممر واحد، من رابغ إلى جدة.',
    ledeAr:
      'يمتد الشريط على طول ساحل البحر الأحمر، ليجمع أبرز أصول المياه في المنطقة — محطات المعالجة، والحرم الجامعي، ومرافق التحلية — ضمن ممر واحد متصل.',
    clusters: {
      rabigh: { nameAr: 'رابغ', taglineAr: 'أكوا باور · فيوليا · واحة هيئة المياه السعودية' },
      kaec: { nameAr: 'مدينة الملك عبدالله الاقتصادية', taglineAr: 'مجمع الأعمال · محطة معالجة شركة المياه الوطنية' },
      thuwal: { nameAr: 'ثول', taglineAr: 'كاوست · WTIIRA · محطة معالجة الصرف الصحي' },
      jeddah: { nameAr: 'جدة', taglineAr: '✈ مطار الملك عبدالعزيز الدولي · قطار الحرمين السريع' },
    },
    hubs: [
      {
        id: 'hub-thuwal-stp',
        nameAr: 'محطة معالجة الصرف الصحي بثول',
        descriptionAr: 'معالجة مياه الصرف الصحي التي تغذي مشاريع إعادة الاستخدام التجريبية',
      },
      {
        id: 'hub-kaust',
        nameAr: 'حرم جامعة الملك عبدالله للعلوم والتقنية',
        descriptionAr: 'مرتكز بحثي ومختبر حي للتجارب',
      },
      {
        id: 'hub-kaec-park',
        nameAr: 'مجمع أعمال مدينة الملك عبدالله الاقتصادية',
        descriptionAr: 'قاعدة التسويق التجاري والصناعة',
      },
      {
        id: 'hub-acwa',
        nameAr: 'منشآت أكوا باور',
        descriptionAr: 'طاقة وقدرة تحلية',
      },
      {
        id: 'hub-veolia',
        nameAr: 'فيوليا (رابغ 3)',
        descriptionAr: 'عمليات تحلية المياه',
      },
      {
        id: 'hub-nwc-stp',
        nameAr: 'محطة معالجة الصرف الصحي التابعة لشركة المياه الوطنية',
        descriptionAr: 'معالجة تابعة لشركة المياه الوطنية',
      },
      {
        id: 'hub-wtiira',
        nameAr: 'مركز أبحاث وتقنيات المياه (WTIIRA)',
        descriptionAr: 'ابتكار وأبحاث تقنيات المياه',
      },
      {
        id: 'hub-swa-oasis',
        nameAr: 'واحة المياه برابغ',
        descriptionAr: 'منشأة تابعة لهيئة المياه السعودية',
      },
    ],
  },
});
