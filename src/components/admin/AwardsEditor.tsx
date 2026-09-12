/**
 * Edits `home_awards`. The 01–04 ordinals the public panel prints are derived
 * from list position at render time, so there is no number field here.
 */
import type { HomeAward, HomeAwards } from '../../lib/content/schemas/home-awards.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { ItemList } from './ItemList.tsx';
import { TextField } from './fields/TextField.tsx';
import { TextAreaField } from './fields/TextAreaField.tsx';
import { HrefField } from './fields/HrefField.tsx';

export default function AwardsEditor({ initial }: { initial: HomeAwards }) {
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_awards',
    initial,
  );

  return (
    <SectionForm
      title="الجوائز والتكريم"
      lede="ترقيم الجوائز (٠١، ٠٢ …) يُحسب تلقائيًا من ترتيب القائمة."
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
        rows={3}
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

      <ItemList<HomeAward>
        items={draft.items}
        onChange={(items) => update({ ...draft, items })}
        makeItem={(id) => ({ id, titleAr: 'عنوان الجائزة', bodyAr: 'وصف الجائزة.' })}
        idPrefix="aw"
        min={1}
        max={12}
        labelFor={(_, i) => `الجائزة ${i + 1}`}
        addLabel="إضافة جائزة"
      >
        {(award, i, patch) => (
          <>
            <TextAreaField
              label="العنوان"
              value={award.titleAr}
              onChange={(v) => patch({ titleAr: v })}
              name={`items.${i}.titleAr`}
              error={errors[`items.${i}.titleAr`]}
              rows={2}
            />
            <TextAreaField
              label="الوصف"
              value={award.bodyAr}
              onChange={(v) => patch({ bodyAr: v })}
              name={`items.${i}.bodyAr`}
              error={errors[`items.${i}.bodyAr`]}
              rows={2}
            />
          </>
        )}
      </ItemList>
    </SectionForm>
  );
}
