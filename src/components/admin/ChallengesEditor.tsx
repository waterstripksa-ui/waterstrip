/** Edits `home_challenges` — the intro and the slider labels. */
import type { HomeChallenge, HomeChallenges } from '../../lib/content/schemas/home-challenges.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { ItemList } from './ItemList.tsx';
import { BilingualTextField, BilingualTextAreaField } from './fields/BilingualFields.tsx';
import { ImageField } from './fields/ImageField.tsx';
import type { MediaView } from '../../lib/content/cache.ts';

export default function ChallengesEditor({
  initial,
  media,
}: {
  initial: HomeChallenges;
  media: Record<string, MediaView>;
}) {
  const title = 'التحديات';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_challenges',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede="عناصر شريط التحديات. العنصر الذي لا صورة له يظهر برسم توضيحي افتراضي."
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
      <BilingualTextAreaField
        label="النص التعريفي"
        value={draft.headingAr}
        onChange={(v) => update({ ...draft, headingAr: v })}
        name="headingAr"
        error={errors.headingAr}
        rows={3}
        valueEn={draft.headingEn}
        onChangeEn={(v) => update({ ...draft, headingEn: v })}
        errorEn={errors.headingEn}
      />

      <ItemList<HomeChallenge>
        items={draft.items}
        onChange={(items) => update({ ...draft, items })}
        makeItem={(id) => ({ id, labelAr: 'تحدٍّ جديد', labelEn: '', imageId: null })}
        idPrefix="ch"
        min={1}
        max={12}
        labelFor={(_, i) => `التحدّي ${i + 1}`}
        addLabel="إضافة تحدٍّ"
      >
        {(item, i, patch) => (
          <>
            <BilingualTextField
              label="النص"
              value={item.labelAr}
              onChange={(v) => patch({ labelAr: v })}
              name={`items.${i}.labelAr`}
              error={errors[`items.${i}.labelAr`]}
              valueEn={item.labelEn}
              onChangeEn={(v) => patch({ labelEn: v })}
              errorEn={errors[`items.${i}.labelEn`]}
            />
            <ImageField
              label="الصورة"
              value={item.imageId}
              onChange={(v) => patch({ imageId: v })}
              name={`items.${i}.imageId`}
              error={errors[`items.${i}.imageId`]}
              hint="صورة أفقية لا يقل عرضها عن 800 بكسل؛ تُقصّ لتملأ إطارًا منخفض الارتفاع."
              defaultAlt={item.labelAr}
              known={media}
            />
          </>
        )}
      </ItemList>
    </SectionForm>
  );
}
