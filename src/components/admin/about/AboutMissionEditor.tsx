/** Edits `about_mission` — the "الرسالة والرؤية" narrative. */
import type { AboutMission } from '../../../lib/content/schemas/about-mission.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { TextField } from '../fields/TextField.tsx';
import { TextAreaField } from '../fields/TextAreaField.tsx';
import { ImageField } from '../fields/ImageField.tsx';
import type { MediaView } from '../../../lib/content/cache.ts';

export default function AboutMissionEditor({
  initial,
  media,
}: {
  initial: AboutMission;
  media: Record<string, MediaView>;
}) {
  const title = 'الرسالة والرؤية';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'about_mission',
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
        label="الفقرة الأولى"
        value={draft.bodyAr1}
        onChange={(v) => update({ ...draft, bodyAr1: v })}
        name="bodyAr1"
        error={errors.bodyAr1}
        rows={5}
      />
      <TextAreaField
        label="الفقرة الثانية"
        value={draft.bodyAr2}
        onChange={(v) => update({ ...draft, bodyAr2: v })}
        name="bodyAr2"
        error={errors.bodyAr2}
        rows={4}
      />
      <ImageField
        label="الصورة"
        value={draft.imageId}
        onChange={(v) => update({ ...draft, imageId: v })}
        name="imageId"
        error={errors.imageId}
        hint="صورة عمودية أو أفقية لا يقل عرضها عن 800 بكسل."
        defaultAlt={draft.headingAr}
        known={media}
      />
    </SectionForm>
  );
}
