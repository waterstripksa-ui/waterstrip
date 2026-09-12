/**
 * The about page "الرسالة والرؤية" section: a two-paragraph narrative next to
 * a single illustration.
 *
 * The illustration is a `media` id; with none set, it shows the placeholder
 * artwork in src/lib/about-assets.ts.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, mediaId } from './fields.ts';

const v1 = z.object({
  eyebrowAr: arText(1, 40),
  headingAr: arText(1, 200),
  bodyAr1: arText(1, 900),
  bodyAr2: arText(1, 900),
  imageId: mediaId.nullable(),
});

export type AboutMission = z.infer<typeof v1>;

export const aboutMission = defineSingleton<AboutMission>({
  key: 'about_mission',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    eyebrowAr: 'الرسالة والرؤية',
    headingAr: 'مبادرة وطنية لتسريع تبنّي تقنيات المياه',
    bodyAr1:
      'انطلاقًا من رؤية المملكة العربية السعودية 2030، وفي إطار التزام وزارة البيئة والمياه والزراعة بتحقيق نقلات نوعية في تقنيات المياه والاستدامة، أُطلق شريط شراكات الابتكار المائي كمبادرة استراتيجية تهدف إلى إعادة تشكيل مستقبل قطاع المياه في المملكة — عبر إنشاء مركز عالمي للابتكار يجمع تحت مظلته مؤسسات البحث العلمي وقطاعات الأعمال والجهات الحكومية للعمل سويًا على تطوير تقنيات متقدمة في تحلية المياه وإعادة استخدامها والتقنيات القادرة على التكيّف مع التغيّرات المناخية.',
    bodyAr2:
      'يمتدّ الشريط على طول ساحل البحر الأحمر، ويسعى إلى بناء منظومة ديناميكية تجذب الاستثمارات وتسهّل البحث العلمي وتسرّع التسويق التجاري في مختلف أنحاء المملكة، مع انفتاحه على الجهات من داخل المملكة وخارجها. والمبادرة تحت رعاية وزارة البيئة والمياه والزراعة.',
    imageId: null,
  },
});
