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
    titleEn: '',
    updatedLabelAr: 'آخر تحديث: 3 أغسطس 2026',
    updatedLabelEn: '',
    sections: [
      {
        id: 'privacy-scope',
        titleAr: '1. النطاق',
        titleEn: '',
        bodyAr: 'توضّح هذه السياسة البيانات الشخصية التي يجمعها الشريط عبر هذا الموقع، وسبب جمعها، والخيارات المتاحة لك.',
        bodyEn: '',
      },
      {
        id: 'privacy-data',
        titleAr: '2. البيانات التي نجمعها',
        titleEn: '',
        bodyAr:
          '- **بيانات تقدّمها أنت:** الاسم، والجهة، ونوعها، والبريد الإلكتروني للعمل، والجوال، والموقع الإلكتروني، ومجال الاهتمام، وأي رسالة ترسلها عبر نماذج التسجيل أو العضوية أو تقديم الأفكار أو التواصل.\n- **بيانات تقنية:** عنوان IP، ونوع المتصفح والجهاز، والصفحة المُحيلة، والصفحات المُشاهَدة.\n- **ملفات الارتباط:** راجع [إشعار ملفات الارتباط](/cookies).',
        bodyEn: '',
      },
      {
        id: 'privacy-why',
        titleAr: '3. لماذا نستخدمها',
        titleEn: '',
        bodyAr:
          '- لمراجعة طلبات التسجيل والعضوية والاستفسارات والرد عليها.\n- لتوجيه الأفكار المقدَّمة إلى مجموعة العمل المعنية.\n- لإرسال تحديثات تشغيلية عن الشريط عند طلبك ذلك.\n- لقياس أداء الموقع وتحسين المحتوى.',
        bodyEn: '',
      },
      {
        id: 'privacy-basis',
        titleAr: '4. الأساس النظامي',
        titleEn: '',
        bodyAr:
          'تُعالَج البيانات الشخصية بناءً على موافقتك، أو عند لزوم المعالجة للرد على طلب تقدّمت به، وفقًا لنظام حماية البيانات الشخصية السعودي (PDPL).',
        bodyEn: '',
      },
      {
        id: 'privacy-sharing',
        titleAr: '5. المشاركة',
        titleEn: '',
        bodyAr:
          'تُشارَك البيانات داخليًا في الشريط، وعند ارتباطها بطلبك مع الجهة العضو المعنية. ولا نبيع البيانات الشخصية. ويلتزم مزوّدو الخدمة الذين يعالجون البيانات نيابةً عنّا بالتزامات السرية.',
        bodyEn: '',
      },
      {
        id: 'privacy-retention',
        titleAr: '6. مدة الاحتفاظ',
        titleEn: '',
        bodyAr:
          'يُحتفظ بسجلات التسجيل والاستفسارات للمدة اللازمة لمعالجة الطلب والوفاء بالتزامات حفظ السجلات، ثم تُحذف أو تُجهَّل هويتها.',
        bodyEn: '',
      },
      {
        id: 'privacy-rights',
        titleAr: '7. حقوقك',
        titleEn: '',
        bodyAr:
          'يحق لك طلب الاطلاع على بياناتك الشخصية أو تصحيحها أو حذفها، ولك سحب موافقتك في أي وقت. وتُرسَل الطلبات إلى [support@waterstrip.org](mailto:support@waterstrip.org).',
        bodyEn: '',
      },
      {
        id: 'privacy-security',
        titleAr: '8. الأمن',
        titleEn: '',
        bodyAr: 'نطبّق تدابير تقنية وتنظيمية تتناسب مع حساسية البيانات. ولا يمكن ضمان أمان أي إرسال عبر الإنترنت بشكل كامل.',
        bodyEn: '',
      },
      {
        id: 'privacy-updates',
        titleAr: '9. التحديثات',
        titleEn: '',
        bodyAr: 'قد تُحدَّث هذه السياسة، والتاريخ أعلى الصفحة يشير إلى آخر مراجعة.',
        bodyEn: '',
      },
    ],
  },
});
