/**
 * Edits `home_map` — the corridor map and asset table. The four areas are fixed,
 * named fields: their position on the coast is real geography
 * (`src/scripts/corridor-map.js`), not something an admin can reorder or extend.
 * `hubs` is the repeatable asset list; each asset is filed under one of the four
 * areas, which is where the map's popup lists it. The table's 01, 02, … numbers
 * come from the list order.
 */
import { CLUSTER_IDS, type HomeMap, type HomeMapHub } from '../../lib/content/schemas/home-map.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { ItemList } from './ItemList.tsx';
import { BilingualTextField, BilingualTextAreaField } from './fields/BilingualFields.tsx';

const clusterLabels: Record<keyof HomeMap['clusters'], string> = {
  rabigh: 'رابغ',
  kaec: 'مدينة الملك عبدالله',
  thuwal: 'ثول',
  jeddah: 'جدة',
};

export default function MapEditor({ initial }: { initial: HomeMap }) {
  const title = 'خريطة الممر وجدول الأصول';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_map',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede="مواقع المناطق الأربع على الساحل ثابتة؛ تحرير أسمائها فقط. يظهر كل أصل في جدول الأصول وفي نافذة المنطقة التي يتبعها على الخريطة، ويُرقَّم تلقائيًا حسب ترتيب القائمة. القسم نفسه يظهر في الصفحة الرئيسية وفي صفحة الممر."
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

      <BilingualTextField
        label="نص زر «استعرض الممر»"
        value={draft.ctaLabelAr}
        onChange={(v) => update({ ...draft, ctaLabelAr: v })}
        name="ctaLabelAr"
        error={errors.ctaLabelAr}
        valueEn={draft.ctaLabelEn}
        onChangeEn={(v) => update({ ...draft, ctaLabelEn: v })}
        errorEn={errors.ctaLabelEn}
      />

      {(Object.keys(clusterLabels) as Array<keyof HomeMap['clusters']>).map((clusterId) => (
        <div key={clusterId}>
          <BilingualTextField
            label={`المنطقة — ${clusterLabels[clusterId]} — الاسم`}
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
        </div>
      ))}

      <ItemList<HomeMapHub>
        items={draft.hubs}
        onChange={(hubs) => update({ ...draft, hubs })}
        makeItem={(id) => ({ id, clusterId: 'rabigh', nameAr: 'اسم الأصل', nameEn: '', descriptionAr: 'وصف الأصل.', descriptionEn: '' })}
        idPrefix="hub"
        min={1}
        max={12}
        labelFor={(_, i) => `الأصل ${i + 1}`}
        addLabel="إضافة أصل"
      >
        {(hub, i, patch) => (
          <>
            <div className="form__field">
              <label className="form__label" htmlFor={`hub-cluster-${hub.id}`}>
                المنطقة
              </label>
              <select
                id={`hub-cluster-${hub.id}`}
                value={hub.clusterId}
                onChange={(e) => patch({ clusterId: e.target.value as HomeMapHub['clusterId'] })}
              >
                {CLUSTER_IDS.map((id) => (
                  <option key={id} value={id}>
                    {clusterLabels[id]}
                  </option>
                ))}
              </select>
              {errors[`hubs.${i}.clusterId`] && <p className="form__message">{errors[`hubs.${i}.clusterId`]}</p>}
            </div>
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
