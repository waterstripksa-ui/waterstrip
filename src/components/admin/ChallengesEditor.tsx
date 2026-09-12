/** Edits `home_challenges` — the intro and the slider labels. */
import type { HomeChallenge, HomeChallenges } from '../../lib/content/schemas/home-challenges.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { ItemList } from './ItemList.tsx';
import { TextField } from './fields/TextField.tsx';
import { TextAreaField } from './fields/TextAreaField.tsx';

export default function ChallengesEditor({ initial }: { initial: HomeChallenges }) {
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_challenges',
    initial,
  );

  return (
    <SectionForm
      title="التحديات"
      lede="عناصر شريط التحديات. الرسم التوضيحي لكل عنصر ثابت ويُحدَّد برمجيًا؛ العناصر المضافة تظهر بالشعار الافتراضي."
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
      <TextAreaField
        label="النص التعريفي"
        value={draft.headingAr}
        onChange={(v) => update({ ...draft, headingAr: v })}
        name="headingAr"
        error={errors.headingAr}
        rows={3}
      />

      <ItemList<HomeChallenge>
        items={draft.items}
        onChange={(items) => update({ ...draft, items })}
        makeItem={(id) => ({ id, labelAr: 'تحدٍّ جديد' })}
        idPrefix="ch"
        min={1}
        max={12}
        labelFor={(_, i) => `التحدّي ${i + 1}`}
        addLabel="إضافة تحدٍّ"
      >
        {(item, i, patch) => (
          <TextField
            label="النص"
            value={item.labelAr}
            onChange={(v) => patch({ labelAr: v })}
            name={`items.${i}.labelAr`}
            error={errors[`items.${i}.labelAr`]}
          />
        )}
      </ItemList>
    </SectionForm>
  );
}
