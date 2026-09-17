/**
 * Edits `register_info` — the "ماذا بعد؟" aside card. Always exactly four
 * steps (see src/lib/content/schemas/register-info.ts), so rows are fixed:
 * no add/remove. The 1–4 numbers the public panel prints are derived from
 * list position, so there is no number field.
 */
import type { RegisterInfo } from '../../../lib/content/schemas/register-info.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { BilingualTextField, BilingualTextAreaField } from '../fields/BilingualFields.tsx';
import { TextField } from '../fields/TextField.tsx';

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
      <BilingualTextField
        label="العنوان"
        value={draft.headingAr}
        onChange={(v) => update({ ...draft, headingAr: v })}
        name="headingAr"
        error={errors.headingAr}
        valueEn={draft.headingEn}
        onChangeEn={(v) => update({ ...draft, headingEn: v })}
        errorEn={errors.headingEn}
      />
      <BilingualTextAreaField
        label="النص التعريفي"
        value={draft.ledeAr}
        onChange={(v) => update({ ...draft, ledeAr: v })}
        name="ledeAr"
        error={errors.ledeAr}
        rows={2}
        valueEn={draft.ledeEn}
        onChangeEn={(v) => update({ ...draft, ledeEn: v })}
        errorEn={errors.ledeEn}
      />

      {draft.steps.map((step, i) => (
        <fieldset className="form" key={step.id}>
          <legend className="form__label">الخطوة {i + 1}</legend>
          <BilingualTextField
            label="العنوان"
            value={step.titleAr}
            onChange={(v) => patchStep(i, { titleAr: v })}
            name={`steps.${i}.titleAr`}
            error={errors[`steps.${i}.titleAr`]}
            valueEn={step.titleEn}
            onChangeEn={(v) => patchStep(i, { titleEn: v })}
            errorEn={errors[`steps.${i}.titleEn`]}
          />
          <BilingualTextAreaField
            label="الوصف"
            value={step.bodyAr}
            onChange={(v) => patchStep(i, { bodyAr: v })}
            name={`steps.${i}.bodyAr`}
            error={errors[`steps.${i}.bodyAr`]}
            rows={2}
            valueEn={step.bodyEn}
            onChangeEn={(v) => patchStep(i, { bodyEn: v })}
            errorEn={errors[`steps.${i}.bodyEn`]}
          />
        </fieldset>
      ))}

      <BilingualTextField
        label="عنوان قسم السؤال"
        value={draft.questionLabelAr}
        onChange={(v) => update({ ...draft, questionLabelAr: v })}
        name="questionLabelAr"
        error={errors.questionLabelAr}
        valueEn={draft.questionLabelEn}
        onChangeEn={(v) => update({ ...draft, questionLabelEn: v })}
        errorEn={errors.questionLabelEn}
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
