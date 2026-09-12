/** Edits `home_about_banner` — the closing membership banner. */
import type { HomeAboutBanner } from '../../lib/content/schemas/home-about-banner.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { TextField } from './fields/TextField.tsx';
import { TextAreaField } from './fields/TextAreaField.tsx';
import { HrefField } from './fields/HrefField.tsx';

export default function AboutBannerEditor({ initial }: { initial: HomeAboutBanner }) {
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_about_banner',
    initial,
  );

  return (
    <SectionForm
      title="بانر العضوية"
      lede="القسم الأخير في الصفحة. صورة الخلفية ثابتة وتُحدَّد برمجيًا."
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
        rows={2}
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
    </SectionForm>
  );
}
