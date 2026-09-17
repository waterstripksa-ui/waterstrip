/** The accessibility statement page — see legal-shared.ts for the content model. */
import { defineSingleton } from './types.ts';
import { addEnFields } from './add-en-fields.ts';
import { legalPageSchema, type LegalPage } from './legal-shared.ts';

export const legalAccessibility = defineSingleton<LegalPage>({
  key: 'legal_accessibility',
  version: 2,
  schema: legalPageSchema,
  migrations: [addEnFields],
  initial: {
    titleAr: 'إمكانية الوصول',
    titleEn: 'Accessibility',
    updatedLabelAr: 'آخر تحديث: 3 أغسطس 2026',
    updatedLabelEn: 'Last updated: August 3, 2026',
    sections: [
      {
        id: 'a11y-commitment',
        titleAr: 'التزامنا',
        titleEn: 'Our Commitment',
        bodyAr:
          'يلتزم الشريط بجعل هذا الموقع قابلًا للاستخدام من أوسع شريحة ممكنة، بغضّ النظر عن التقنية أو القدرة، ونستهدف المطابقة مع معيار WCAG 2.1 المستوى AA.',
        bodyEn:
          'Water STRIP is committed to making this website usable by the widest possible range of people, regardless of technology or ability, and we aim to conform to WCAG 2.1 Level AA.',
      },
      {
        id: 'a11y-in-place',
        titleAr: 'ما تم تطبيقه',
        titleEn: 'What We Have Implemented',
        bodyAr:
          '- بنية HTML دلالية بمعلَم رئيسي واحد وترتيب منطقي للعناوين.\n- إمكانية الوصول بلوحة المفاتيح لجميع العناصر التفاعلية مع حالة تركيز مرئية.\n- تباين نصّي يحقق حدود المستوى AA مقابل الخلفية.\n- نص بديل للصور ذات المعنى، وإخفاء الصور الزخرفية عن التقنيات المساعدة.\n- دعم كامل لخاصية prefers-reduced-motion — تُعطَّل جميع الحركات عند تفعيلها.\n- تصميم متجاوب يعيد التدفّق دون تمرير أفقي حتى عرض 320 بكسل.',
        bodyEn:
          '- Semantic HTML structure with a single main landmark and a logical heading order.\n- Full keyboard accessibility for all interactive elements, with a visible focus state.\n- Text contrast that meets Level AA thresholds against its background.\n- Alt text for meaningful images, with decorative images hidden from assistive technology.\n- Full support for prefers-reduced-motion — all animation is disabled when it is enabled.\n- A responsive design that reflows without horizontal scrolling down to a width of 320 pixels.',
      },
      {
        id: 'a11y-known-limits',
        titleAr: 'القيود المعروفة',
        titleEn: 'Known Limitations',
        bodyAr:
          '- بعض المحتوى قد يظهر بالإنجليزية إلى حين اكتمال الترجمة.\n- قد لا يستوفي بعض المحتوى المضمَّن من أطراف ثالثة المستوى AA بالكامل.',
        bodyEn:
          '- Some content may appear in English until translation is complete.\n- Some content embedded from third parties may not fully meet Level AA.',
      },
      {
        id: 'a11y-feedback',
        titleAr: 'الملاحظات',
        titleEn: 'Feedback',
        bodyAr:
          'إذا واجهتك أي صعوبة في الوصول، راسلنا على [support@waterstrip.org](mailto:support@waterstrip.org) مع ذكر عنوان الصفحة ووصف مختصر للمشكلة. ونسعى للرد خلال ثلاثة أيام عمل.',
        bodyEn:
          'If you encounter any accessibility difficulty, email us at [support@waterstrip.org](mailto:support@waterstrip.org) with the page address and a brief description of the issue. We aim to respond within three business days.',
      },
    ],
  },
});
