/**
 * Edits the whole member collection (ported from waterstrip/member.html's
 * inline `WSTRIP_MEMBERS` data) as one bulk save — see useCollectionEditor.ts
 * and repo.ts's `replaceMembers`.
 *
 * `id` exists only for ItemList's React-key bookkeeping and never reaches the
 * server — the real identifier is `slug`, same reasoning as
 * WorkingGroupsEditor.tsx. `logoId` is a plain media reference like
 * `article.imageId` — see ArticlesEditor.tsx's note on why it uses ImageField
 * directly rather than `collectMediaIds`.
 */
import { useState } from 'react';
import { useCollectionEditor } from '../useCollectionEditor.ts';
import { ItemList } from '../ItemList.tsx';
import { BilingualTextField, BilingualTextAreaField } from '../fields/BilingualFields.tsx';
import { TextField } from '../fields/TextField.tsx';
import { CheckboxField } from '../fields/CheckboxField.tsx';
import { ImageField } from '../fields/ImageField.tsx';
import type { Member, MediaView } from '../../../lib/content/cache.ts';

interface MemberRow {
  id: string;
  slug: string;
  categoryAr: string;
  categoryEn: string;
  nameAr: string;
  nameEn: string;
  logoId: string | null;
  roleAr: string;
  roleEn: string;
  sectorAr: string;
  sectorEn: string;
  sinceAr: string;
  sinceEn: string;
  bioAr: string;
  bioEn: string;
  order: number;
  published: boolean;
}

function fromRow(row: Member, i: number): MemberRow {
  return {
    id: row.slug,
    slug: row.slug,
    categoryAr: row.categoryAr,
    categoryEn: row.categoryEn,
    nameAr: row.nameAr,
    nameEn: row.nameEn,
    logoId: row.logoId,
    roleAr: row.roleAr,
    roleEn: row.roleEn,
    sectorAr: row.sectorAr,
    sectorEn: row.sectorEn,
    sinceAr: row.sinceAr,
    sinceEn: row.sinceEn,
    bioAr: row.bioAr,
    bioEn: row.bioEn,
    order: row.order ?? i * 10,
    published: row.published,
  };
}

function toPayload(rows: MemberRow[]) {
  return rows.map(({ id: _id, ...rest }) => rest);
}

interface Props {
  initial: Member[];
  media: Record<string, MediaView>;
}

export default function MembersEditor({ initial, media }: Props) {
  const [open, setOpen] = useState(false);
  const { draft, update, dirty, status, message, errors, save, reset } = useCollectionEditor<
    MemberRow[]
  >(
    '/admin/api/members',
    initial.map(fromRow),
    toPayload,
    'members',
    'الأعضاء',
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
          <span className="panel__toggle-label">الأعضاء</span>
          {dirty && <span className="panel__badge">تغييرات غير محفوظة</span>}
          {status === 'error' && <span className="panel__badge panel__badge--error">تعذّر الحفظ</span>}
        </button>
      </h2>

      <div className="panel__body" hidden={!open}>
        <p className="form__hint">
          كل عضو يظهر كبطاقة في صفحة "الأعضاء" وصفحة تفصيلية بمساره الخاص. المعرّف (slug) يحدّد
          رابط الصفحة التفصيلية، ويجب أن يبقى فريدًا. الحقول غير المتوفرة في السجل تُكتب «غير
          متوفر» بدل تركها فارغة.
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
          <ItemList<MemberRow>
            items={draft}
            onChange={(items) => update(items)}
            makeItem={(id) => ({
              id,
              slug: id,
              categoryAr: 'حكومي',
              categoryEn: '',
              nameAr: 'جهة جديدة',
              nameEn: '',
              logoId: null,
              roleAr: 'عضو',
              roleEn: '',
              sectorAr: 'غير متوفر',
              sectorEn: '',
              sinceAr: 'غير متوفر',
              sinceEn: '',
              bioAr: 'غير متوفر',
              bioEn: '',
              order: draft.length * 10,
              published: true,
            })}
            idPrefix="mem"
            min={0}
            max={80}
            labelFor={(item) => item.nameAr || item.slug}
            addLabel="إضافة عضو"
          >
            {(item, i, patch) => (
              <>
                <TextField
                  label="المعرّف (slug)"
                  value={item.slug}
                  onChange={(v) => patch({ slug: v })}
                  name={`${i}.slug`}
                  error={errors[`${i}.slug`]}
                  hint="حروف لاتينية صغيرة وأرقام وشرطات فقط، مثل nwc."
                  ltr
                />
                <BilingualTextField
                  label="التصنيف"
                  value={item.categoryAr}
                  onChange={(v) => patch({ categoryAr: v })}
                  name={`${i}.categoryAr`}
                  error={errors[`${i}.categoryAr`]}
                  hint="مثل حكومي، قطاع عام، أكاديمي، قطاع خاص، دولي."
                  valueEn={item.categoryEn}
                  onChangeEn={(v) => patch({ categoryEn: v })}
                  errorEn={errors[`${i}.categoryEn`]}
                />
                <BilingualTextField
                  label="اسم الجهة"
                  value={item.nameAr}
                  onChange={(v) => patch({ nameAr: v })}
                  name={`${i}.nameAr`}
                  error={errors[`${i}.nameAr`]}
                  valueEn={item.nameEn}
                  onChangeEn={(v) => patch({ nameEn: v })}
                  errorEn={errors[`${i}.nameEn`]}
                />

                <ImageField
                  label="شعار الجهة"
                  value={item.logoId}
                  onChange={(v) => patch({ logoId: v })}
                  name={`${i}.logoId`}
                  error={errors[`${i}.logoId`]}
                  defaultAlt={item.nameAr}
                  known={media}
                  variant="logo"
                />

                <BilingualTextField
                  label="الدور في الشريط"
                  value={item.roleAr}
                  onChange={(v) => patch({ roleAr: v })}
                  name={`${i}.roleAr`}
                  error={errors[`${i}.roleAr`]}
                  valueEn={item.roleEn}
                  onChangeEn={(v) => patch({ roleEn: v })}
                  errorEn={errors[`${i}.roleEn`]}
                />
                <BilingualTextField
                  label="مجال التركيز"
                  value={item.sectorAr}
                  onChange={(v) => patch({ sectorAr: v })}
                  name={`${i}.sectorAr`}
                  error={errors[`${i}.sectorAr`]}
                  valueEn={item.sectorEn}
                  onChangeEn={(v) => patch({ sectorEn: v })}
                  errorEn={errors[`${i}.sectorEn`]}
                />
                <BilingualTextField
                  label="عضو منذ"
                  value={item.sinceAr}
                  onChange={(v) => patch({ sinceAr: v })}
                  name={`${i}.sinceAr`}
                  error={errors[`${i}.sinceAr`]}
                  valueEn={item.sinceEn}
                  onChangeEn={(v) => patch({ sinceEn: v })}
                  errorEn={errors[`${i}.sinceEn`]}
                />
                <BilingualTextAreaField
                  label="نبذة"
                  value={item.bioAr}
                  onChange={(v) => patch({ bioAr: v })}
                  name={`${i}.bioAr`}
                  error={errors[`${i}.bioAr`]}
                  rows={3}
                  valueEn={item.bioEn}
                  onChangeEn={(v) => patch({ bioEn: v })}
                  errorEn={errors[`${i}.bioEn`]}
                />

                <CheckboxField
                  label="منشور على الموقع"
                  value={item.published}
                  onChange={(v) => patch({ published: v })}
                  name={`${i}.published`}
                  error={errors[`${i}.published`]}
                />
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
