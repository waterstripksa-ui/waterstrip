/**
 * Edits `home_partners`. Logos are not editable here — every partner shows the
 * shared mark until real logos are supplied in src/lib/home-assets.ts.
 */
import type { HomePartner, HomePartners } from '../../lib/content/schemas/home-partners.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { ItemList } from './ItemList.tsx';
import { TextField } from './fields/TextField.tsx';
import { HrefField } from './fields/HrefField.tsx';

export default function PartnersEditor({ initial }: { initial: HomePartners }) {
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_partners',
    initial,
  );

  return (
    <SectionForm
      title="الجهات الاستراتيجية"
      lede="أسماء الجهات وروابطها. الشعارات ثابتة وتُحدَّد برمجيًا."
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
      <TextField
        label="عنوان الشريط"
        value={draft.labelAr}
        onChange={(v) => update({ ...draft, labelAr: v })}
        name="labelAr"
        error={errors.labelAr}
      />
      <TextField
        label="الملاحظة أسفل الشريط"
        value={draft.noteAr}
        onChange={(v) => update({ ...draft, noteAr: v })}
        name="noteAr"
        error={errors.noteAr}
      />

      <ItemList<HomePartner>
        items={draft.items}
        onChange={(items) => update({ ...draft, items })}
        makeItem={(id) => ({ id, nameAr: 'اسم الجهة', href: '#' })}
        idPrefix="pa"
        min={1}
        max={20}
        labelFor={(partner) => partner.nameAr || 'جهة'}
        addLabel="إضافة جهة"
      >
        {(partner, i, patch) => (
          <>
            <TextField
              label="الاسم"
              value={partner.nameAr}
              onChange={(v) => patch({ nameAr: v })}
              name={`items.${i}.nameAr`}
              error={errors[`items.${i}.nameAr`]}
            />
            <HrefField
              value={partner.href}
              onChange={(v) => patch({ href: v })}
              name={`items.${i}.href`}
              error={errors[`items.${i}.href`]}
            />
          </>
        )}
      </ItemList>
    </SectionForm>
  );
}
