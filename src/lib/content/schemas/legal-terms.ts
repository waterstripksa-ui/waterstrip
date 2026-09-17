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
    titleEn: 'Terms & Conditions',
    updatedLabelAr: 'آخر تحديث: 3 أغسطس 2026',
    updatedLabelEn: 'Last updated: August 3, 2026',
    sections: [
      {
        id: 'terms-acceptance',
        titleAr: '1. قبول الشروط',
        titleEn: '1. Acceptance of Terms',
        bodyAr:
          'بدخولك هذا الموقع فإنك توافق على الالتزام بهذه الشروط والأحكام. وإذا لم توافق عليها، يُرجى التوقف عن استخدام الموقع.\n\nيجوز لشريط شراكات الابتكار المائي (Water STRIP) تحديث هذه الشروط في أي وقت، ويُعدّ استمرار استخدام الموقع بعد التحديث قبولًا للشروط المعدّلة.',
        bodyEn:
          'By accessing this website, you agree to be bound by these Terms & Conditions. If you do not agree to them, please discontinue use of the website.\n\nWater STRIP may update these terms at any time, and continued use of the website after an update constitutes acceptance of the revised terms.',
      },
      {
        id: 'terms-use',
        titleAr: '2. استخدام الموقع',
        titleEn: '2. Use of the Website',
        bodyAr:
          '- يمكنك تصفّح المحتوى وتنزيله وطباعته للاستخدام الشخصي غير التجاري.\n- لا يجوز نسخ المحتوى أو إعادة توزيعه أو نشره لأغراض تجارية دون إذن كتابي.\n- لا يجوز محاولة الوصول غير المصرّح به إلى أي جزء من الموقع أو خوادمه أو الأنظمة المرتبطة به.\n- لا يجوز استخدام أدوات آلية لسحب أو جمع المحتوى أو بيانات الأعضاء.',
        bodyEn:
          '- You may browse, download, and print content for personal, non-commercial use.\n- Content may not be copied, redistributed, or published for commercial purposes without written permission.\n- Unauthorized access to any part of the website, its servers, or connected systems is prohibited.\n- Automated tools may not be used to scrape or collect content or member data.',
      },
      {
        id: 'terms-membership',
        titleAr: '3. العضوية والتسجيل',
        titleEn: '3. Membership & Registration',
        bodyAr:
          'تسجيل الاهتمام أو تقديم طلب عضوية لا يُنشئ اتفاقًا ملزمًا. تُراجع جميع الطلبات من قبل فريق الشريط، ومنح العضوية يعود لتقدير الشريط.\n\nتُقرّ بأن جميع المعلومات المقدَّمة صحيحة وأنك مفوّض بتقديمها نيابةً عن الجهة المذكورة.',
        bodyEn:
          'Registering interest or submitting a membership application does not create a binding agreement. All applications are reviewed by the Water STRIP team, and granting membership is at the Strip\'s discretion.\n\nYou represent that all information provided is accurate and that you are authorized to submit it on behalf of the organization named.',
      },
      {
        id: 'terms-submissions',
        titleAr: '4. الأفكار والمحتوى المُقدَّم',
        titleEn: '4. Submitted Ideas and Content',
        bodyAr:
          'عند تقديم فكرة أو مقترح أو مستند داعم عبر الموقع، تُقرّ بأنك تملك حق مشاركته وأن ذلك لا يخلّ بأي التزام تجاه طرف ثالث.\n\nلا يدّعي الشريط ملكية الملكية الفكرية المقدَّمة. وقد تُراجع الطلبات داخليًا وتُشارك مع مجموعات العمل المعنية للتقييم.',
        bodyEn:
          'When you submit an idea, proposal, or supporting document through the website, you confirm that you have the right to share it and that doing so does not breach any obligation owed to a third party.\n\nWater STRIP does not claim ownership of the intellectual property submitted. Submissions may be reviewed internally and shared with the relevant working groups for evaluation.',
      },
      {
        id: 'terms-ip',
        titleAr: '5. الملكية الفكرية',
        titleEn: '5. Intellectual Property',
        bodyAr: 'اسم الشريط وشعاره وهويته البصرية ومحتوى الموقع ملكية للتحالف وأعضائه، ومحمية بموجب الأنظمة المعمول بها.',
        bodyEn:
          'The Water STRIP name, logo, visual identity, and website content are the property of the alliance and its members, and are protected under applicable law.',
      },
      {
        id: 'terms-third-party',
        titleAr: '6. روابط الأطراف الثالثة',
        titleEn: '6. Third-Party Links',
        bodyAr: 'قد يتضمن الموقع روابط لمواقع خارجية، والشريط غير مسؤول عن محتواها أو توفّرها أو ممارسات الخصوصية فيها.',
        bodyEn:
          'The website may contain links to external sites. Water STRIP is not responsible for their content, availability, or privacy practices.',
      },
      {
        id: 'terms-disclaimer',
        titleAr: '7. إخلاء المسؤولية',
        titleEn: '7. Disclaimer',
        bodyAr:
          'يُقدَّم المحتوى لأغراض المعلومات فقط ولا يُعدّ استشارة مهنية أو قانونية أو تقنية أو استثمارية. ولا يضمن الشريط أن يكون الموقع متاحًا دون انقطاع أو خاليًا من الأخطاء.',
        bodyEn:
          'Content is provided for informational purposes only and does not constitute professional, legal, technical, or investment advice. Water STRIP does not guarantee that the website will be available uninterrupted or free of errors.',
      },
      {
        id: 'terms-law',
        titleAr: '8. النظام الواجب التطبيق',
        titleEn: '8. Governing Law',
        bodyAr: 'تخضع هذه الشروط لأنظمة المملكة العربية السعودية، وتختص المحاكم السعودية المختصة حصريًا بنظر أي نزاع.',
        bodyEn:
          'These terms are governed by the laws of the Kingdom of Saudi Arabia, and the competent Saudi courts shall have exclusive jurisdiction over any dispute.',
      },
      {
        id: 'terms-contact',
        titleAr: '9. التواصل',
        titleEn: '9. Contact',
        bodyAr: 'للاستفسار عن هذه الشروط: [support@waterstrip.org](mailto:support@waterstrip.org).',
        bodyEn: 'For inquiries about these terms: [support@waterstrip.org](mailto:support@waterstrip.org).',
      },
    ],
  },
});
