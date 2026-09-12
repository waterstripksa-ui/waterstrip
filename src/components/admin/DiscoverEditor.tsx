/** Edits `home_discover` — the intro and the two tile cards under it. */
import type { HomeDiscover, HomeDiscoverTile } from '../../lib/content/schemas/home-discover.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { ItemList } from './ItemList.tsx';
import { TextField } from './fields/TextField.tsx';
import { TextAreaField } from './fields/TextAreaField.tsx';
import { HrefField } from './fields/HrefField.tsx';

export default function DiscoverEditor({ initial }: { initial: HomeDiscover }) {
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_discover',
    initial,
  );

  return (
    <SectionForm
      title="تعرّف على الشريط"
      lede="النص التعريفي والبطاقات أسفله. صورة كل بطاقة ثابتة وتُحدَّد برمجيًا."
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
      <TextAreaField
        label="النص التعريفي"
        value={draft.headingAr}
        onChange={(v) => update({ ...draft, headingAr: v })}
        name="headingAr"
        error={errors.headingAr}
        rows={4}
      />

      <ItemList<HomeDiscoverTile>
        items={draft.tiles}
        onChange={(tiles) => update({ ...draft, tiles })}
        makeItem={(id) => ({ id, eyebrowAr: 'عنوان فرعي', headingAr: 'عنوان البطاقة', href: '#' })}
        idPrefix="tile"
        min={1}
        max={4}
        labelFor={(_, i) => `البطاقة ${i + 1}`}
        addLabel="إضافة بطاقة"
      >
        {(tile, i, patch) => (
          <>
            <TextField
              label="العنوان الفرعي"
              value={tile.eyebrowAr}
              onChange={(v) => patch({ eyebrowAr: v })}
              name={`tiles.${i}.eyebrowAr`}
              error={errors[`tiles.${i}.eyebrowAr`]}
            />
            <TextAreaField
              label="العنوان"
              value={tile.headingAr}
              onChange={(v) => patch({ headingAr: v })}
              name={`tiles.${i}.headingAr`}
              error={errors[`tiles.${i}.headingAr`]}
            />
            <HrefField
              value={tile.href}
              onChange={(v) => patch({ href: v })}
              name={`tiles.${i}.href`}
              error={errors[`tiles.${i}.href`]}
            />
          </>
        )}
      </ItemList>
    </SectionForm>
  );
}
