/**
 * Edits the whole article collection (ported from
 * waterstrip/assets/js/article-data.js) as one bulk save — see
 * useCollectionEditor.ts and repo.ts's `replaceArticles`.
 *
 * `id` fields exist only for ItemList's React-key bookkeeping and never reach
 * the server — the real identifier is `slug`, same reasoning as
 * WorkingGroupsEditor.tsx. `imageId` is a plain media reference (see the note
 * on `article.imageId` in content-schema.ts), so it uses the same ImageField
 * every singleton editor uses, fed by a `known` media map the admin page
 * builds directly from each article's `imageId` rather than via
 * `collectMediaIds` (which only walks singleton Zod schemas).
 */
import { useState } from 'react';
import { useCollectionEditor } from '../useCollectionEditor.ts';
import { ItemList } from '../ItemList.tsx';
import { TextField } from '../fields/TextField.tsx';
import { TextAreaField } from '../fields/TextAreaField.tsx';
import { CheckboxField } from '../fields/CheckboxField.tsx';
import { ImageField } from '../fields/ImageField.tsx';
import type { Article } from '../../../lib/content/cache.ts';
import type { MediaView } from '../../../lib/content/cache.ts';

interface BlockRow {
  id: string;
  headingAr: string;
  bodyAr: string;
}

interface TagRow {
  id: string;
  textAr: string;
}

interface ArticleRow {
  id: string;
  slug: string;
  kindAr: string;
  dateAr: string;
  readAr: string;
  imageId: string | null;
  titleAr: string;
  ledeAr: string;
  blocks: BlockRow[];
  quoteAr: string;
  quoteByAr: string;
  tags: TagRow[];
  order: number;
  published: boolean;
}

function fromRow(row: Article, i: number): ArticleRow {
  return {
    id: row.slug,
    slug: row.slug,
    kindAr: row.kindAr,
    dateAr: row.dateAr,
    readAr: row.readAr,
    imageId: row.imageId,
    titleAr: row.titleAr,
    ledeAr: row.ledeAr,
    blocks: row.blocks.map((b, j) => ({ id: `${row.slug}-block-${j}`, ...b })),
    quoteAr: row.quoteAr,
    quoteByAr: row.quoteByAr,
    tags: row.tagsAr.map((t, j) => ({ id: `${row.slug}-tag-${j}`, textAr: t })),
    order: row.order ?? i * 10,
    published: row.published,
  };
}

function toPayload(rows: ArticleRow[]) {
  return rows.map(({ id: _id, blocks, tags, ...rest }) => ({
    ...rest,
    blocks: blocks.map(({ id: _bid, ...b }) => b),
    tagsAr: tags.map((t) => t.textAr),
  }));
}

interface Props {
  initial: Article[];
  media: Record<string, MediaView>;
}

