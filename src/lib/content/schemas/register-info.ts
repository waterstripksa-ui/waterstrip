/**
 * The register-interest page's "ماذا بعد؟" aside card. The four steps are a
 * fixed set — the copy itself names an exact count ("أربع خطوات") — so they
 * are a `.length(4)` tuple with a fixed-row editor, not an open list.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, itemId } from './fields.ts';

const step = z.object({
  id: itemId,
  titleAr: arText(1, 40),
  bodyAr: arText(1, 200),
});

const v1 = z.object({
  headingAr: arText(1, 80),
  ledeAr: arText(1, 300),
  steps: z.array(step).length(4),
  questionLabelAr: arText(1, 80),
  supportEmail: z.email('بريد إلكتروني غير صالح.').trim().max(200),
});

export type RegisterInfo = z.infer<typeof v1>;

export const registerInfo = defineSingleton<RegisterInfo>({
  key: 'register_info',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    headingAr: 'ماذا بعد؟',
    ledeAr: 'أربع خطوات من إرسال الطلب حتى إدراج جهتك في دليل الأعضاء.',
    steps: [
      {
        id: 'ri-review',
        titleAr: 'المراجعة',
        bodyAr: 'يراجع فريق الشريط طلبك ويتحقّق من اكتمال بياناته.',
      },
      {
        id: 'ri-contact',
        titleAr: 'التواصل',
        bodyAr: 'نتواصل معك عبر البريد الإلكتروني الذي زوّدتنا به.',
      },
      {
        id: 'ri-letter',
        titleAr: 'خطاب العضوية',
        bodyAr: 'تتلقّى الجهات المؤهّلة خطاب الاهتمام بالعضوية للتوقيع.',
      },
      {
        id: 'ri-listing',
        titleAr: 'الإدراج',
        bodyAr: 'بعد التوقيع تُدرَج جهتك في دليل الأعضاء على الموقع.',
      },
    ],
    questionLabelAr: 'عندك سؤال؟',
    supportEmail: 'support@waterstrip.org',
  },
});
