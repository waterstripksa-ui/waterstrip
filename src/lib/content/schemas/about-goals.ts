/**
 * The about page "أربعة أهداف" panel: exactly four goals — the heading itself
 * says "four", so this is a fixed-length tuple rather than an open list. The
 * 01–04 ordinals the panel prints are derived from position at render time,
 * never stored.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, itemId } from './fields.ts';

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

export type AboutGoal = z.infer<typeof goal>;
export type AboutGoals = z.infer<typeof v1>;

export const aboutGoals = defineSingleton<AboutGoals>({
  key: 'about_goals',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    eyebrowAr: 'الأهداف',
    headingAr: 'أربعة أهداف توجّه عمل الشريط',
    ledeAr:
      'يقوم شريط شراكات الابتكار المائي على أربعة أهداف رئيسية تحدّد تدخلاته في منظومة قطاع المياه، وتجمع بين تيسير التعاون وتطوير الحلول وتمكين التمويل والتجريب وتبادل المعرفة.',
    items: [
      {
        id: 'ag-collaboration',
        titleAr: 'تيسير التعاون',
        bodyAr: 'تيسير التعاون بين الأعضاء من المؤسسات البحثية والقطاع الخاص والجهات الحكومية لدفع التقدّم في تقنيات المياه.',
      },
      {
        id: 'ag-solutions',
        titleAr: 'حلول مستدامة للموارد',
        bodyAr: 'تطوير وتنفيذ حلول مستدامة لإدارة الموارد المائية مع دعم صنع السياسات والأنظمة ذات العلاقة.',
      },
      {
        id: 'ag-funding',
        titleAr: 'التمويل والتجريب',
        bodyAr: 'تيسير الوصول إلى التمويل ومرافق الاختبار والبرامج التجريبية لتسريع تحويل الحلول المبتكرة إلى واقع تجاري.',
      },
      {
        id: 'ag-knowledge',
        titleAr: 'بيئة تعاونية للمعرفة',
        bodyAr: 'توفير بيئة تعاونية تجمع الجامعات ومراكز الأبحاث ورواد الصناعة لتسريع تبادل المعرفة وتطوير تقنيات مائية مبتكرة.',
      },
    ],
  },
});
