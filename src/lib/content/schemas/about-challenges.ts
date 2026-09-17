/**
 * The about page "تحديات تجعل الابتكار ضرورة" section: an intro plus a card
 * per national challenge, each with an illustration, a title and a body.
 *
 * A card's illustration is a `media` id; with none set, the card shows the
 * placeholder artwork keyed by its `id` in src/lib/about-assets.ts.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, itemId, mediaId, siteHref } from './fields.ts';

const challenge = z.object({
  id: itemId,
  titleAr: arText(1, 80),
  bodyAr: arText(1, 300),
  imageId: mediaId.nullable(),
});

const v1 = z.object({
  eyebrowAr: arText(1, 40),
  headingAr: arText(1, 120),
  ledeAr: arText(1, 400),
  ctaLabelAr: arText(1, 40),
  ctaHref: siteHref,
  items: z.array(challenge).min(1).max(8),
});

/** v3 added the English siblings of the copy fields. */
const challengeV3 = challenge.extend({
  titleEn: enText(80),
  bodyEn: enText(300),
});

const v3 = v1.extend({
  eyebrowEn: enText(40),
  headingEn: enText(120),
  ledeEn: enText(400),
  ctaLabelEn: enText(40),
  items: z.array(challengeV3).min(1).max(8),
});

export type AboutChallenge = z.infer<typeof challengeV3>;
export type AboutChallenges = z.infer<typeof v3>;

/** `technologies` (the working groups listing) was ported after this CTA shipped as `'#'`. */
function v1_to_v2(data: unknown): unknown {
  return { ...(data as z.infer<typeof v1>), ctaHref: '/technologies' };
}

export const aboutChallenges = defineSingleton<AboutChallenges>({
  key: 'about_challenges',
  version: 3,
  schema: v3,
  migrations: [v1_to_v2, addEnFields],
  initial: {
    eyebrowAr: 'السياق الوطني',
    eyebrowEn: '',
    headingAr: 'تحديات تجعل الابتكار ضرورة',
    headingEn: '',
    ledeAr:
      'يواجه قطاع المياه في المملكة تحديات كبيرة تخلق مجتمعةً دافعًا واضحًا لتبنّي التقنيات المتقدمة — بما يوازن بين تأمين الاحتياج المائي واستدامة الموارد.',
    ledeEn: '',
    ctaLabelAr: 'استعرض مجموعات العمل',
    ctaLabelEn: '',
    ctaHref: '/technologies',
    items: [
      {
        id: 'nc-scarcity',
        titleAr: 'ندرة الموارد المائية',
        titleEn: '',
        bodyAr: 'محدودية الموارد المتجددة واعتماد أكثر من 80% من الإمداد على مصادر جوفية غير متجددة.',
        bodyEn: '',
        imageId: null,
      },
      {
        id: 'nc-desal',
        titleAr: 'ارتفاع تكاليف التحلية',
        titleEn: '',
        bodyAr: 'كلفة إنتاج المياه المحلّاة تضغط على اقتصاديات القطاع وتستدعي حلولًا أكفأ.',
        bodyEn: '',
        imageId: null,
      },
      {
        id: 'nc-wastewater',
        titleAr: 'ضعف كفاءة معالجة الصرف',
        titleEn: '',
        bodyAr: 'فجوات في كفاءة معالجة مياه الصرف الصحي تحدّ من فرص إعادة الاستخدام.',
        bodyEn: '',
        imageId: null,
      },
      {
        id: 'nc-infra',
        titleAr: 'تقادم البنية التحتية',
        titleEn: '',
        bodyAr: 'أصول قائمة تحتاج تحديثًا لرفع الكفاءة وخفض الفاقد.',
        bodyEn: '',
        imageId: null,
      },
      {
        id: 'nc-fragmentation',
        titleAr: 'تشتّت الجهود والخبرات',
        titleEn: '',
        bodyAr: 'غياب مجتمع متكامل يربط أصحاب المصلحة يحدّ من تطوير الحلول وتبادلها.',
        bodyEn: '',
        imageId: null,
      },
    ],
  },
});
