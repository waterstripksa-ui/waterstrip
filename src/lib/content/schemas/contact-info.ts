/**
 * The contact page's "التواصل المباشر" aside card. Each channel is a fixed,
 * named field — not a list — because the four channels differ in shape (a
 * mailbox, two cross-page links, a plain fact) and their destinations are
 * page structure, not admin-editable content.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText } from './fields.ts';

const v1 = z.object({
  headingAr: arText(1, 80),
  ledeAr: arText(1, 300),
  supportLabelAr: arText(1, 80),
  supportEmail: z.email('بريد إلكتروني غير صالح.').trim().max(200),
  membershipLabelAr: arText(1, 80),
  mediaLabelAr: arText(1, 80),
  responseLabelAr: arText(1, 80),
  responseTextAr: arText(1, 120),
});

export type ContactInfo = z.infer<typeof v1>;

export const contactInfo = defineSingleton<ContactInfo>({
  key: 'contact_info',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    headingAr: 'التواصل المباشر',
    ledeAr: 'اختر القناة الأنسب لطلبك — أو استخدم النموذج وسنوجّهه للجهة الصحيحة.',
    supportLabelAr: 'الاستفسارات العامة والدعم',
    supportEmail: 'support@waterstrip.org',
    membershipLabelAr: 'سجّل اهتمامك بالانضمام',
    mediaLabelAr: 'المركز الإعلامي',
    responseLabelAr: 'مدة الرد',
    responseTextAr: 'ثلاثة أيام عمل في المتوسط.',
  },
});
