/** Edits `contact_hero` — the title band rendered through PageHero. */
import type { ContactHero } from '../../../lib/content/schemas/contact-hero.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { TextField } from '../fields/TextField.tsx';
import { TextAreaField } from '../fields/TextAreaField.tsx';

export default function ContactHeroEditor({ initial }: { initial: ContactHero }) {
  const title = 'العنوان الرئيسي';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'contact_hero',
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
        label="العنوان"
        value={draft.titleAr}
        onChange={(v) => update({ ...draft, titleAr: v })}
        name="titleAr"
        error={errors.titleAr}
      />
      <TextAreaField
        label="النص التعريفي"
        value={draft.ledeAr}
        onChange={(v) => update({ ...draft, ledeAr: v })}
        name="ledeAr"
        error={errors.ledeAr}
        rows={3}
      />
    </SectionForm>
  );
}
