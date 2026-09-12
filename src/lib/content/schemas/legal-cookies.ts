/** The cookie notice page — see legal-shared.ts for the content model. */
import { defineSingleton } from './types.ts';
import { legalPageSchema, type LegalPage } from './legal-shared.ts';

export const legalCookies = defineSingleton<LegalPage>({
  key: 'legal_cookies',
  version: 1,
  schema: legalPageSchema,
  migrations: [],
  initial: {
    titleAr: 'إشعار ملفات الارتباط',
    updatedLabelAr: 'آخر تحديث: 3 أغسطس 2026',
    sections: [
      {
        id: 'cookies-what',
        titleAr: 'ما هي ملفات الارتباط',
        bodyAr: 'ملفات الارتباط ملفات نصية صغيرة تُحفظ على جهازك عند زيارة الموقع، وتتيح للموقع تذكّر خياراتك وقياس طريقة استخدامه.',
      },
      {
        id: 'cookies-categories',
        titleAr: 'الفئات التي نستخدمها',
        bodyAr:
          '- **ضرورية تمامًا:** لازمة لعمل الموقع، وتشمل تفضيلات اللغة وإمكانية الوصول، ولا يمكن إيقافها.\n- **الأداء:** إحصاءات مجهولة عن الصفحات المُشاهَدة والوقت المستغرق، تُستخدم لتحسين المحتوى.\n- **الوظيفية:** تذكّر خيارات مثل عوامل التصفية المحددة في صفحتي الأعضاء ومجموعات العمل.',
      },
      {
        id: 'cookies-ads',
        titleAr: 'الإعلانات',
        bodyAr: 'لا يستخدم هذا الموقع ملفات ارتباط إعلانية أو للتتبّع عبر المواقع.',
      },
      {
        id: 'cookies-manage',
        titleAr: 'إدارة ملفات الارتباط',
        bodyAr: 'يمكنك حذف ملفات الارتباط أو حظرها من إعدادات المتصفح. وقد يؤدي حظر الملفات الضرورية إلى تعطّل أجزاء من الموقع.',
      },
      {
        id: 'cookies-contact',
        titleAr: 'تواصل معنا',
        bodyAr: 'للاستفسار عن ملفات الارتباط: [support@waterstrip.org](mailto:support@waterstrip.org).',
      },
    ],
  },
});
