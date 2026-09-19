/** Edits `home_working_groups` — the "مجموعة العمل" panel: copy, link and photo. */
import type { HomeWorkingGroups } from '../../lib/content/schemas/home-working-groups.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { BilingualTextField, BilingualTextAreaField } from './fields/BilingualFields.tsx';
import { HrefField } from './fields/HrefField.tsx';
import { ImageField } from './fields/ImageField.tsx';
import type { MediaView } from '../../lib/content/cache.ts';

export default function WorkingGroupsPanelEditor({
  initial,
  media,
}: {
  initial: HomeWorkingGroups;
  media: Record<string, MediaView>;
}) {
  const title = 'مجموعة العمل';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_working_groups',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede="اللوحة التي تعرّف بمجموعات العمل وتربط بصفحتها. تظهر الصورة الافتراضية إلى أن تُرفع صورة."
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
      <BilingualTextField
        label="العنوان"
        value={draft.titleAr}
        onChange={(v) => update({ ...draft, titleAr: v })}
        name="titleAr"
        error={errors.titleAr}
        valueEn={draft.titleEn}
        onChangeEn={(v) => update({ ...draft, titleEn: v })}
        errorEn={errors.titleEn}
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
      <BilingualTextAreaField
        label="النص الثانوي"
        value={draft.textAr}
        onChange={(v) => update({ ...draft, textAr: v })}
        name="textAr"
        error={errors.textAr}
        rows={3}
        valueEn={draft.textEn}
        onChangeEn={(v) => update({ ...draft, textEn: v })}
        errorEn={errors.textEn}
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
        label="رابط الزر"
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
        hint="صورة مربّعة لا يقل ضلعها عن 1000 بكسل؛ تُقصّ لتملأ إطارًا مربّعًا (رأسيًّا على الجوال)."
        defaultAlt={draft.imageAltAr}
        known={media}
      />
      <BilingualTextField
        label="النص البديل للصورة"
        value={draft.imageAltAr}
        onChange={(v) => update({ ...draft, imageAltAr: v })}
        name="imageAltAr"
        error={errors.imageAltAr}
        valueEn={draft.imageAltEn}
        onChangeEn={(v) => update({ ...draft, imageAltEn: v })}
        errorEn={errors.imageAltEn}
      />
    </SectionForm>
  );
}
