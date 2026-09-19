/**
 * The home page "التحديات" section: an intro beside the water value-chain
 * diagram (challenges and opportunities, classified from supply to demand).
 *
 * The diagram's structure is fixed — five stages in a fixed order, each with its
 * own icon, under one band — so a stage is a named field and only its wording and
 * the bullet cards beneath it are editable. Admins change what the cards say and
 * how many there are; never the stages, their icons or their order.
 *
 * (Up to v3 this was a slider of illustrated slides, `items`; the mockup replaced
 * the slider with the diagram and v4 drops them.)
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, itemId, mediaId, siteHref } from './fields.ts';

const challenge = z.object({
  id: itemId,
  /** Also used as the illustration's alt text. */
  labelAr: arText(1, 120),
});

const v1 = z.object({
  eyebrowAr: arText(1, 40),
  headingAr: arText(1, 400),
  items: z.array(challenge).min(1).max(12),
});

const challengeV2 = challenge.extend({
  imageId: mediaId.nullable(),
});

const v2 = v1.extend({
  items: z.array(challengeV2).min(1).max(12),
});

/** v3 added the English siblings of the copy fields. */
const challengeV3 = challengeV2.extend({
  labelEn: enText(120),
});

const v3 = v2.extend({
  eyebrowEn: enText(40),
  headingEn: enText(400),
  items: z.array(challengeV3).min(1).max(12),
});

const card = z.object({
  id: itemId,
  textAr: arText(1, 140),
  textEn: enText(140),
});

const stage = z.object({
  nameAr: arText(1, 60),
  nameEn: enText(60),
  items: z.array(card).min(1).max(6),
});

const v4 = z.object({
  titleAr: arText(1, 40),
  titleEn: enText(40),
  ledeAr: arText(1, 400),
  ledeEn: enText(400),
  textAr: arText(1, 400),
  textEn: enText(400),
  ctaLabelAr: arText(1, 40),
  ctaLabelEn: enText(40),
  ctaHref: siteHref,
  chain: z.object({
    bandAr: arText(1, 120),
    bandEn: enText(120),
    sourceAr: arText(1, 240),
    sourceEn: enText(240),
    stages: z.object({
      supply: stage,
      storage: stage,
      distribution: stage,
      reuse: stage,
      demand: stage,
    }),
  }),
});

export const STAGE_IDS = ['supply', 'storage', 'distribution', 'reuse', 'demand'] as const;
export type StageId = (typeof STAGE_IDS)[number];

export type HomeChallengeCard = z.infer<typeof card>;
export type HomeChallengeStage = z.infer<typeof stage>;
export type HomeChallenges = z.infer<typeof v4>;

/** v2 made each slide's illustration uploadable. Existing slides start with none. */
function v1_to_v2(data: unknown): unknown {
  const prev = data as z.infer<typeof v1>;
  return { ...prev, items: prev.items.map((item) => ({ ...item, imageId: null })) };
}

/** The section's old eyebrow becomes its title, and its old heading the lede; the slides are dropped. */
function v3_to_v4(data: unknown): unknown {
  const prev = data as z.infer<typeof v3>;
  return {
    titleAr: prev.eyebrowAr,
    titleEn: prev.eyebrowEn,
    ledeAr: prev.headingAr,
    ledeEn: prev.headingEn,
    textAr: INITIAL.textAr,
    textEn: INITIAL.textEn,
    ctaLabelAr: INITIAL.ctaLabelAr,
    ctaLabelEn: INITIAL.ctaLabelEn,
    ctaHref: INITIAL.ctaHref,
    chain: INITIAL.chain,
  };
}

