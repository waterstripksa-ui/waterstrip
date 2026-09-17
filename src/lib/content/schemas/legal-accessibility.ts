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
    titleEn: '',
    updatedLabelAr: 'آخر تحديث: 3 أغسطس 2026',
    updatedLabelEn: '',
    sections: [
      {
        id: 'a11y-commitment',
        titleAr: 'التزامنا',
        titleEn: '',
        bodyAr:
          'يلتزم الشريط بجعل هذا الموقع قابلًا للاستخدام من أوسع شريحة ممكنة، بغضّ النظر عن التقنية أو القدرة، ونستهدف المطابقة مع معيار WCAG 2.1 المستوى AA.',
        bodyEn: '',
      },
      {
        id: 'a11y-in-place',
        titleAr: 'ما تم تطبيقه',
        titleEn: '',
        bodyAr:
          '- بنية HTML دلالية بمعلَم رئيسي واحد وترتيب منطقي للعناوين.\n- إمكانية الوصول بلوحة المفاتيح لجميع العناصر التفاعلية مع حالة تركيز مرئية.\n- تباين نصّي يحقق حدود المستوى AA مقابل الخلفية.\n- نص بديل للصور ذات المعنى، وإخفاء الصور الزخرفية عن التقنيات المساعدة.\n- دعم كامل لخاصية prefers-reduced-motion — تُعطَّل جميع الحركات عند تفعيلها.\n- تصميم متجاوب يعيد التدفّق دون تمرير أفقي حتى عرض 320 بكسل.',
        bodyEn: '',
      },
      {
        id: 'a11y-known-limits',
        titleAr: 'القيود المعروفة',
        titleEn: '',
        bodyAr:
          '- بعض المحتوى قد يظهر بالإنجليزية إلى حين اكتمال الترجمة.\n- قد لا يستوفي بعض المحتوى المضمَّن من أطراف ثالثة المستوى AA بالكامل.',
        bodyEn: '',
      },
      {
        id: 'a11y-feedback',
        titleAr: 'الملاحظات',
        titleEn: '',
        bodyAr:
          'إذا واجهتك أي صعوبة في الوصول، راسلنا على [support@waterstrip.org](mailto:support@waterstrip.org) مع ذكر عنوان الصفحة ووصف مختصر للمشكلة. ونسعى للرد خلال ثلاثة أيام عمل.',
        bodyEn: '',
      },
    ],
  },
});
