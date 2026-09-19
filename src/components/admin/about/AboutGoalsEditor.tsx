/**
 * Edits `about_goals` — the goals panel. Goals can be added, removed and
 * reordered within the limits in src/lib/content/schemas/about-goals.ts. The
 * ordinals the public panel prints are derived from list position, so there is
 * no number field.
 */
import type { AboutGoal, AboutGoals } from '../../../lib/content/schemas/about-goals.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { ItemList } from '../ItemList.tsx';
import { BilingualTextField, BilingualTextAreaField } from '../fields/BilingualFields.tsx';

export default function AboutGoalsEditor({ initial }: { initial: AboutGoals }) {
  const title = 'الأهداف';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'about_goals',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede="يمكن إضافة الأهداف وحذفها وترتيبها. الترقيم يُحسب تلقائيًا من ترتيب القائمة. إذا ذكر العنوان عددًا (مثل «أربعة أهداف») فحدّثه عند تغيير العدد."
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
      <BilingualTextField
        label="العنوان الفرعي"
        value={draft.eyebrowAr}
        onChange={(v) => update({ ...draft, eyebrowAr: v })}
        name="eyebrowAr"
        error={errors.eyebrowAr}
        valueEn={draft.eyebrowEn}
        onChangeEn={(v) => update({ ...draft, eyebrowEn: v })}
        errorEn={errors.eyebrowEn}
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
      <BilingualTextAreaField
        label="النص التعريفي"
        value={draft.ledeAr}
        onChange={(v) => update({ ...draft, ledeAr: v })}
        name="ledeAr"
        error={errors.ledeAr}
        rows={3}
        valueEn={draft.ledeEn}
        onChangeEn={(v) => update({ ...draft, ledeEn: v })}
        errorEn={errors.ledeEn}
      />

      <ItemList<AboutGoal>
        items={draft.items}
        onChange={(items) => update({ ...draft, items })}
        makeItem={(id) => ({ id, titleAr: 'هدف جديد', titleEn: '', bodyAr: 'وصف الهدف', bodyEn: '' })}
        idPrefix="ag"
        min={1}
        max={8}
        labelFor={(_, i) => `الهدف ${i + 1}`}
        addLabel="إضافة هدف"
      >
        {(goal, i, patch) => (
          <>
            <BilingualTextField
              label="العنوان"
              value={goal.titleAr}
              onChange={(v) => patch({ titleAr: v })}
              name={`items.${i}.titleAr`}
              error={errors[`items.${i}.titleAr`]}
              valueEn={goal.titleEn}
              onChangeEn={(v) => patch({ titleEn: v })}
              errorEn={errors[`items.${i}.titleEn`]}
            />
            <BilingualTextAreaField
              label="الوصف"
              value={goal.bodyAr}
              onChange={(v) => patch({ bodyAr: v })}
              name={`items.${i}.bodyAr`}
              error={errors[`items.${i}.bodyAr`]}
              rows={2}
              valueEn={goal.bodyEn}
              onChangeEn={(v) => patch({ bodyEn: v })}
              errorEn={errors[`items.${i}.bodyEn`]}
            />
          </>
        )}
      </ItemList>
    </SectionForm>
  );
}
