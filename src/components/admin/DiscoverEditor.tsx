/** Edits `home_discover` — the intro and the two tile cards under it. */
import type { HomeDiscover, HomeDiscoverTile } from '../../lib/content/schemas/home-discover.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { ItemList } from './ItemList.tsx';
import { BilingualTextField, BilingualTextAreaField } from './fields/BilingualFields.tsx';
import { HrefField } from './fields/HrefField.tsx';
import { ImageField } from './fields/ImageField.tsx';
import type { MediaView } from '../../lib/content/cache.ts';

export default function DiscoverEditor({
  initial,
  media,
}: {
  initial: HomeDiscover;
  media: Record<string, MediaView>;
}) {
  const title = 'تعرّف على الشريط';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_discover',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede="النص التعريفي والبطاقات أسفله."
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

      <ItemList<HomeDiscoverTile>
        items={draft.tiles}
        onChange={(tiles) => update({ ...draft, tiles })}
        makeItem={(id) => ({
          id,
          eyebrowAr: 'عنوان فرعي',
          eyebrowEn: '',
          headingAr: 'عنوان البطاقة',
          headingEn: '',
          href: '#',
          imageId: null,
        })}
        idPrefix="tile"
        min={1}
        max={4}
        labelFor={(_, i) => `البطاقة ${i + 1}`}
        addLabel="إضافة بطاقة"
      >
        {(tile, i, patch) => (
          <>
            <BilingualTextField
              label="العنوان الفرعي"
              value={tile.eyebrowAr}
              onChange={(v) => patch({ eyebrowAr: v })}
              name={`tiles.${i}.eyebrowAr`}
              error={errors[`tiles.${i}.eyebrowAr`]}
              valueEn={tile.eyebrowEn}
              onChangeEn={(v) => patch({ eyebrowEn: v })}
              errorEn={errors[`tiles.${i}.eyebrowEn`]}
            />
            <BilingualTextAreaField
              label="العنوان"
              value={tile.headingAr}
              onChange={(v) => patch({ headingAr: v })}
              name={`tiles.${i}.headingAr`}
              error={errors[`tiles.${i}.headingAr`]}
              valueEn={tile.headingEn}
              onChangeEn={(v) => patch({ headingEn: v })}
              errorEn={errors[`tiles.${i}.headingEn`]}
            />
            <HrefField
              value={tile.href}
              onChange={(v) => patch({ href: v })}
              name={`tiles.${i}.href`}
              error={errors[`tiles.${i}.href`]}
            />
            <ImageField
              label="صورة البطاقة"
              value={tile.imageId}
              onChange={(v) => patch({ imageId: v })}
              name={`tiles.${i}.imageId`}
              error={errors[`tiles.${i}.imageId`]}
              hint="صورة عمودية تقريبًا (نحو 720×840 بكسل)، ويظهر النص فوق أسفلها."
              defaultAlt={tile.headingAr}
              known={media}
            />
          </>
        )}
      </ItemList>
    </SectionForm>
  );
}
