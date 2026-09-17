/**
 * Edits `about_glance` — the "نظرة عامة" stat strip. Always exactly four
 * figures (see src/lib/content/schemas/about-glance.ts), so rows are fixed:
 * no add/remove, unlike ItemList-backed sections.
 */
import type { AboutGlance } from '../../../lib/content/schemas/about-glance.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { BilingualTextField } from '../fields/BilingualFields.tsx';
import { TextField } from '../fields/TextField.tsx';
import { CheckboxField } from '../fields/CheckboxField.tsx';

export default function AboutGlanceEditor({ initial }: { initial: AboutGlance }) {
  const title = 'نظرة عامة';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'about_glance',
    initial,
    title,
  );

  function patchStat(i: number, fields: Partial<AboutGlance['stats'][number]>) {
    update({
      ...draft,
      stats: draft.stats.map((stat, n) => (n === i ? { ...stat, ...fields } : stat)),
    });
  }

  return (
    <SectionForm
      title={title}
      lede="أربعة أرقام ثابتة تظهر في القسم."
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
      <CheckboxField
        label="إخفاء القسم من الصفحة"
        value={draft.hidden}
        onChange={(v) => update({ ...draft, hidden: v })}
        name="hidden"
        error={errors.hidden}
      />
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

      {draft.stats.map((stat, i) => (
        <fieldset className="form" key={stat.id}>
          <legend className="form__label">الرقم {i + 1}</legend>
          <TextField
            label="القيمة"
            value={String(stat.value)}
            onChange={(v) => patchStat(i, { value: Number(v.replace(/\D/g, '')) || 0 })}
            name={`stats.${i}.value`}
            error={errors[`stats.${i}.value`]}
            ltr
          />
          <BilingualTextField
            label="الوصف"
            value={stat.labelAr}
            onChange={(v) => patchStat(i, { labelAr: v })}
            name={`stats.${i}.labelAr`}
            error={errors[`stats.${i}.labelAr`]}
            valueEn={stat.labelEn}
            onChangeEn={(v) => patchStat(i, { labelEn: v })}
            errorEn={errors[`stats.${i}.labelEn`]}
          />
        </fieldset>
      ))}
    </SectionForm>
  );
}
