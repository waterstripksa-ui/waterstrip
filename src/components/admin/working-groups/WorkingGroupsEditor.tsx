/**
 * Edits the whole working-group collection (ported from
 * waterstrip/assets/js/wg-data.js) as one bulk save. See
 * useCollectionEditor.ts for why this does not reuse the singleton editor
 * machinery, and repo.ts's `replaceWorkingGroups` for why one PUT of the full
 * array is fine at this scale.
 *
 * `id` fields exist only for ItemList's React-key bookkeeping and never reach
 * the server — the real identifier is `slug`, which is why it is an editable
 * field here rather than fixed at creation like about-challenges' item ids.
 */
import { useState } from 'react';
import { useCollectionEditor } from '../useCollectionEditor.ts';
import { ItemList } from '../ItemList.tsx';
import { BilingualTextField, BilingualTextAreaField } from '../fields/BilingualFields.tsx';
import { TextField } from '../fields/TextField.tsx';
import { CheckboxField } from '../fields/CheckboxField.tsx';
import type { WorkingGroup } from '../../../lib/content/cache.ts';
import { CHALLENGE_LABELS_AR } from '../../../lib/wg-visuals.ts';

interface StatRow {
  id: string;
  n: string;
  labelAr: string;
  labelEn: string;
}

interface RecRow {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
}

interface GroupRow {
  id: string;
  slug: string;
  no: string;
  challenge: 'supply' | 'treat' | 'reuse' | 'smart';
  nameAr: string;
  nameEn: string;
  statusAr: string;
  statusEn: string;
  leadAr: string;
  leadEn: string;
  headAr: string;
  headEn: string;
  orgsAr: string;
  orgsEn: string;
  scopeAr: string;
  scopeEn: string;
  stats: StatRow[];
  recs: RecRow[];
  noteAr: string;
  noteEn: string;
  src: string;
  order: number;
  published: boolean;
}

function fromRow(row: WorkingGroup, i: number): GroupRow {
  return {
    id: row.slug,
    slug: row.slug,
    no: row.no,
    challenge: row.challenge as GroupRow['challenge'],
    nameAr: row.nameAr,
    nameEn: row.nameEn,
    statusAr: row.statusAr,
    statusEn: row.statusEn,
    leadAr: row.leadAr,
    leadEn: row.leadEn,
    headAr: row.headAr,
    headEn: row.headEn,
    orgsAr: row.orgsAr,
    orgsEn: row.orgsEn,
    scopeAr: row.scopeAr,
    scopeEn: row.scopeEn,
    stats: row.stats.map((s, j) => ({ id: `${row.slug}-stat-${j}`, ...s, labelEn: s.labelEn ?? '' })),
    recs: row.recs.map((r, j) => ({
      id: `${row.slug}-rec-${j}`,
      ...r,
      titleEn: r.titleEn ?? '',
      bodyEn: r.bodyEn ?? '',
    })),
    noteAr: row.noteAr,
    noteEn: row.noteEn,
    src: row.src,
    order: row.order ?? i * 10,
    published: row.published,
  };
}

function toPayload(rows: GroupRow[]) {
  return rows.map(({ id: _id, stats, recs, ...rest }) => ({
    ...rest,
    stats: stats.map(({ id: _sid, ...s }) => s),
    recs: recs.map(({ id: _rid, ...r }) => r),
  }));
}

const CHALLENGES: GroupRow['challenge'][] = ['supply', 'treat', 'reuse', 'smart'];

