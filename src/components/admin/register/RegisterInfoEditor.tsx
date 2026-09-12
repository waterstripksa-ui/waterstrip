/**
 * Edits `register_info` — the "ماذا بعد؟" aside card. Always exactly four
 * steps (see src/lib/content/schemas/register-info.ts), so rows are fixed:
 * no add/remove. The 1–4 numbers the public panel prints are derived from
 * list position, so there is no number field.
 */
import type { RegisterInfo } from '../../../lib/content/schemas/register-info.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { TextField } from '../fields/TextField.tsx';
import { TextAreaField } from '../fields/TextAreaField.tsx';

export default function RegisterInfoEditor({ initial }: { initial: RegisterInfo }) {
  const title = 'ماذا بعد؟';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'register_info',
    initial,
    title,
  );

  function patchStep(i: number, fields: Partial<RegisterInfo['steps'][number]>) {
    update({
      ...draft,
      steps: draft.steps.map((step, n) => (n === i ? { ...step, ...fields } : step)),
    });
  }

  return (
    <SectionForm
      title={title}
      lede="ترقيم الخطوات (١–٤) يُحسب تلقائيًا من ترتيب القائمة."
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
      <TextField
        label="العنوان"
        value={draft.headingAr}
        onChange={(v) => update({ ...draft, headingAr: v })}
        name="headingAr"
        error={errors.headingAr}
      />
      <TextAreaField
        label="النص التعريفي"
        value={draft.ledeAr}
        onChange={(v) => update({ ...draft, ledeAr: v })}
        name="ledeAr"
        error={errors.ledeAr}
        rows={2}
      />

      {draft.steps.map((step, i) => (
        <fieldset className="form" key={step.id}>
          <legend className="form__label">الخطوة {i + 1}</legend>
          <TextField
            label="العنوان"
            value={step.titleAr}
            onChange={(v) => patchStep(i, { titleAr: v })}
            name={`steps.${i}.titleAr`}
            error={errors[`steps.${i}.titleAr`]}
          />
          <TextAreaField
            label="الوصف"
            value={step.bodyAr}
            onChange={(v) => patchStep(i, { bodyAr: v })}
            name={`steps.${i}.bodyAr`}
            error={errors[`steps.${i}.bodyAr`]}
            rows={2}
          />
        </fieldset>
      ))}

      <TextField
        label="عنوان قسم السؤال"
        value={draft.questionLabelAr}
        onChange={(v) => update({ ...draft, questionLabelAr: v })}
        name="questionLabelAr"
        error={errors.questionLabelAr}
      />
      <TextField
        label="البريد الإلكتروني للدعم"
        value={draft.supportEmail}
        onChange={(v) => update({ ...draft, supportEmail: v })}
        name="supportEmail"
        error={errors.supportEmail}
        ltr
      />
    </SectionForm>
  );
}
