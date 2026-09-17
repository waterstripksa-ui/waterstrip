/** Edits `about_challenges` — the national-challenges intro and card grid. */
import type { AboutChallenge, AboutChallenges } from '../../../lib/content/schemas/about-challenges.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { ItemList } from '../ItemList.tsx';
import { BilingualTextField, BilingualTextAreaField } from '../fields/BilingualFields.tsx';
import { HrefField } from '../fields/HrefField.tsx';
import { ImageField } from '../fields/ImageField.tsx';
import type { MediaView } from '../../../lib/content/cache.ts';

export default function AboutChallengesEditor({
  initial,
  media,
}: {
  initial: AboutChallenges;
  media: Record<string, MediaView>;
}) {
  const title = 'التحديات الوطنية';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'about_challenges',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
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
      <BilingualTextField
        label="نص الزر"
        value={draft.ctaLabelAr}
        onChange={(v) => update({ ...draft, ctaLabelAr: v })}
        name="ctaLabelAr"
        error={errors.ctaLabelAr}
        valueEn={draft.ctaLabelEn}
        onChangeEn={(v) => update({ ...draft, ctaLabelEn: v })}
        errorEn={errors.ctaLabelEn}
      />
      <HrefField
        value={draft.ctaHref}
        onChange={(v) => update({ ...draft, ctaHref: v })}
        name="ctaHref"
        error={errors.ctaHref}
      />

      <ItemList<AboutChallenge>
        items={draft.items}
        onChange={(items) => update({ ...draft, items })}
        makeItem={(id) => ({ id, titleAr: 'تحدٍّ جديد', titleEn: '', bodyAr: 'وصف التحدّي.', bodyEn: '', imageId: null })}
        idPrefix="nc"
        min={1}
        max={8}
        labelFor={(item) => item.titleAr}
        addLabel="إضافة تحدٍّ"
      >
        {(item, i, patch) => (
          <>
            <BilingualTextField
              label="العنوان"
              value={item.titleAr}
              onChange={(v) => patch({ titleAr: v })}
              name={`items.${i}.titleAr`}
              error={errors[`items.${i}.titleAr`]}
              valueEn={item.titleEn}
              onChangeEn={(v) => patch({ titleEn: v })}
              errorEn={errors[`items.${i}.titleEn`]}
            />
            <BilingualTextAreaField
              label="الوصف"
              value={item.bodyAr}
              onChange={(v) => patch({ bodyAr: v })}
              name={`items.${i}.bodyAr`}
              error={errors[`items.${i}.bodyAr`]}
              rows={2}
              valueEn={item.bodyEn}
              onChangeEn={(v) => patch({ bodyEn: v })}
              errorEn={errors[`items.${i}.bodyEn`]}
            />
            <ImageField
              label="الصورة"
              value={item.imageId}
              onChange={(v) => patch({ imageId: v })}
              name={`items.${i}.imageId`}
              error={errors[`items.${i}.imageId`]}
              hint="صورة أفقية لا يقل عرضها عن 800 بكسل."
              defaultAlt={item.titleAr}
              known={media}
            />
          </>
        )}
      </ItemList>
    </SectionForm>
  );
}
