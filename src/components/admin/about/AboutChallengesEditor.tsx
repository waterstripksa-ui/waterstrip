/** Edits `about_challenges` — the national-challenges intro and card grid. */
import type { AboutChallenge, AboutChallenges } from '../../../lib/content/schemas/about-challenges.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { ItemList } from '../ItemList.tsx';
import { TextField } from '../fields/TextField.tsx';
import { TextAreaField } from '../fields/TextAreaField.tsx';
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
      <TextField
        label="نص الزر"
        value={draft.ctaLabelAr}
        onChange={(v) => update({ ...draft, ctaLabelAr: v })}
        name="ctaLabelAr"
        error={errors.ctaLabelAr}
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
        makeItem={(id) => ({ id, titleAr: 'تحدٍّ جديد', bodyAr: 'وصف التحدّي.', imageId: null })}
        idPrefix="nc"
        min={1}
        max={8}
        labelFor={(item) => item.titleAr}
        addLabel="إضافة تحدٍّ"
      >
        {(item, i, patch) => (
          <>
            <TextField
              label="العنوان"
              value={item.titleAr}
              onChange={(v) => patch({ titleAr: v })}
              name={`items.${i}.titleAr`}
              error={errors[`items.${i}.titleAr`]}
            />
            <TextAreaField
              label="الوصف"
              value={item.bodyAr}
              onChange={(v) => patch({ bodyAr: v })}
              name={`items.${i}.bodyAr`}
              error={errors[`items.${i}.bodyAr`]}
              rows={2}
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
