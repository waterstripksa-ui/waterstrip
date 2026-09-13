/** Edits `members_banner` — the members pages' shared closing membership banner. */
import type { MembersBanner } from '../../../lib/content/schemas/members-banner.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { TextField } from '../fields/TextField.tsx';
import { TextAreaField } from '../fields/TextAreaField.tsx';
import { HrefField } from '../fields/HrefField.tsx';
import { ImageField } from '../fields/ImageField.tsx';
import type { MediaView } from '../../../lib/content/cache.ts';

export default function MembersBannerEditor({
  initial,
  media,
}: {
  initial: MembersBanner;
  media: Record<string, MediaView>;
}) {
  const title = 'بانر العضوية';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'members_banner',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede="القسم الأخير في صفحتي الأعضاء وملف العضو."
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
