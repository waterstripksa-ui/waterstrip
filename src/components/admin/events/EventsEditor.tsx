/**
 * Edits the whole event collection (ported from
 * waterstrip/assets/js/events-data.js) as one bulk save — see
 * useCollectionEditor.ts and repo.ts's `replaceEvents`.
 *
 * `id` exists only for ItemList's React-key bookkeeping and never reaches the
 * server — the real identifier is `slug`, same reasoning as
 * WorkingGroupsEditor.tsx.
 */
import { useState } from 'react';
import { useCollectionEditor } from '../useCollectionEditor.ts';
import { ItemList } from '../ItemList.tsx';
import { TextField } from '../fields/TextField.tsx';
import { TextAreaField } from '../fields/TextAreaField.tsx';
import { HrefField } from '../fields/HrefField.tsx';
import { CheckboxField } from '../fields/CheckboxField.tsx';
import type { Event } from '../../../lib/content/cache.ts';

interface EventRow {
  id: string;
  slug: string;
  day: string;
  monthAr: string;
  titleAr: string;
  descAr: string;
  href: string;
  order: number;
  published: boolean;
}

function fromRow(row: Event, i: number): EventRow {
  return {
    id: row.slug,
    slug: row.slug,
    day: row.day,
    monthAr: row.monthAr,
    titleAr: row.titleAr,
    descAr: row.descAr,
    href: row.href,
    order: row.order ?? i * 10,
    published: row.published,
  };
}

function toPayload(rows: EventRow[]) {
  return rows.map(({ id: _id, ...rest }) => rest);
}

export default function EventsEditor({ initial }: { initial: Event[] }) {
  const [open, setOpen] = useState(false);
  const { draft, update, dirty, status, message, errors, save, reset } = useCollectionEditor<
    EventRow[]
  >(
    '/admin/api/events',
    initial.map(fromRow),
    toPayload,
    'events',
    'الفعاليات',
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
          <span className="panel__toggle-label">الفعاليات</span>
          {dirty && <span className="panel__badge">تغييرات غير محفوظة</span>}
          {status === 'error' && <span className="panel__badge panel__badge--error">تعذّر الحفظ</span>}
        </button>
      </h2>

      <div className="panel__body" hidden={!open}>
        <p className="form__hint">
          تظهر هذه الفعاليات في تبويب "الفعاليات والمعارض" بصفحة الأخبار والفعاليات.
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
          <ItemList<EventRow>
            items={draft}
            onChange={(items) => update(items)}
            makeItem={(id) => ({
              id,
              slug: id,
              day: '01',
              monthAr: '',
              titleAr: 'فعالية جديدة',
              descAr: '',
              href: '/register-interest',
              order: draft.length * 10,
              published: true,
            })}
            idPrefix="ev"
            min={0}
            max={24}
            labelFor={(item) => item.titleAr || item.slug}
            addLabel="إضافة فعالية"
          >
            {(item, i, patch) => (
              <>
                <TextField
                  label="المعرّف (slug)"
                  value={item.slug}
                  onChange={(v) => patch({ slug: v })}
                  name={`${i}.slug`}
                  error={errors[`${i}.slug`]}
                  hint="حروف لاتينية صغيرة وأرقام وشرطات فقط، مثل ev-kaust."
                  ltr
                />
                <TextField
                  label="اليوم"
                  value={item.day}
                  onChange={(v) => patch({ day: v })}
                  name={`${i}.day`}
                  error={errors[`${i}.day`]}
                  hint="مثل 27 أو 01."
                  ltr
                />
                <TextField
                  label="الشهر"
                  value={item.monthAr}
                  onChange={(v) => patch({ monthAr: v })}
                  name={`${i}.monthAr`}
                  error={errors[`${i}.monthAr`]}
                  hint="مثل يونيو – يوليو، أو نوفمبر 2026."
                />
                <TextField
                  label="العنوان"
                  value={item.titleAr}
                  onChange={(v) => patch({ titleAr: v })}
                  name={`${i}.titleAr`}
                  error={errors[`${i}.titleAr`]}
                />
                <TextAreaField
                  label="الوصف"
                  value={item.descAr}
                  onChange={(v) => patch({ descAr: v })}
                  name={`${i}.descAr`}
                  error={errors[`${i}.descAr`]}
                  rows={2}
                />
                <HrefField
                  label="رابط التفاصيل"
                  value={item.href}
                  onChange={(v) => patch({ href: v })}
                  name={`${i}.href`}
                  error={errors[`${i}.href`]}
                />
                <CheckboxField
                  label="منشورة على الموقع"
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
