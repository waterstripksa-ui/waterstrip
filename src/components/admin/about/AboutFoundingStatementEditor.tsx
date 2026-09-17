/** Edits `about_founding_statement` — the closing "البيان التأسيسي" quote. */
import type { AboutFoundingStatement } from '../../../lib/content/schemas/about-founding-statement.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { BilingualTextField, BilingualTextAreaField } from '../fields/BilingualFields.tsx';
import { HrefField } from '../fields/HrefField.tsx';
import { ImageField } from '../fields/ImageField.tsx';
import type { MediaView } from '../../../lib/content/cache.ts';

export default function AboutFoundingStatementEditor({
  initial,
  media,
}: {
  initial: AboutFoundingStatement;
  media: Record<string, MediaView>;
}) {
  const title = 'البيان التأسيسي';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'about_founding_statement',
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
      <BilingualTextAreaField
        label="نص الاقتباس"
        value={draft.quoteAr}
        onChange={(v) => update({ ...draft, quoteAr: v })}
        name="quoteAr"
        error={errors.quoteAr}
        rows={4}
        valueEn={draft.quoteEn}
        onChangeEn={(v) => update({ ...draft, quoteEn: v })}
        errorEn={errors.quoteEn}
      />
      <BilingualTextField
        label="المصدر"
        value={draft.attributionAr}
        onChange={(v) => update({ ...draft, attributionAr: v })}
        name="attributionAr"
        error={errors.attributionAr}
        valueEn={draft.attributionEn}
        onChangeEn={(v) => update({ ...draft, attributionEn: v })}
        errorEn={errors.attributionEn}
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
      <ImageField
        label="الصورة"
        value={draft.imageId}
        onChange={(v) => update({ ...draft, imageId: v })}
        name="imageId"
        error={errors.imageId}
        hint="صورة عمودية أو أفقية لا يقل عرضها عن 800 بكسل."
        defaultAlt={draft.attributionAr}
        known={media}
      />
    </SectionForm>
  );
}
