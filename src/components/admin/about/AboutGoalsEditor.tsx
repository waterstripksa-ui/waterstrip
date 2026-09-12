/**
 * Edits `about_goals` — the "أربعة أهداف" panel. Always exactly four goals
 * (see src/lib/content/schemas/about-goals.ts), so rows are fixed: no
 * add/remove, unlike ItemList-backed sections. The 01–04 ordinals the public
 * panel prints are derived from list position, so there is no number field.
 */
import type { AboutGoals } from '../../../lib/content/schemas/about-goals.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { TextField } from '../fields/TextField.tsx';
import { TextAreaField } from '../fields/TextAreaField.tsx';

export default function AboutGoalsEditor({ initial }: { initial: AboutGoals }) {
  const title = 'الأهداف';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'about_goals',
    initial,
    title,
  );

  function patchGoal(i: number, fields: Partial<AboutGoals['items'][number]>) {
    update({
      ...draft,
      items: draft.items.map((goal, n) => (n === i ? { ...goal, ...fields } : goal)),
    });
  }

  return (
    <SectionForm
      title={title}
      lede="ترقيم الأهداف (٠١–٠٤) يُحسب تلقائيًا من ترتيب القائمة."
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
      <TextField
        label="العنوان الفرعي"
        value={draft.eyebrowAr}
        onChange={(v) => update({ ...draft, eyebrowAr: v })}
        name="eyebrowAr"
        error={errors.eyebrowAr}
      />
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
        rows={3}
      />

      {draft.items.map((goal, i) => (
        <fieldset className="form" key={goal.id}>
          <legend className="form__label">الهدف {i + 1}</legend>
          <TextField
            label="العنوان"
            value={goal.titleAr}
            onChange={(v) => patchGoal(i, { titleAr: v })}
            name={`items.${i}.titleAr`}
            error={errors[`items.${i}.titleAr`]}
          />
          <TextAreaField
            label="الوصف"
            value={goal.bodyAr}
            onChange={(v) => patchGoal(i, { bodyAr: v })}
            name={`items.${i}.bodyAr`}
            error={errors[`items.${i}.bodyAr`]}
            rows={2}
          />
        </fieldset>
      ))}
    </SectionForm>
  );
}
