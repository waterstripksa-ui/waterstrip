/**
 * The about page "الرسالة والرؤية" section: a two-paragraph narrative next to
 * a single illustration.
 *
 * The illustration is a `media` id; with none set, it shows the placeholder
 * artwork in src/lib/about-assets.ts.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, mediaId } from './fields.ts';

const v1 = z.object({
  eyebrowAr: arText(1, 40),
  headingAr: arText(1, 200),
  bodyAr1: arText(1, 900),
  bodyAr2: arText(1, 900),
  imageId: mediaId.nullable(),
});

/** v2 added the English siblings of the copy fields. */
const v2 = v1.extend({
  eyebrowEn: enText(40),
  headingEn: enText(200),
  bodyEn1: enText(900),
  bodyEn2: enText(900),
});

export type AboutMission = z.infer<typeof v2>;

export const aboutMission = defineSingleton<AboutMission>({
  key: 'about_mission',
  version: 2,
  schema: v2,
  migrations: [addEnFields],
  initial: {
    eyebrowAr: 'الرسالة والرؤية',
    eyebrowEn: '',
    headingAr: 'مبادرة وطنية لتسريع تبنّي تقنيات المياه',
    headingEn: '',
    bodyAr1:
      'انطلاقًا من رؤية المملكة العربية السعودية 2030، وفي إطار التزام وزارة البيئة والمياه والزراعة بتحقيق نقلات نوعية في تقنيات المياه والاستدامة، أُطلق شريط شراكات الابتكار المائي كمبادرة استراتيجية تهدف إلى إعادة تشكيل مستقبل قطاع المياه في المملكة — عبر إنشاء مركز عالمي للابتكار يجمع تحت مظلته مؤسسات البحث العلمي وقطاعات الأعمال والجهات الحكومية للعمل سويًا على تطوير تقنيات متقدمة في تحلية المياه وإعادة استخدامها والتقنيات القادرة على التكيّف مع التغيّرات المناخية.',
    bodyEn1: '',
    bodyAr2:
      'يمتدّ الشريط على طول ساحل البحر الأحمر، ويسعى إلى بناء منظومة ديناميكية تجذب الاستثمارات وتسهّل البحث العلمي وتسرّع التسويق التجاري في مختلف أنحاء المملكة، مع انفتاحه على الجهات من داخل المملكة وخارجها. والمبادرة تحت رعاية وزارة البيئة والمياه والزراعة.',
    bodyEn2: '',
    imageId: null,
  },
});
