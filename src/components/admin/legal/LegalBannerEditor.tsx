/** Edits `legal_banner` — the closing membership banner shared by every legal/utility page. */
import type { LegalBanner } from '../../../lib/content/schemas/legal-banner.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { BilingualTextField, BilingualTextAreaField } from '../fields/BilingualFields.tsx';
import { HrefField } from '../fields/HrefField.tsx';
import { ImageField } from '../fields/ImageField.tsx';
import type { MediaView } from '../../../lib/content/cache.ts';

export default function LegalBannerEditor({
  initial,
  media,
}: {
  initial: LegalBanner;
  media: Record<string, MediaView>;
}) {
  const title = 'بانر العضوية';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'legal_banner',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede="يظهر في نهاية كل صفحة من صفحات الشؤون النظامية (الشروط، الخصوصية، ملفات الارتباط، إمكانية الوصول)."
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
        rows={2}
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
      <ImageField
        label="صورة الخلفية"
        value={draft.imageId}
        onChange={(v) => update({ ...draft, imageId: v })}
        name="imageId"
        error={errors.imageId}
        hint="صورة أفقية عريضة لا يقل عرضها عن 1920 بكسل، ويظهر النص فوق وسطها."
        defaultAlt={draft.headingAr}
        known={media}
      />
    </SectionForm>
  );
}
