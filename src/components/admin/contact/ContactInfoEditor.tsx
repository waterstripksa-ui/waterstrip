/** Edits `contact_info` — the "التواصل المباشر" aside card. */
import type { ContactInfo } from '../../../lib/content/schemas/contact-info.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { BilingualTextField, BilingualTextAreaField } from '../fields/BilingualFields.tsx';
import { TextField } from '../fields/TextField.tsx';

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
        label="عنوان الاستفسارات العامة"
        value={draft.supportLabelAr}
        onChange={(v) => update({ ...draft, supportLabelAr: v })}
        name="supportLabelAr"
        error={errors.supportLabelAr}
        valueEn={draft.supportLabelEn}
        onChangeEn={(v) => update({ ...draft, supportLabelEn: v })}
        errorEn={errors.supportLabelEn}
      />
      <TextField
        label="البريد الإلكتروني للدعم"
        value={draft.supportEmail}
        onChange={(v) => update({ ...draft, supportEmail: v })}
        name="supportEmail"
        error={errors.supportEmail}
        ltr
      />
      <BilingualTextField
        label="نص رابط العضوية"
        value={draft.membershipLabelAr}
        onChange={(v) => update({ ...draft, membershipLabelAr: v })}
        name="membershipLabelAr"
        error={errors.membershipLabelAr}
        valueEn={draft.membershipLabelEn}
        onChangeEn={(v) => update({ ...draft, membershipLabelEn: v })}
        errorEn={errors.membershipLabelEn}
      />
      <BilingualTextField
        label="نص رابط المركز الإعلامي"
        value={draft.mediaLabelAr}
        onChange={(v) => update({ ...draft, mediaLabelAr: v })}
        name="mediaLabelAr"
        error={errors.mediaLabelAr}
        valueEn={draft.mediaLabelEn}
        onChangeEn={(v) => update({ ...draft, mediaLabelEn: v })}
        errorEn={errors.mediaLabelEn}
      />
      <BilingualTextField
        label="عنوان مدة الرد"
        value={draft.responseLabelAr}
        onChange={(v) => update({ ...draft, responseLabelAr: v })}
        name="responseLabelAr"
        error={errors.responseLabelAr}
        valueEn={draft.responseLabelEn}
        onChangeEn={(v) => update({ ...draft, responseLabelEn: v })}
        errorEn={errors.responseLabelEn}
      />
      <BilingualTextField
        label="نص مدة الرد"
        value={draft.responseTextAr}
        onChange={(v) => update({ ...draft, responseTextAr: v })}
        name="responseTextAr"
        error={errors.responseTextAr}
        valueEn={draft.responseTextEn}
        onChangeEn={(v) => update({ ...draft, responseTextEn: v })}
        errorEn={errors.responseTextEn}
      />
    </SectionForm>
  );
}
