/**
 * The home page "التحديات" slider: an intro plus the slide labels.
 *
 * A slide's illustration is not content — it resolves from the item `id` through
 * the build-time map in src/lib/home-assets.ts. The slider itself is presentation:
 * admins change what the slides say, never how many columns or how they animate.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, itemId } from './fields.ts';

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

export type HomeChallenge = z.infer<typeof challenge>;
export type HomeChallenges = z.infer<typeof v1>;

export const homeChallenges = defineSingleton<HomeChallenges>({
  key: 'home_challenges',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    eyebrowAr: 'التحديات',
    headingAr:
      'يواجه قطاع المياه في المملكة تحديات مترابطة تؤثّر في كفاءة الموارد وتكلفة الخدمة واستدامة الإمداد.',
    items: [
      { id: 'ch-scarcity', labelAr: 'ندرة الموارد المائية' },
      { id: 'ch-desal', labelAr: 'ارتفاع تكاليف التحلية' },
      { id: 'ch-wastewater', labelAr: 'ضعف كفاءة معالجة مياه الصرف الصحي' },
      { id: 'ch-infra', labelAr: 'تقادم البنية التحتية' },
      { id: 'ch-consumption', labelAr: 'ارتفاع استهلاك الفرد من المياه' },
      { id: 'ch-groundwater', labelAr: 'الاعتماد على المياه الجوفية غير المتجددة' },
      { id: 'ch-fragmentation', labelAr: 'تشتّت الجهات والخبرات' },
    ],
  },
});
