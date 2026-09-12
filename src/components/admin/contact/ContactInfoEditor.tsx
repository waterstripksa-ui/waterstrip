/** Edits `contact_info` — the "التواصل المباشر" aside card. */
import type { ContactInfo } from '../../../lib/content/schemas/contact-info.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { TextField } from '../fields/TextField.tsx';
import { TextAreaField } from '../fields/TextAreaField.tsx';

export default function ContactInfoEditor({ initial }: { initial: ContactInfo }) {
  const title = 'التواصل المباشر';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'contact_info',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede="بطاقة قنوات التواصل المباشر، إلى جانب نموذج التواصل."
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
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
        label="عنوان الاستفسارات العامة"
        value={draft.supportLabelAr}
        onChange={(v) => update({ ...draft, supportLabelAr: v })}
        name="supportLabelAr"
        error={errors.supportLabelAr}
      />
      <TextField
        label="البريد الإلكتروني للدعم"
        value={draft.supportEmail}
        onChange={(v) => update({ ...draft, supportEmail: v })}
        name="supportEmail"
        error={errors.supportEmail}
        ltr
      />
      <TextField
        label="نص رابط العضوية"
        value={draft.membershipLabelAr}
        onChange={(v) => update({ ...draft, membershipLabelAr: v })}
        name="membershipLabelAr"
        error={errors.membershipLabelAr}
      />
      <TextField
        label="نص رابط المركز الإعلامي"
        value={draft.mediaLabelAr}
        onChange={(v) => update({ ...draft, mediaLabelAr: v })}
        name="mediaLabelAr"
        error={errors.mediaLabelAr}
      />
      <TextField
        label="عنوان مدة الرد"
        value={draft.responseLabelAr}
        onChange={(v) => update({ ...draft, responseLabelAr: v })}
        name="responseLabelAr"
        error={errors.responseLabelAr}
      />
      <TextField
        label="نص مدة الرد"
        value={draft.responseTextAr}
        onChange={(v) => update({ ...draft, responseTextAr: v })}
        name="responseTextAr"
        error={errors.responseTextAr}
      />
    </SectionForm>
  );
}
