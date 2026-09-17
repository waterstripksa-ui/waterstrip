/**
 * Edits `home_awards`. The 01–04 ordinals the public panel prints are derived
 * from list position at render time, so there is no number field here.
 */
import type { HomeAward, HomeAwards } from '../../lib/content/schemas/home-awards.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { ItemList } from './ItemList.tsx';
import { BilingualTextField, BilingualTextAreaField } from './fields/BilingualFields.tsx';
import { HrefField } from './fields/HrefField.tsx';
import { CheckboxField } from './fields/CheckboxField.tsx';

export default function AwardsEditor({ initial }: { initial: HomeAwards }) {
  const title = 'الجوائز والتكريم';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_awards',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede="ترقيم الجوائز (٠١، ٠٢ …) يُحسب تلقائيًا من ترتيب القائمة."
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
      <CheckboxField
        label="إخفاء القسم من الصفحة الرئيسية"
        value={draft.hidden}
        onChange={(v) => update({ ...draft, hidden: v })}
        name="hidden"
        error={errors.hidden}
      />
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
        rows={3}
        valueEn={draft.ledeEn}
        onChangeEn={(v) => update({ ...draft, ledeEn: v })}
        errorEn={errors.ledeEn}
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
        value={draft.ctaHref}
        onChange={(v) => update({ ...draft, ctaHref: v })}
        name="ctaHref"
        error={errors.ctaHref}
      />

      <ItemList<HomeAward>
        items={draft.items}
        onChange={(items) => update({ ...draft, items })}
        makeItem={(id) => ({ id, titleAr: 'عنوان الجائزة', titleEn: '', bodyAr: 'وصف الجائزة.', bodyEn: '' })}
        idPrefix="aw"
        min={1}
        max={12}
        labelFor={(_, i) => `الجائزة ${i + 1}`}
        addLabel="إضافة جائزة"
      >
        {(award, i, patch) => (
          <>
            <BilingualTextAreaField
              label="العنوان"
              value={award.titleAr}
              onChange={(v) => patch({ titleAr: v })}
              name={`items.${i}.titleAr`}
              error={errors[`items.${i}.titleAr`]}
              rows={2}
              valueEn={award.titleEn}
              onChangeEn={(v) => patch({ titleEn: v })}
              errorEn={errors[`items.${i}.titleEn`]}
            />
            <BilingualTextAreaField
              label="الوصف"
              value={award.bodyAr}
              onChange={(v) => patch({ bodyAr: v })}
              name={`items.${i}.bodyAr`}
              error={errors[`items.${i}.bodyAr`]}
              rows={2}
              valueEn={award.bodyEn}
              onChangeEn={(v) => patch({ bodyEn: v })}
              errorEn={errors[`items.${i}.bodyEn`]}
            />
          </>
        )}
      </ItemList>
    </SectionForm>
  );
}
