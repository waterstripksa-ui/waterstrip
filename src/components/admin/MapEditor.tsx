/**
 * Edits `home_map`. The four clusters are fixed, named fields — their position
 * on the coastline is real geography, not something an admin can reorder — while
 * `hubs` is a repeatable list whose dot on the map comes from its position in
 * the list (`MAP_HUB_SLOTS` in `src/pages/index.astro`), the same way an award's
 * ordinal is derived rather than stored.
 */
import type { HomeMap, HomeMapHub } from '../../lib/content/schemas/home-map.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { ItemList } from './ItemList.tsx';
import { BilingualTextField, BilingualTextAreaField } from './fields/BilingualFields.tsx';

const clusterLabels: Record<keyof HomeMap['clusters'], string> = {
  rabigh: 'رابغ',
  kaec: 'مدينة الملك عبدالله الاقتصادية',
  thuwal: 'ثول',
  jeddah: 'جدة',
};

export default function MapEditor({ initial }: { initial: HomeMap }) {
  const title = 'خريطة أصول الشريط';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_map',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede="مواقع النقاط الأربع على الساحل ثابتة؛ تحرير نصوصها فقط. ترقيم الأصول (١، ٢ …) ونقطتها على الخريطة تُحسبان تلقائيًا من ترتيب القائمة."
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

      {(Object.keys(clusterLabels) as Array<keyof HomeMap['clusters']>).map((clusterId) => (
        <div key={clusterId}>
          <BilingualTextField
            label={`نقطة الخريطة — ${clusterLabels[clusterId]} — الاسم`}
            value={draft.clusters[clusterId].nameAr}
            onChange={(v) =>
              update({ ...draft, clusters: { ...draft.clusters, [clusterId]: { ...draft.clusters[clusterId], nameAr: v } } })
            }
            name={`clusters.${clusterId}.nameAr`}
            error={errors[`clusters.${clusterId}.nameAr`]}
            valueEn={draft.clusters[clusterId].nameEn}
            onChangeEn={(v) =>
              update({ ...draft, clusters: { ...draft.clusters, [clusterId]: { ...draft.clusters[clusterId], nameEn: v } } })
            }
            errorEn={errors[`clusters.${clusterId}.nameEn`]}
          />
          <BilingualTextField
            label={`نقطة الخريطة — ${clusterLabels[clusterId]} — الوصف الفرعي`}
            value={draft.clusters[clusterId].taglineAr}
            onChange={(v) =>
              update({
                ...draft,
                clusters: { ...draft.clusters, [clusterId]: { ...draft.clusters[clusterId], taglineAr: v } },
              })
            }
            name={`clusters.${clusterId}.taglineAr`}
            error={errors[`clusters.${clusterId}.taglineAr`]}
            valueEn={draft.clusters[clusterId].taglineEn}
            onChangeEn={(v) =>
              update({
                ...draft,
                clusters: { ...draft.clusters, [clusterId]: { ...draft.clusters[clusterId], taglineEn: v } },
              })
            }
            errorEn={errors[`clusters.${clusterId}.taglineEn`]}
          />
        </div>
      ))}

      <ItemList<HomeMapHub>
        items={draft.hubs}
        onChange={(hubs) => update({ ...draft, hubs })}
        makeItem={(id) => ({ id, nameAr: 'اسم الأصل', nameEn: '', descriptionAr: 'وصف الأصل.', descriptionEn: '' })}
        idPrefix="hub"
        min={1}
        max={8}
        labelFor={(_, i) => `الأصل ${i + 1}`}
        addLabel="إضافة أصل"
      >
        {(hub, i, patch) => (
          <>
            <BilingualTextField
              label="الاسم"
              value={hub.nameAr}
              onChange={(v) => patch({ nameAr: v })}
              name={`hubs.${i}.nameAr`}
              error={errors[`hubs.${i}.nameAr`]}
              valueEn={hub.nameEn}
              onChangeEn={(v) => patch({ nameEn: v })}
              errorEn={errors[`hubs.${i}.nameEn`]}
            />
            <BilingualTextAreaField
              label="الوصف"
              value={hub.descriptionAr}
              onChange={(v) => patch({ descriptionAr: v })}
              name={`hubs.${i}.descriptionAr`}
              error={errors[`hubs.${i}.descriptionAr`]}
              rows={2}
              valueEn={hub.descriptionEn}
              onChangeEn={(v) => patch({ descriptionEn: v })}
              errorEn={errors[`hubs.${i}.descriptionEn`]}
            />
          </>
        )}
      </ItemList>
    </SectionForm>
  );
}
