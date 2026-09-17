/** The cookie notice page — see legal-shared.ts for the content model. */
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { legalPageSchema, type LegalPage } from './legal-shared.ts';

export const legalCookies = defineSingleton<LegalPage>({
  key: 'legal_cookies',
  version: 2,
  schema: legalPageSchema,
  migrations: [addEnFields],
  initial: {
    titleAr: 'إشعار ملفات الارتباط',
    titleEn: '',
    updatedLabelAr: 'آخر تحديث: 3 أغسطس 2026',
    updatedLabelEn: '',
    sections: [
      {
        id: 'cookies-what',
        titleAr: 'ما هي ملفات الارتباط',
        titleEn: '',
        bodyAr: 'ملفات الارتباط ملفات نصية صغيرة تُحفظ على جهازك عند زيارة الموقع، وتتيح للموقع تذكّر خياراتك وقياس طريقة استخدامه.',
        bodyEn: '',
      },
      {
        id: 'cookies-categories',
        titleAr: 'الفئات التي نستخدمها',
        titleEn: '',
        bodyAr:
          '- **ضرورية تمامًا:** لازمة لعمل الموقع، وتشمل تفضيلات اللغة وإمكانية الوصول، ولا يمكن إيقافها.\n- **الأداء:** إحصاءات مجهولة عن الصفحات المُشاهَدة والوقت المستغرق، تُستخدم لتحسين المحتوى.\n- **الوظيفية:** تذكّر خيارات مثل عوامل التصفية المحددة في صفحتي الأعضاء ومجموعات العمل.',
        bodyEn: '',
      },
      {
        id: 'cookies-ads',
        titleAr: 'الإعلانات',
        titleEn: '',
        bodyAr: 'لا يستخدم هذا الموقع ملفات ارتباط إعلانية أو للتتبّع عبر المواقع.',
        bodyEn: '',
      },
      {
        id: 'cookies-manage',
        titleAr: 'إدارة ملفات الارتباط',
        titleEn: '',
        bodyAr: 'يمكنك حذف ملفات الارتباط أو حظرها من إعدادات المتصفح. وقد يؤدي حظر الملفات الضرورية إلى تعطّل أجزاء من الموقع.',
        bodyEn: '',
      },
      {
        id: 'cookies-contact',
        titleAr: 'تواصل معنا',
        titleEn: '',
        bodyAr: 'للاستفسار عن ملفات الارتباط: [support@waterstrip.org](mailto:support@waterstrip.org).',
        bodyEn: '',
      },
    ],
  },
});
