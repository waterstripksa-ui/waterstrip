/**
 * The home page "التحديات" slider: an intro plus the slide labels.
 *
 * A slide's illustration is a `media` id; with none set, the slide shows the
 * placeholder artwork keyed by its `id` in src/lib/home-assets.ts. The slider itself is presentation:
 * admins change what the slides say, never how many columns or how they animate.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, itemId, mediaId } from './fields.ts';

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

export type HomeChallenge = z.infer<typeof challengeV3>;
export type HomeChallenges = z.infer<typeof v3>;

/** v2 made each slide's illustration uploadable. Existing slides start with none. */
function v1_to_v2(data: unknown): unknown {
  const prev = data as z.infer<typeof v1>;
  return { ...prev, items: prev.items.map((item) => ({ ...item, imageId: null })) };
}

export const homeChallenges = defineSingleton<HomeChallenges>({
  key: 'home_challenges',
  version: 3,
  schema: v3,
  migrations: [v1_to_v2, addEnFields],
  initial: {
    eyebrowAr: 'التحديات',
    eyebrowEn: 'Challenges',
    headingAr:
      'يواجه قطاع المياه في المملكة تحديات مترابطة تؤثّر في كفاءة الموارد وتكلفة الخدمة واستدامة الإمداد.',
    headingEn:
      "The Kingdom's water sector faces interlinked challenges affecting resource efficiency, service cost and supply sustainability.",
    items: [
      { id: 'ch-scarcity', labelAr: 'ندرة الموارد المائية', labelEn: 'Water resource scarcity', imageId: null },
      { id: 'ch-desal', labelAr: 'ارتفاع تكاليف التحلية', labelEn: 'High desalination costs', imageId: null },
      {
        id: 'ch-wastewater',
        labelAr: 'ضعف كفاءة معالجة مياه الصرف الصحي',
        labelEn: 'Inefficient wastewater treatment',
        imageId: null,
      },
      { id: 'ch-infra', labelAr: 'تقادم البنية التحتية', labelEn: 'Aging infrastructure', imageId: null },
      {
        id: 'ch-consumption',
        labelAr: 'ارتفاع استهلاك الفرد من المياه',
        labelEn: 'High per-capita water consumption',
        imageId: null,
      },
      {
        id: 'ch-groundwater',
        labelAr: 'الاعتماد على المياه الجوفية غير المتجددة',
        labelEn: 'Reliance on non-renewable groundwater',
        imageId: null,
      },
      { id: 'ch-fragmentation', labelAr: 'تشتّت الجهات والخبرات', labelEn: 'Fragmented entities and expertise', imageId: null },
    ],
  },
});