const INITIAL: HomeChallenges = {
  titleAr: 'التحديات',
  titleEn: 'Challenges',
  ledeAr:
    'يواجه قطاع المياه في المملكة تحديات مترابطة تؤثّر في كفاءة الموارد وتكلفة الخدمة واستدامة الإمداد.',
  ledeEn:
    "The Kingdom's water sector faces interlinked challenges affecting resource efficiency, service cost and supply sustainability.",
  textAr: 'نظرة عامة على التحديات والفرص في قطاع المياه، مصنّفة وفق سلسلة القيمة من الإمداد حتى الطلب.',
  textEn:
    'An overview of the challenges and opportunities in the water sector, classified along the value chain from supply to demand.',
  ctaLabelAr: 'المزيد',
  ctaLabelEn: 'Learn more',
  ctaHref: '/about',
  chain: {
    bandAr: 'تحسين الاقتصاد المتكامل للمياه / صافي المياه الإيجابية',
    bandEn: 'Optimizing the integrated water economy / net-positive water',
    sourceAr: 'المصدر: خارطة طريق تبنّي التقنيات — الابتكار المائي في المملكة العربية السعودية، شكل ٢.',
    sourceEn: 'Source: Technology Adoption Roadmap — Water Innovation in the Kingdom of Saudi Arabia, Figure 2.',
    stages: {
      supply: {
        nameAr: 'الإمداد',
        nameEn: 'Supply',
        items: [
          { id: 'supply-1', textAr: 'تقليل تكاليف الطاقة الإنتاجية والتكاليف الرئيسية', textEn: 'Reduce production energy costs and key costs' },
          { id: 'supply-2', textAr: 'تحقيق الأثر البيئي الأمثل لتحلية المياه', textEn: 'Achieve the optimal environmental impact of desalination' },
          { id: 'supply-3', textAr: 'تقليل سحب المياه غير المتجددة', textEn: 'Reduce non-renewable water withdrawals' },
          { id: 'supply-4', textAr: 'تحسين المحافظة على جودة المياه الجوفية', textEn: 'Improve the conservation of groundwater quality' },
        ],
      },
      storage: {
        nameAr: 'النقل والتخزين',
        nameEn: 'Transport & Storage',
        items: [
          { id: 'storage-1', textAr: 'تقليل تكاليف نقل المياه', textEn: 'Reduce water transport costs' },
          { id: 'storage-2', textAr: 'زيادة عدد أيام التخزين المتاحة', textEn: 'Increase the available days of storage' },
        ],
      },
      distribution: {
        nameAr: 'التوزيع',
        nameEn: 'Distribution',
        items: [
          { id: 'distribution-1', textAr: 'تحسين تغطية شبكة المياه', textEn: 'Improve water network coverage' },
          { id: 'distribution-2', textAr: 'تقليل خسائر توزيع المياه', textEn: 'Reduce water distribution losses' },
          { id: 'distribution-3', textAr: 'ضمان إمدادات مياه موثوقة وبدون انقطاع', textEn: 'Ensure reliable, uninterrupted water supply' },
        ],
      },
      reuse: {
        nameAr: 'معالجة مياه الصرف وإعادة استخدامها',
        nameEn: 'Wastewater Treatment & Reuse',
        items: [
          { id: 'reuse-1', textAr: 'تحسين شبكة الصرف الصحي', textEn: 'Improve the wastewater network' },
          { id: 'reuse-2', textAr: 'تحسين معالجة مياه الصرف الصحي', textEn: 'Improve wastewater treatment' },
          { id: 'reuse-3', textAr: 'زيادة استخدام مياه الصرف الصحي المعالجة', textEn: 'Increase the use of treated wastewater' },
        ],
      },
      demand: {
        nameAr: 'الطلب',
        nameEn: 'Demand',
        items: [
          { id: 'demand-1', textAr: 'تقليل مستويات استهلاك المياه في المناطق الحضرية (لتر للفرد في اليوم الواحد)', textEn: 'Reduce urban water consumption (liters per capita per day)' },
          { id: 'demand-2', textAr: 'تقليل مستويات استهلاك المياه الصناعية', textEn: 'Reduce industrial water consumption' },
          { id: 'demand-3', textAr: 'الحد من استخدام مصادر المياه غير المتجددة (استهلاك المياه الزراعية)', textEn: 'Limit the use of non-renewable water sources (agricultural water consumption)' },
        ],
      },
    },
  },
};

export const homeChallenges = defineSingleton<HomeChallenges>({
  key: 'home_challenges',
  version: 4,
  schema: v4,
  migrations: [v1_to_v2, addEnFields, v3_to_v4],
  initial: INITIAL,
});
