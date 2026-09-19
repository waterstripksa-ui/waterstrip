/** Edits `home_discover` — the intro text under the hero. */
import type { HomeDiscover } from '../../lib/content/schemas/home-discover.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { BilingualTextField, BilingualTextAreaField } from './fields/BilingualFields.tsx';

export default function DiscoverEditor({ initial }: { initial: HomeDiscover }) {
  const title = 'تعرّف على الشريط';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_discover',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede="النص التعريفي أسفل الغلاف."
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
        label="النص التعريفي"
        value={draft.headingAr}
        onChange={(v) => update({ ...draft, headingAr: v })}
        name="headingAr"
        error={errors.headingAr}
        rows={4}
        valueEn={draft.headingEn}
        onChangeEn={(v) => update({ ...draft, headingEn: v })}
        errorEn={errors.headingEn}
      />
    </SectionForm>
  );
}
