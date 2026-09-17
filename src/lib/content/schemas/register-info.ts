/**
 * The register-interest page's "ماذا بعد؟" aside card. The four steps are a
 * fixed set — the copy itself names an exact count ("أربع خطوات") — so they
 * are a `.length(4)` tuple with a fixed-row editor, not an open list.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText, itemId } from './fields.ts';

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

/** v2 added the English siblings of the copy fields. */
const stepV2 = step.extend({
  titleEn: enText(40),
  bodyEn: enText(200),
});

const v2 = v1.extend({
  headingEn: enText(80),
  ledeEn: enText(300),
  steps: z.array(stepV2).length(4),
  questionLabelEn: enText(80),
});

export type RegisterInfo = z.infer<typeof v2>;

export const registerInfo = defineSingleton<RegisterInfo>({
  key: 'register_info',
  version: 2,
  schema: v2,
  migrations: [addEnFields],
  initial: {
    headingAr: 'ماذا بعد؟',
    headingEn: '',
    ledeAr: 'أربع خطوات من إرسال الطلب حتى إدراج جهتك في دليل الأعضاء.',
    ledeEn: '',
    steps: [
      {
        id: 'ri-review',
        titleAr: 'المراجعة',
        titleEn: '',
        bodyAr: 'يراجع فريق الشريط طلبك ويتحقّق من اكتمال بياناته.',
        bodyEn: '',
      },
      {
        id: 'ri-contact',
        titleAr: 'التواصل',
        titleEn: '',
        bodyAr: 'نتواصل معك عبر البريد الإلكتروني الذي زوّدتنا به.',
        bodyEn: '',
      },
      {
        id: 'ri-letter',
        titleAr: 'خطاب العضوية',
        titleEn: '',
        bodyAr: 'تتلقّى الجهات المؤهّلة خطاب الاهتمام بالعضوية للتوقيع.',
        bodyEn: '',
      },
      {
        id: 'ri-listing',
        titleAr: 'الإدراج',
        titleEn: '',
        bodyAr: 'بعد التوقيع تُدرَج جهتك في دليل الأعضاء على الموقع.',
        bodyEn: '',
      },
    ],
    questionLabelAr: 'عندك سؤال؟',
    questionLabelEn: '',
    supportEmail: 'support@waterstrip.org',
  },
});
