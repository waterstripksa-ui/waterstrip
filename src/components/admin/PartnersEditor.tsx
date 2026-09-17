/**
 * Edits `home_partners`. A partner with no uploaded logo shows the shared
 * Water STRIP mark.
 */
import type { HomePartner, HomePartners } from '../../lib/content/schemas/home-partners.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { ItemList } from './ItemList.tsx';
import { BilingualTextField } from './fields/BilingualFields.tsx';
import { HrefField } from './fields/HrefField.tsx';
import { ImageField } from './fields/ImageField.tsx';
import type { MediaView } from '../../lib/content/cache.ts';

export default function PartnersEditor({
  initial,
  media,
}: {
  initial: HomePartners;
  media: Record<string, MediaView>;
}) {
  const title = 'الجهات الاستراتيجية';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_partners',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede="أسماء الجهات وروابطها وشعاراتها. الجهة التي لا شعار لها تظهر بشعار الشريط."
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
      <BilingualTextField
        label="عنوان الشريط"
        value={draft.labelAr}
        onChange={(v) => update({ ...draft, labelAr: v })}
        name="labelAr"
        error={errors.labelAr}
        valueEn={draft.labelEn}
        onChangeEn={(v) => update({ ...draft, labelEn: v })}
        errorEn={errors.labelEn}
      />
      <BilingualTextField
        label="الملاحظة أسفل الشريط"
        value={draft.noteAr}
        onChange={(v) => update({ ...draft, noteAr: v })}
        name="noteAr"
        error={errors.noteAr}
        valueEn={draft.noteEn}
        onChangeEn={(v) => update({ ...draft, noteEn: v })}
        errorEn={errors.noteEn}
      />

      <ItemList<HomePartner>
        items={draft.items}
        onChange={(items) => update({ ...draft, items })}
        makeItem={(id) => ({ id, nameAr: 'اسم الجهة', nameEn: '', href: '#', logoId: null })}
        idPrefix="pa"
        min={1}
        max={20}
        labelFor={(partner) => partner.nameAr || 'جهة'}
        addLabel="إضافة جهة"
      >
        {(partner, i, patch) => (
          <>
            <BilingualTextField
              label="الاسم"
              value={partner.nameAr}
              onChange={(v) => patch({ nameAr: v })}
              name={`items.${i}.nameAr`}
              error={errors[`items.${i}.nameAr`]}
              valueEn={partner.nameEn}
              onChangeEn={(v) => patch({ nameEn: v })}
              errorEn={errors[`items.${i}.nameEn`]}
            />
            <HrefField
              value={partner.href}
              onChange={(v) => patch({ href: v })}
              name={`items.${i}.href`}
              error={errors[`items.${i}.href`]}
            />
            <ImageField
              label="الشعار"
              value={partner.logoId}
              onChange={(v) => patch({ logoId: v })}
              name={`items.${i}.logoId`}
              error={errors[`items.${i}.logoId`]}
              hint="يُفضَّل PNG بخلفية شفافة. يُعرض داخل مساحة 150×75 بكسل دون قص."
              defaultAlt={`شعار ${partner.nameAr}`}
              known={media}
              variant="logo"
            />
          </>
        )}
      </ItemList>
    </SectionForm>
  );
}
