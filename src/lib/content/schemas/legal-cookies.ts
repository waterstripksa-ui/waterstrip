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
    titleEn: 'Cookie Notice',
    updatedLabelAr: 'آخر تحديث: 3 أغسطس 2026',
    updatedLabelEn: 'Last updated: August 3, 2026',
    sections: [
      {
        id: 'cookies-what',
        titleAr: 'ما هي ملفات الارتباط',
        titleEn: 'What Cookies Are',
        bodyAr: 'ملفات الارتباط ملفات نصية صغيرة تُحفظ على جهازك عند زيارة الموقع، وتتيح للموقع تذكّر خياراتك وقياس طريقة استخدامه.',
        bodyEn:
          'Cookies are small text files stored on your device when you visit the website. They let the site remember your preferences and measure how it is used.',
      },
      {
        id: 'cookies-categories',
        titleAr: 'الفئات التي نستخدمها',
        titleEn: 'Categories We Use',
        bodyAr:
          '- **ضرورية تمامًا:** لازمة لعمل الموقع، وتشمل تفضيلات اللغة وإمكانية الوصول، ولا يمكن إيقافها.\n- **الأداء:** إحصاءات مجهولة عن الصفحات المُشاهَدة والوقت المستغرق، تُستخدم لتحسين المحتوى.\n- **الوظيفية:** تذكّر خيارات مثل عوامل التصفية المحددة في صفحتي الأعضاء ومجموعات العمل.',
        bodyEn:
          '- **Strictly necessary:** required for the website to function, including language and accessibility preferences; these cannot be disabled.\n- **Performance:** anonymous statistics on pages viewed and time spent, used to improve content.\n- **Functional:** remember choices such as filters selected on the members and working-groups pages.',
      },
      {
        id: 'cookies-ads',
        titleAr: 'الإعلانات',
        titleEn: 'Advertising',
        bodyAr: 'لا يستخدم هذا الموقع ملفات ارتباط إعلانية أو للتتبّع عبر المواقع.',
        bodyEn: 'This website does not use advertising or cross-site tracking cookies.',
      },
      {
        id: 'cookies-manage',
        titleAr: 'إدارة ملفات الارتباط',
        titleEn: 'Managing Cookies',
        bodyAr: 'يمكنك حذف ملفات الارتباط أو حظرها من إعدادات المتصفح. وقد يؤدي حظر الملفات الضرورية إلى تعطّل أجزاء من الموقع.',
        bodyEn:
          'You can delete or block cookies from your browser settings. Blocking necessary cookies may cause parts of the website to stop working.',
      },
      {
        id: 'cookies-contact',
        titleAr: 'تواصل معنا',
        titleEn: 'Contact Us',
        bodyAr: 'للاستفسار عن ملفات الارتباط: [support@waterstrip.org](mailto:support@waterstrip.org).',
        bodyEn: 'For inquiries about cookies: [support@waterstrip.org](mailto:support@waterstrip.org).',
      },
    ],
  },
});
