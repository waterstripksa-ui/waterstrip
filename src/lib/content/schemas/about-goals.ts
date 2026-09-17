/**
 * The about page "أربعة أهداف" panel: exactly four goals — the heading itself
 * says "four", so this is a fixed-length tuple rather than an open list. The
 * 01–04 ordinals the panel prints are derived from position at render time,
 * never stored.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, itemId } from './fields.ts';

const goal = z.object({
  id: itemId,
  titleAr: arText(1, 60),
  bodyAr: arText(1, 300),
});

const v1 = z.object({
  eyebrowAr: arText(1, 40),
  headingAr: arText(1, 120),
  ledeAr: arText(1, 400),
  items: z.array(goal).length(4),
});

/** v2 added the English siblings of the copy fields. */
const goalV2 = goal.extend({
  titleEn: enText(60),
  bodyEn: enText(300),
});

const v2 = v1.extend({
  eyebrowEn: enText(40),
  headingEn: enText(120),
  ledeEn: enText(400),
  items: z.array(goalV2).length(4),
});

export type AboutGoal = z.infer<typeof goalV2>;
export type AboutGoals = z.infer<typeof v2>;

export const aboutGoals = defineSingleton<AboutGoals>({
  key: 'about_goals',
  version: 2,
  schema: v2,
  migrations: [addEnFields],
  initial: {
    eyebrowAr: 'الأهداف',
    eyebrowEn: '',
    headingAr: 'أربعة أهداف توجّه عمل الشريط',
    headingEn: '',
    ledeAr:
      'يقوم شريط شراكات الابتكار المائي على أربعة أهداف رئيسية تحدّد تدخلاته في منظومة قطاع المياه، وتجمع بين تيسير التعاون وتطوير الحلول وتمكين التمويل والتجريب وتبادل المعرفة.',
    ledeEn: '',
    items: [
      {
        id: 'ag-collaboration',
        titleAr: 'تيسير التعاون',
        titleEn: '',
        bodyAr: 'تيسير التعاون بين الأعضاء من المؤسسات البحثية والقطاع الخاص والجهات الحكومية لدفع التقدّم في تقنيات المياه.',
        bodyEn: '',
      },
      {
        id: 'ag-solutions',
        titleAr: 'حلول مستدامة للموارد',
        titleEn: '',
        bodyAr: 'تطوير وتنفيذ حلول مستدامة لإدارة الموارد المائية مع دعم صنع السياسات والأنظمة ذات العلاقة.',
        bodyEn: '',
      },
      {
        id: 'ag-funding',
        titleAr: 'التمويل والتجريب',
        titleEn: '',
        bodyAr: 'تيسير الوصول إلى التمويل ومرافق الاختبار والبرامج التجريبية لتسريع تحويل الحلول المبتكرة إلى واقع تجاري.',
        bodyEn: '',
      },
      {
        id: 'ag-knowledge',
        titleAr: 'بيئة تعاونية للمعرفة',
        titleEn: '',
        bodyAr: 'توفير بيئة تعاونية تجمع الجامعات ومراكز الأبحاث ورواد الصناعة لتسريع تبادل المعرفة وتطوير تقنيات مائية مبتكرة.',
        bodyEn: '',
      },
    ],
  },
});
