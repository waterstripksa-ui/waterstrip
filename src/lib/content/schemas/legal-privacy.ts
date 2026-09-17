/** The privacy policy page — see legal-shared.ts for the content model. */
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { legalPageSchema, type LegalPage } from './legal-shared.ts';

export const legalPrivacy = defineSingleton<LegalPage>({
  key: 'legal_privacy',
  version: 2,
  schema: legalPageSchema,
  migrations: [addEnFields],
  initial: {
    titleAr: 'سياسة الخصوصية',
    titleEn: 'Privacy Policy',
    updatedLabelAr: 'آخر تحديث: 3 أغسطس 2026',
    updatedLabelEn: 'Last updated: August 3, 2026',
    sections: [
      {
        id: 'privacy-scope',
        titleAr: '1. النطاق',
        titleEn: '1. Scope',
        bodyAr: 'توضّح هذه السياسة البيانات الشخصية التي يجمعها الشريط عبر هذا الموقع، وسبب جمعها، والخيارات المتاحة لك.',
        bodyEn:
          'This policy explains the personal data that Water STRIP collects through this website, why it is collected, and the choices available to you.',
      },
      {
        id: 'privacy-data',
        titleAr: '2. البيانات التي نجمعها',
        titleEn: '2. Data We Collect',
        bodyAr:
          '- **بيانات تقدّمها أنت:** الاسم، والجهة، ونوعها، والبريد الإلكتروني للعمل، والجوال، والموقع الإلكتروني، ومجال الاهتمام، وأي رسالة ترسلها عبر نماذج التسجيل أو العضوية أو تقديم الأفكار أو التواصل.\n- **بيانات تقنية:** عنوان IP، ونوع المتصفح والجهاز، والصفحة المُحيلة، والصفحات المُشاهَدة.\n- **ملفات الارتباط:** راجع [إشعار ملفات الارتباط](/cookies).',
        bodyEn:
          '- **Data you provide:** your name, organization and its type, work email, mobile number, website, area of interest, and any message you send through the registration, membership, idea-submission, or contact forms.\n- **Technical data:** IP address, browser and device type, referring page, and pages viewed.\n- **Cookies:** see the [Cookie Notice](/cookies).',
      },
      {
        id: 'privacy-why',
        titleAr: '3. لماذا نستخدمها',
        titleEn: '3. Why We Use It',
        bodyAr:
          '- لمراجعة طلبات التسجيل والعضوية والاستفسارات والرد عليها.\n- لتوجيه الأفكار المقدَّمة إلى مجموعة العمل المعنية.\n- لإرسال تحديثات تشغيلية عن الشريط عند طلبك ذلك.\n- لقياس أداء الموقع وتحسين المحتوى.',
        bodyEn:
          '- To review and respond to registration, membership, and inquiry requests.\n- To route submitted ideas to the relevant working group.\n- To send you operational updates about the Strip when you request them.\n- To measure site performance and improve content.',
      },
      {
        id: 'privacy-basis',
        titleAr: '4. الأساس النظامي',
        titleEn: '4. Legal Basis',
        bodyAr:
          'تُعالَج البيانات الشخصية بناءً على موافقتك، أو عند لزوم المعالجة للرد على طلب تقدّمت به، وفقًا لنظام حماية البيانات الشخصية السعودي (PDPL).',
        bodyEn:
          'Personal data is processed on the basis of your consent, or where processing is necessary to respond to a request you have made, in accordance with the Saudi Personal Data Protection Law (PDPL).',
      },
      {
        id: 'privacy-sharing',
        titleAr: '5. المشاركة',
        titleEn: '5. Sharing',
        bodyAr:
          'تُشارَك البيانات داخليًا في الشريط، وعند ارتباطها بطلبك مع الجهة العضو المعنية. ولا نبيع البيانات الشخصية. ويلتزم مزوّدو الخدمة الذين يعالجون البيانات نيابةً عنّا بالتزامات السرية.',
        bodyEn:
          'Data is shared internally within Water STRIP, and, where relevant to your request, with the concerned member organization. We do not sell personal data. Service providers who process data on our behalf are bound by confidentiality obligations.',
      },
      {
        id: 'privacy-retention',
        titleAr: '6. مدة الاحتفاظ',
        titleEn: '6. Retention Period',
        bodyAr:
          'يُحتفظ بسجلات التسجيل والاستفسارات للمدة اللازمة لمعالجة الطلب والوفاء بالتزامات حفظ السجلات، ثم تُحذف أو تُجهَّل هويتها.',
        bodyEn:
          'Registration and inquiry records are retained for as long as needed to process the request and to meet record-keeping obligations, after which they are deleted or anonymized.',
      },
      {
        id: 'privacy-rights',
        titleAr: '7. حقوقك',
        titleEn: '7. Your Rights',
        bodyAr:
          'يحق لك طلب الاطلاع على بياناتك الشخصية أو تصحيحها أو حذفها، ولك سحب موافقتك في أي وقت. وتُرسَل الطلبات إلى [support@waterstrip.org](mailto:support@waterstrip.org).',
        bodyEn:
          'You have the right to request access to, correction of, or deletion of your personal data, and you may withdraw your consent at any time. Requests should be sent to [support@waterstrip.org](mailto:support@waterstrip.org).',
      },
      {
        id: 'privacy-security',
        titleAr: '8. الأمن',
        titleEn: '8. Security',
        bodyAr: 'نطبّق تدابير تقنية وتنظيمية تتناسب مع حساسية البيانات. ولا يمكن ضمان أمان أي إرسال عبر الإنترنت بشكل كامل.',
        bodyEn:
          'We apply technical and organizational measures appropriate to the sensitivity of the data. No transmission over the internet can be guaranteed to be completely secure.',
      },
      {
        id: 'privacy-updates',
        titleAr: '9. التحديثات',
        titleEn: '9. Updates',
        bodyAr: 'قد تُحدَّث هذه السياسة، والتاريخ أعلى الصفحة يشير إلى آخر مراجعة.',
        bodyEn: 'This policy may be updated from time to time; the date at the top of the page reflects the most recent review.',
      },
    ],
  },
});
