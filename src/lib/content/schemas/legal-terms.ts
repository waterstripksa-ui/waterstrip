/** The terms & conditions page — see legal-shared.ts for the content model. */
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { legalPageSchema, type LegalPage } from './legal-shared.ts';

export const legalTerms = defineSingleton<LegalPage>({
  key: 'legal_terms',
  version: 2,
  schema: legalPageSchema,
  migrations: [addEnFields],
  initial: {
    titleAr: 'الشروط والأحكام',
    titleEn: '',
    updatedLabelAr: 'آخر تحديث: 3 أغسطس 2026',
    updatedLabelEn: '',
    sections: [
      {
        id: 'terms-acceptance',
        titleAr: '1. قبول الشروط',
        titleEn: '',
        bodyAr:
          'بدخولك هذا الموقع فإنك توافق على الالتزام بهذه الشروط والأحكام. وإذا لم توافق عليها، يُرجى التوقف عن استخدام الموقع.\n\nيجوز لشريط شراكات الابتكار المائي (Water STRIP) تحديث هذه الشروط في أي وقت، ويُعدّ استمرار استخدام الموقع بعد التحديث قبولًا للشروط المعدّلة.',
        bodyEn: '',
      },
      {
        id: 'terms-use',
        titleAr: '2. استخدام الموقع',
        titleEn: '',
        bodyAr:
          '- يمكنك تصفّح المحتوى وتنزيله وطباعته للاستخدام الشخصي غير التجاري.\n- لا يجوز نسخ المحتوى أو إعادة توزيعه أو نشره لأغراض تجارية دون إذن كتابي.\n- لا يجوز محاولة الوصول غير المصرّح به إلى أي جزء من الموقع أو خوادمه أو الأنظمة المرتبطة به.\n- لا يجوز استخدام أدوات آلية لسحب أو جمع المحتوى أو بيانات الأعضاء.',
        bodyEn: '',
      },
      {
        id: 'terms-membership',
        titleAr: '3. العضوية والتسجيل',
        titleEn: '',
        bodyAr:
          'تسجيل الاهتمام أو تقديم طلب عضوية لا يُنشئ اتفاقًا ملزمًا. تُراجع جميع الطلبات من قبل فريق الشريط، ومنح العضوية يعود لتقدير الشريط.\n\nتُقرّ بأن جميع المعلومات المقدَّمة صحيحة وأنك مفوّض بتقديمها نيابةً عن الجهة المذكورة.',
        bodyEn: '',
      },
      {
        id: 'terms-submissions',
        titleAr: '4. الأفكار والمحتوى المُقدَّم',
        titleEn: '',
        bodyAr:
          'عند تقديم فكرة أو مقترح أو مستند داعم عبر الموقع، تُقرّ بأنك تملك حق مشاركته وأن ذلك لا يخلّ بأي التزام تجاه طرف ثالث.\n\nلا يدّعي الشريط ملكية الملكية الفكرية المقدَّمة. وقد تُراجع الطلبات داخليًا وتُشارك مع مجموعات العمل المعنية للتقييم.',
        bodyEn: '',
      },
      {
        id: 'terms-ip',
        titleAr: '5. الملكية الفكرية',
        titleEn: '',
        bodyAr: 'اسم الشريط وشعاره وهويته البصرية ومحتوى الموقع ملكية للتحالف وأعضائه، ومحمية بموجب الأنظمة المعمول بها.',
        bodyEn: '',
      },
      {
        id: 'terms-third-party',
        titleAr: '6. روابط الأطراف الثالثة',
        titleEn: '',
        bodyAr: 'قد يتضمن الموقع روابط لمواقع خارجية، والشريط غير مسؤول عن محتواها أو توفّرها أو ممارسات الخصوصية فيها.',
        bodyEn: '',
      },
      {
        id: 'terms-disclaimer',
        titleAr: '7. إخلاء المسؤولية',
        titleEn: '',
        bodyAr:
          'يُقدَّم المحتوى لأغراض المعلومات فقط ولا يُعدّ استشارة مهنية أو قانونية أو تقنية أو استثمارية. ولا يضمن الشريط أن يكون الموقع متاحًا دون انقطاع أو خاليًا من الأخطاء.',
        bodyEn: '',
      },
      {
        id: 'terms-law',
        titleAr: '8. النظام الواجب التطبيق',
        titleEn: '',
        bodyAr: 'تخضع هذه الشروط لأنظمة المملكة العربية السعودية، وتختص المحاكم السعودية المختصة حصريًا بنظر أي نزاع.',
        bodyEn: '',
      },
      {
        id: 'terms-contact',
        titleAr: '9. التواصل',
        titleEn: '',
        bodyAr: 'للاستفسار عن هذه الشروط: [support@waterstrip.org](mailto:support@waterstrip.org).',
        bodyEn: '',
      },
    ],
  },
});
