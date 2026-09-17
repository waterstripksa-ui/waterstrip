/**
 * Edits `home_hero`. A slide with no uploaded background shows its placeholder
 * artwork from src/lib/home-assets.ts.
 */
import type { HomeHero, HomeHeroPanel } from '../../lib/content/schemas/home-hero.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { ItemList } from './ItemList.tsx';
import { BilingualTextField, BilingualTextAreaField } from './fields/BilingualFields.tsx';
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
  const title = 'الواجهة الرئيسية';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_hero',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
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
          eyebrowEn: '',
          headingAr: 'عنوان الشريحة',
          headingEn: '',
          ctaLabelAr: 'اعرف المزيد',
          ctaLabelEn: '',
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
            <BilingualTextField
              label="العنوان الفرعي (ويظهر أيضًا في التبويب)"
              value={panel.eyebrowAr}
              onChange={(v) => patch({ eyebrowAr: v })}
              name={`panels.${i}.eyebrowAr`}
              error={errors[`panels.${i}.eyebrowAr`]}
              valueEn={panel.eyebrowEn}
              onChangeEn={(v) => patch({ eyebrowEn: v })}
              errorEn={errors[`panels.${i}.eyebrowEn`]}
            />
            <BilingualTextAreaField
              label="العنوان"
              value={panel.headingAr}
              onChange={(v) => patch({ headingAr: v })}
              name={`panels.${i}.headingAr`}
              error={errors[`panels.${i}.headingAr`]}
              hint={i === 0 ? 'هذا هو العنوان الرئيسي (h1) للصفحة.' : undefined}
              valueEn={panel.headingEn}
              onChangeEn={(v) => patch({ headingEn: v })}
              errorEn={errors[`panels.${i}.headingEn`]}
            />
            <BilingualTextField
              label="نص الزر"
              value={panel.ctaLabelAr}
              onChange={(v) => patch({ ctaLabelAr: v })}
              name={`panels.${i}.ctaLabelAr`}
              error={errors[`panels.${i}.ctaLabelAr`]}
              valueEn={panel.ctaLabelEn}
              onChangeEn={(v) => patch({ ctaLabelEn: v })}
              errorEn={errors[`panels.${i}.ctaLabelEn`]}
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
