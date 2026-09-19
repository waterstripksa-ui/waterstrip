/** Edits `corridor_hero` — the /corridor page's title band. */
import type { CorridorHero } from '../../lib/content/schemas/corridor-hero.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { BilingualTextField, BilingualTextAreaField } from './fields/BilingualFields.tsx';

export default function CorridorHeroEditor({ initial }: { initial: CorridorHero }) {
  const title = 'العنوان الرئيسي';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'corridor_hero',
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
        label="عنوان مسار التنقّل (الأخير)"
        value={draft.crumbAr}
        onChange={(v) => update({ ...draft, crumbAr: v })}
        name="crumbAr"
        error={errors.crumbAr}
        valueEn={draft.crumbEn}
        onChangeEn={(v) => update({ ...draft, crumbEn: v })}
        errorEn={errors.crumbEn}
      />
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