export default function WorkingGroupsEditor({ initial }: { initial: WorkingGroup[] }) {
  const [open, setOpen] = useState(false);
  const { draft, update, dirty, status, message, errors, save, reset } = useCollectionEditor<
    GroupRow[]
  >(
    '/admin/api/working-groups',
    initial.map(fromRow),
    toPayload,
    'working-groups',
    'مجموعات العمل',
  );

  const statusText: Record<string, string> = {
    idle: '',
    saving: 'جارٍ الحفظ…',
    saved: 'تم الحفظ.',
    error: '',
  };

  return (
    <section className={`panel${open ? '' : ' panel--collapsed'}`}>
      <h2 className="panel__title">
        <button
          className="panel__toggle"
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="panel__toggle-icon" aria-hidden="true">
            <svg fill="none" stroke="currentColor" strokeWidth="2" height="12" width="12" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </span>
          <span className="panel__toggle-label">مجموعات العمل</span>
          {dirty && <span className="panel__badge">تغييرات غير محفوظة</span>}
          {status === 'error' && <span className="panel__badge panel__badge--error">تعذّر الحفظ</span>}
        </button>
      </h2>

      <div className="panel__body" hidden={!open}>
        <p className="form__hint">
          كل مجموعة تظهر كبطاقة في صفحة "مجموعات العمل" وصفحة تفصيلية بمسارها الخاص. المعرّف
          (slug) يحدّد رابط الصفحة التفصيلية، ويجب أن يبقى فريدًا.
        </p>

        {message && (
          <p className="form__error" role="alert">
            <span className="form__error-icon" aria-hidden="true">
              !
            </span>
            <span>{message}</span>
          </p>
        )}

        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <ItemList<GroupRow>
            items={draft}
            onChange={(items) => update(items)}
            makeItem={(id) => ({
              id,
              slug: id,
              no: String(draft.length + 1).padStart(2, '0'),
              challenge: 'supply',
              nameAr: 'مجموعة عمل جديدة',
              nameEn: '',
              statusAr: '',
              statusEn: '',
              leadAr: '',
              leadEn: '',
              headAr: 'غير متوفر',
              headEn: '',
              orgsAr: 'غير متوفر',
              orgsEn: '',
              scopeAr: '',
              scopeEn: '',
              stats: [],
              recs: [],
              noteAr: '',
              noteEn: '',
              src: '',
              order: draft.length * 10,
              published: true,
            })}
            idPrefix="wg"
            min={0}
            max={24}
            labelFor={(item) => item.nameAr || item.slug}
            addLabel="إضافة مجموعة عمل"
          >
            {(item, i, patch) => (
              <>
                <TextField
                  label="المعرّف (slug)"
                  value={item.slug}
                  onChange={(v) => patch({ slug: v })}
                  name={`${i}.slug`}
                  error={errors[`${i}.slug`]}
                  hint="حروف لاتينية صغيرة وأرقام وشرطات فقط، مثل flood-platform."
                  ltr
                />
                <TextField
                  label="الرقم التسلسلي"
                  value={item.no}
                  onChange={(v) => patch({ no: v })}
                  name={`${i}.no`}
                  error={errors[`${i}.no`]}
                  ltr
                />

                <div className="form__field">
                  <label className="form__label" htmlFor={`challenge-${item.id}`}>
                    التحدّي
                  </label>
                  <select
                    id={`challenge-${item.id}`}
                    value={item.challenge}
                    onChange={(e) => patch({ challenge: e.target.value as GroupRow['challenge'] })}
                  >
                    {CHALLENGES.map((c) => (
                      <option key={c} value={c}>
                        {CHALLENGE_LABELS_AR[c]}
                      </option>
                    ))}
                  </select>
                  {errors[`${i}.challenge`] && (
                    <p className="form__message">{errors[`${i}.challenge`]}</p>
                  )}
                </div>

                <BilingualTextField
                  label="اسم المجموعة"
                  value={item.nameAr}
                  onChange={(v) => patch({ nameAr: v })}
                  name={`${i}.nameAr`}
                  error={errors[`${i}.nameAr`]}
                  valueEn={item.nameEn}
                  onChangeEn={(v) => patch({ nameEn: v })}
                  errorEn={errors[`${i}.nameEn`]}
                />
                <BilingualTextField
                  label="الحالة (اختياري)"
                  value={item.statusAr}
                  onChange={(v) => patch({ statusAr: v })}
                  name={`${i}.statusAr`}
                  error={errors[`${i}.statusAr`]}
                  valueEn={item.statusEn}
                  onChangeEn={(v) => patch({ statusEn: v })}
                  errorEn={errors[`${i}.statusEn`]}
                />
                <BilingualTextAreaField
                  label="نطاق العمل"
                  value={item.scopeAr}
                  onChange={(v) => patch({ scopeAr: v })}
                  name={`${i}.scopeAr`}
                  error={errors[`${i}.scopeAr`]}
                  rows={2}
                  valueEn={item.scopeEn}
                  onChangeEn={(v) => patch({ scopeEn: v })}
                  errorEn={errors[`${i}.scopeEn`]}
                />
                <BilingualTextField
                  label="قائد المجموعة"
                  value={item.headAr}
                  onChange={(v) => patch({ headAr: v })}
                  name={`${i}.headAr`}
                  error={errors[`${i}.headAr`]}
                  valueEn={item.headEn}
                  onChangeEn={(v) => patch({ headEn: v })}
                  errorEn={errors[`${i}.headEn`]}
                />
                <BilingualTextField
                  label="الجهة القائدة"
                  value={item.leadAr}
                  onChange={(v) => patch({ leadAr: v })}
                  name={`${i}.leadAr`}
                  error={errors[`${i}.leadAr`]}
                  valueEn={item.leadEn}
                  onChangeEn={(v) => patch({ leadEn: v })}
                  errorEn={errors[`${i}.leadEn`]}
                />
                <BilingualTextField
                  label="الجهات المشاركة"
                  value={item.orgsAr}
                  onChange={(v) => patch({ orgsAr: v })}
                  name={`${i}.orgsAr`}
                  error={errors[`${i}.orgsAr`]}
                  valueEn={item.orgsEn}
                  onChangeEn={(v) => patch({ orgsEn: v })}
                  errorEn={errors[`${i}.orgsEn`]}
                />
                <BilingualTextAreaField
                  label="ملاحظة (اختياري)"
                  value={item.noteAr}
                  onChange={(v) => patch({ noteAr: v })}
                  name={`${i}.noteAr`}
                  error={errors[`${i}.noteAr`]}
                  rows={2}
                  valueEn={item.noteEn}
                  onChangeEn={(v) => patch({ noteEn: v })}
                  errorEn={errors[`${i}.noteEn`]}
                />
                <TextField
                  label="المصدر"
                  value={item.src}
                  onChange={(v) => patch({ src: v })}
                  name={`${i}.src`}
                  error={errors[`${i}.src`]}
                />
                <CheckboxField
                  label="منشورة على الموقع"
                  value={item.published}
                  onChange={(v) => patch({ published: v })}
                  name={`${i}.published`}
                  error={errors[`${i}.published`]}
                />

                <ItemList<StatRow>
                  items={item.stats}
                  onChange={(stats) => patch({ stats })}
                  makeItem={(id) => ({ id, n: '0', labelAr: 'مؤشر جديد', labelEn: '' })}
                  idPrefix={`${item.id}-stat`}
                  min={0}
                  max={6}
                  labelFor={(stat) => stat.labelAr}
                  addLabel="إضافة مؤشر"
                >
                  {(stat, j, patchStat) => (
                    <>
                      <TextField
                        label="القيمة"
                        value={stat.n}
                        onChange={(v) => patchStat({ n: v })}
                        name={`${i}.stats.${j}.n`}
                        error={errors[`${i}.stats.${j}.n`]}
                        ltr
                      />
                      <BilingualTextField
                        label="الوصف"
                        value={stat.labelAr}
                        onChange={(v) => patchStat({ labelAr: v })}
                        name={`${i}.stats.${j}.labelAr`}
                        error={errors[`${i}.stats.${j}.labelAr`]}
                        valueEn={stat.labelEn}
                        onChangeEn={(v) => patchStat({ labelEn: v })}
                        errorEn={errors[`${i}.stats.${j}.labelEn`]}
                      />
                    </>
                  )}
                </ItemList>

                <ItemList<RecRow>
                  items={item.recs}
                  onChange={(recs) => patch({ recs })}
                  makeItem={(id) => ({ id, titleAr: 'توصية جديدة', titleEn: '', bodyAr: '', bodyEn: '' })}
                  idPrefix={`${item.id}-rec`}
                  min={0}
                  max={12}
                  labelFor={(rec) => rec.titleAr}
                  addLabel="إضافة توصية"
                >
                  {(rec, j, patchRec) => (
                    <>
                      <BilingualTextField
                        label="عنوان التوصية"
                        value={rec.titleAr}
                        onChange={(v) => patchRec({ titleAr: v })}
                        name={`${i}.recs.${j}.titleAr`}
                        error={errors[`${i}.recs.${j}.titleAr`]}
                        valueEn={rec.titleEn}
                        onChangeEn={(v) => patchRec({ titleEn: v })}
                        errorEn={errors[`${i}.recs.${j}.titleEn`]}
                      />
                      <BilingualTextAreaField
                        label="نص التوصية"
                        value={rec.bodyAr}
                        onChange={(v) => patchRec({ bodyAr: v })}
                        name={`${i}.recs.${j}.bodyAr`}
                        error={errors[`${i}.recs.${j}.bodyAr`]}
                        rows={2}
                        valueEn={rec.bodyEn}
                        onChangeEn={(v) => patchRec({ bodyEn: v })}
                        errorEn={errors[`${i}.recs.${j}.bodyEn`]}
                      />
                    </>
                  )}
                </ItemList>
              </>
            )}
          </ItemList>

          <div className="editor__bar">
            <button className="button button--solid" type="submit" disabled={!dirty || status === 'saving'}>
              {status === 'saving' ? 'جارٍ الحفظ…' : 'حفظ'}
            </button>
            <button className="editor__reset" type="button" onClick={reset} disabled={!dirty}>
              تراجع عن التغييرات
            </button>
            <p
              className={`editor__status${status === 'saved' ? ' editor__status--saved' : ''}`}
              role="status"
              aria-live="polite"
            >
              {dirty && status !== 'saving' ? 'تغييرات غير محفوظة' : statusText[status]}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
