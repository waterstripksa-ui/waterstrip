/**
 * Edits one legal/policy page — terms, privacy, cookies or accessibility.
 * All four share the same shape (a title plus a dynamic list of titled
 * prose sections), so one editor serves all of them instead of four
 * near-identical files. See legal-shared.ts for the content-model rationale.
 */
import type { LegalPage, LegalSection } from '../../../lib/content/schemas/legal-shared.ts';
import type { SingletonKey } from '../../../lib/content/schemas/index.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { ItemList } from '../ItemList.tsx';
import { TextField } from '../fields/TextField.tsx';
import { TextAreaField } from '../fields/TextAreaField.tsx';

const PROSE_HINT =
  'افصل بين الفقرات بسطر فارغ. لعرض قائمة نقطية ابدأ كل سطر بـ "- ". لتمييز جزء من النص بالخط الغامق أحطه بين نجمتين مثل **هكذا**. لإضافة رابط استخدم الصيغة ‎[النص](الرابط)‎، والروابط المسموحة هي مسار داخلي مثل ‎/contact‎ أو ‎mailto:‎.';

export default function LegalPageEditor({
  singletonKey,
  title,
  lede,
  initial,
}: {
  singletonKey: SingletonKey;
  title: string;
  lede?: string;
  initial: LegalPage;
}) {
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    singletonKey,
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede={lede}
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
      <TextField
        label="عنوان الصفحة"
        value={draft.titleAr}
        onChange={(v) => update({ ...draft, titleAr: v })}
        name="titleAr"
        error={errors.titleAr}
      />
      <TextField
        label="تاريخ آخر تحديث"
        value={draft.updatedLabelAr}
        onChange={(v) => update({ ...draft, updatedLabelAr: v })}
        name="updatedLabelAr"
        error={errors.updatedLabelAr}
        hint="يظهر كما هو، مثل «آخر تحديث: 3 أغسطس 2026»."
      />

      <ItemList<LegalSection>
        items={draft.sections}
        onChange={(sections) => update({ ...draft, sections })}
        makeItem={(id) => ({ id, titleAr: 'قسم جديد', bodyAr: 'نص القسم.' })}
        idPrefix="sec"
        min={1}
        max={20}
        labelFor={(section) => section.titleAr}
        addLabel="إضافة قسم"
      >
        {(section, i, patch) => (
          <>
            <TextField
              label="عنوان القسم"
              value={section.titleAr}
              onChange={(v) => patch({ titleAr: v })}
              name={`sections.${i}.titleAr`}
              error={errors[`sections.${i}.titleAr`]}
            />
            <TextAreaField
              label="نص القسم"
              value={section.bodyAr}
              onChange={(v) => patch({ bodyAr: v })}
              name={`sections.${i}.bodyAr`}
              error={errors[`sections.${i}.bodyAr`]}
              hint={PROSE_HINT}
              rows={6}
            />
          </>
        )}
      </ItemList>
    </SectionForm>
  );
}
