/** Edits `about_hero` — the title band rendered through PageHero. */
import type { AboutHero } from '../../../lib/content/schemas/about-hero.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { BilingualTextField, BilingualTextAreaField } from '../fields/BilingualFields.tsx';

export default function AboutHeroEditor({ initial }: { initial: AboutHero }) {
  const title = 'العنوان الرئيسي';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'about_hero',
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
        rows={3}
        valueEn={draft.ledeEn}
        onChangeEn={(v) => update({ ...draft, ledeEn: v })}
        errorEn={errors.ledeEn}
      />
    </SectionForm>
  );
}
