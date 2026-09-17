/**
 * The contact page's "التواصل المباشر" aside card. Each channel is a fixed,
 * named field — not a list — because the four channels differ in shape (a
 * mailbox, two cross-page links, a plain fact) and their destinations are
 * page structure, not admin-editable content.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { arText, enText } from './fields.ts';

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

/** v2 added the English siblings of the copy fields. */
const v2 = v1.extend({
  headingEn: enText(80),
  ledeEn: enText(300),
  supportLabelEn: enText(80),
  membershipLabelEn: enText(80),
  mediaLabelEn: enText(80),
  responseLabelEn: enText(80),
  responseTextEn: enText(120),
});

export type ContactInfo = z.infer<typeof v2>;

export const contactInfo = defineSingleton<ContactInfo>({
  key: 'contact_info',
  version: 2,
  schema: v2,
  migrations: [addEnFields],
  initial: {
    headingAr: 'التواصل المباشر',
    headingEn: 'Direct Contact',
    ledeAr: 'اختر القناة الأنسب لطلبك — أو استخدم النموذج وسنوجّهه للجهة الصحيحة.',
    ledeEn: "Choose the channel that best fits your request — or use the form and we'll route it to the right team.",
    supportLabelAr: 'الاستفسارات العامة والدعم',
    supportLabelEn: 'General Inquiries & Support',
    supportEmail: 'support@waterstrip.org',
    membershipLabelAr: 'سجّل اهتمامك بالانضمام',
    membershipLabelEn: 'Register Your Interest in Joining',
    mediaLabelAr: 'المركز الإعلامي',
    mediaLabelEn: 'Media Center',
    responseLabelAr: 'مدة الرد',
    responseLabelEn: 'Response Time',
    responseTextAr: 'ثلاثة أيام عمل في المتوسط.',
    responseTextEn: 'Three business days on average.',
  },
});