export default function ArticlesEditor({ initial, media }: Props) {
  const [open, setOpen] = useState(false);
  const { draft, update, dirty, status, message, errors, save, reset } = useCollectionEditor<
    ArticleRow[]
  >(
    '/admin/api/articles',
    initial.map(fromRow),
    toPayload,
    'articles',
    'الأخبار',
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
          <span className="panel__toggle-label">الأخبار</span>
          {dirty && <span className="panel__badge">تغييرات غير محفوظة</span>}
          {status === 'error' && <span className="panel__badge panel__badge--error">تعذّر الحفظ</span>}
        </button>
      </h2>

      <div className="panel__body" hidden={!open}>
        <p className="form__hint">
          كل خبر يظهر كبطاقة في تبويب "الأخبار" بصفحة الأخبار والفعاليات، وصفحة تفصيلية بمساره
          الخاص. المعرّف (slug) يحدّد رابط الصفحة التفصيلية، ويجب أن يبقى فريدًا.
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
          <ItemList<ArticleRow>
            items={draft}
            onChange={(items) => update(items)}
            makeItem={(id) => ({
              id,
              slug: id,
              kindAr: 'أخبار',
              dateAr: '',
              readAr: '',
              imageId: null,
              titleAr: 'خبر جديد',
              ledeAr: '',
              blocks: [],
              quoteAr: '',
              quoteByAr: '',
              tags: [],
              order: draft.length * 10,
              published: true,
            })}
            idPrefix="art"
            min={0}
            max={40}
            labelFor={(item) => item.titleAr || item.slug}
            addLabel="إضافة خبر"
          >
            {(item, i, patch) => (
              <>
                <TextField
                  label="المعرّف (slug)"
                  value={item.slug}
                  onChange={(v) => patch({ slug: v })}
                  name={`${i}.slug`}
                  error={errors[`${i}.slug`]}
                  hint="حروف لاتينية صغيرة وأرقام وشرطات فقط، مثل esg-award."
                  ltr
                />
                <TextField
                  label="التصنيف"
                  value={item.kindAr}
                  onChange={(v) => patch({ kindAr: v })}
                  name={`${i}.kindAr`}
                  error={errors[`${i}.kindAr`]}
                  hint="مثل أخبار."
                />
                <TextField
                  label="التاريخ"
                  value={item.dateAr}
                  onChange={(v) => patch({ dateAr: v })}
                  name={`${i}.dateAr`}
                  error={errors[`${i}.dateAr`]}
                  hint="مثل 8 ديسمبر 2025، أو 2026."
                />
                <TextField
                  label="مدة القراءة"
                  value={item.readAr}
                  onChange={(v) => patch({ readAr: v })}
                  name={`${i}.readAr`}
                  error={errors[`${i}.readAr`]}
                  hint="مثل قراءة دقيقتان."
                />

                <ImageField
                  label="صورة الخبر"
                  value={item.imageId}
                  onChange={(v) => patch({ imageId: v })}
                  name={`${i}.imageId`}
                  error={errors[`${i}.imageId`]}
                  defaultAlt={item.titleAr}
                  known={media}
                />

                <TextField
                  label="العنوان"
                  value={item.titleAr}
                  onChange={(v) => patch({ titleAr: v })}
                  name={`${i}.titleAr`}
                  error={errors[`${i}.titleAr`]}
                />
                <TextAreaField
                  label="المقدمة"
                  value={item.ledeAr}
                  onChange={(v) => patch({ ledeAr: v })}
                  name={`${i}.ledeAr`}
                  error={errors[`${i}.ledeAr`]}
                  rows={2}
                />

                <ItemList<BlockRow>
                  items={item.blocks}
                  onChange={(blocks) => patch({ blocks })}
                  makeItem={(id) => ({ id, headingAr: 'عنوان فرعي', bodyAr: '' })}
                  idPrefix={`${item.id}-block`}
                  min={0}
                  max={8}
                  labelFor={(block) => block.headingAr}
                  addLabel="إضافة فقرة"
                >
                  {(block, j, patchBlock) => (
                    <>
                      <TextField
                        label="العنوان الفرعي"
                        value={block.headingAr}
                        onChange={(v) => patchBlock({ headingAr: v })}
                        name={`${i}.blocks.${j}.headingAr`}
                        error={errors[`${i}.blocks.${j}.headingAr`]}
                      />
                      <TextAreaField
                        label="النص"
                        value={block.bodyAr}
                        onChange={(v) => patchBlock({ bodyAr: v })}
                        name={`${i}.blocks.${j}.bodyAr`}
                        error={errors[`${i}.blocks.${j}.bodyAr`]}
                        rows={4}
                      />
                    </>
                  )}
                </ItemList>

                <TextAreaField
                  label="اقتباس (اختياري)"
                  value={item.quoteAr}
                  onChange={(v) => patch({ quoteAr: v })}
                  name={`${i}.quoteAr`}
                  error={errors[`${i}.quoteAr`]}
                  rows={2}
                />
                <TextField
                  label="قائل الاقتباس (اختياري)"
                  value={item.quoteByAr}
                  onChange={(v) => patch({ quoteByAr: v })}
                  name={`${i}.quoteByAr`}
                  error={errors[`${i}.quoteByAr`]}
                />

                <ItemList<TagRow>
                  items={item.tags}
                  onChange={(tags) => patch({ tags })}
                  makeItem={(id) => ({ id, textAr: 'وسم' })}
                  idPrefix={`${item.id}-tag`}
                  min={0}
                  max={8}
                  labelFor={(tag) => tag.textAr}
                  addLabel="إضافة وسم"
                >
                  {(tag, j, patchTag) => (
                    <TextField
                      label="الوسم"
                      value={tag.textAr}
                      onChange={(v) => patchTag({ textAr: v })}
                      name={`${i}.tagsAr.${j}`}
                      error={errors[`${i}.tagsAr.${j}`]}
                    />
                  )}
                </ItemList>

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
