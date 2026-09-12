/**
 * The about page "تحديات تجعل الابتكار ضرورة" section: an intro plus a card
 * per national challenge, each with an illustration, a title and a body.
 *
 * A card's illustration is a `media` id; with none set, the card shows the
 * placeholder artwork keyed by its `id` in src/lib/about-assets.ts.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, itemId, mediaId, siteHref } from './fields.ts';

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

export type AboutChallenge = z.infer<typeof challenge>;
export type AboutChallenges = z.infer<typeof v1>;

export const aboutChallenges = defineSingleton<AboutChallenges>({
  key: 'about_challenges',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    eyebrowAr: 'السياق الوطني',
    headingAr: 'تحديات تجعل الابتكار ضرورة',
    ledeAr:
      'يواجه قطاع المياه في المملكة تحديات كبيرة تخلق مجتمعةً دافعًا واضحًا لتبنّي التقنيات المتقدمة — بما يوازن بين تأمين الاحتياج المائي واستدامة الموارد.',
    ctaLabelAr: 'استعرض مجموعات العمل',
    ctaHref: '#',
    items: [
      {
        id: 'nc-scarcity',
        titleAr: 'ندرة الموارد المائية',
        bodyAr: 'محدودية الموارد المتجددة واعتماد أكثر من 80% من الإمداد على مصادر جوفية غير متجددة.',
        imageId: null,
      },
      {
        id: 'nc-desal',
        titleAr: 'ارتفاع تكاليف التحلية',
        bodyAr: 'كلفة إنتاج المياه المحلّاة تضغط على اقتصاديات القطاع وتستدعي حلولًا أكفأ.',
        imageId: null,
      },
      {
        id: 'nc-wastewater',
        titleAr: 'ضعف كفاءة معالجة الصرف',
        bodyAr: 'فجوات في كفاءة معالجة مياه الصرف الصحي تحدّ من فرص إعادة الاستخدام.',
        imageId: null,
      },
      {
        id: 'nc-infra',
        titleAr: 'تقادم البنية التحتية',
        bodyAr: 'أصول قائمة تحتاج تحديثًا لرفع الكفاءة وخفض الفاقد.',
        imageId: null,
      },
      {
        id: 'nc-fragmentation',
        titleAr: 'تشتّت الجهود والخبرات',
        bodyAr: 'غياب مجتمع متكامل يربط أصحاب المصلحة يحدّ من تطوير الحلول وتبادلها.',
        imageId: null,
      },
    ],
  },
});
