/**
 * Edits `home_hero`. A slide with no uploaded background shows its placeholder
 * artwork from src/lib/home-assets.ts.
 */
import type { HomeHero, HomeHeroPanel } from '../../lib/content/schemas/home-hero.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { ItemList } from './ItemList.tsx';
import { TextField } from './fields/TextField.tsx';
import { TextAreaField } from './fields/TextAreaField.tsx';
import { HrefField } from './fields/HrefField.tsx';
import { ImageField } from './fields/ImageField.tsx';
import type { MediaView } from '../../lib/content/cache.ts';

export default function HeroEditor({
  initial,
  media,
}: {
  initial: HomeHero;
  media: Record<string, MediaView>;
}) {
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_hero',
    initial,
  );

  return (
    <SectionForm
      title="الواجهة الرئيسية"
      lede="شرائح الواجهة المتعاقبة. عنوان الشريحة الأولى هو عنوان الصفحة الرئيسي."
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
      <ItemList<HomeHeroPanel>
        items={draft.panels}
        onChange={(panels) => update({ ...draft, panels })}
        makeItem={(id) => ({
          id,
          eyebrowAr: 'عنوان فرعي',
          headingAr: 'عنوان الشريحة',
          ctaLabelAr: 'اعرف المزيد',
          ctaHref: '#',
          imageId: null,
        })}
        idPrefix="hero"
        min={1}
        max={6}
        labelFor={(_, i) => `الشريحة ${i + 1}`}
        addLabel="إضافة شريحة"
      >
        {(panel, i, patch) => (
          <>
            <TextField
              label="العنوان الفرعي (ويظهر أيضًا في التبويب)"
              value={panel.eyebrowAr}
              onChange={(v) => patch({ eyebrowAr: v })}
              name={`panels.${i}.eyebrowAr`}
              error={errors[`panels.${i}.eyebrowAr`]}
            />
            <TextAreaField
              label="العنوان"
              value={panel.headingAr}
              onChange={(v) => patch({ headingAr: v })}
              name={`panels.${i}.headingAr`}
              error={errors[`panels.${i}.headingAr`]}
              hint={i === 0 ? 'هذا هو العنوان الرئيسي (h1) للصفحة.' : undefined}
            />
            <TextField
              label="نص الزر"
              value={panel.ctaLabelAr}
              onChange={(v) => patch({ ctaLabelAr: v })}
              name={`panels.${i}.ctaLabelAr`}
              error={errors[`panels.${i}.ctaLabelAr`]}
            />
            <HrefField
              value={panel.ctaHref}
              onChange={(v) => patch({ ctaHref: v })}
              name={`panels.${i}.ctaHref`}
              error={errors[`panels.${i}.ctaHref`]}
            />
            <ImageField
              label="صورة الخلفية"
              value={panel.imageId}
              onChange={(v) => patch({ imageId: v })}
              name={`panels.${i}.imageId`}
              error={errors[`panels.${i}.imageId`]}
              hint="صورة أفقية عريضة لا يقل عرضها عن 1920 بكسل، ويظهر النص فوقها."
              defaultAlt={panel.headingAr}
              known={media}
            />
          </>
        )}
      </ItemList>
    </SectionForm>
  );
}
