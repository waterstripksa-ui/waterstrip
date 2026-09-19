/**
 * Edits `reports_list` — the reports on the /reports page. Each report has a
 * bilingual title and description and two independent link lists: Arabic links
 * appear only on the Arabic site, English links only on the English site (see
 * src/lib/content/schemas/reports-list.ts).
 */
import type { Report, ReportLink, ReportsList } from '../../../lib/content/schemas/reports-list.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { ItemList } from '../ItemList.tsx';
import { TextField } from '../fields/TextField.tsx';
import { BilingualTextField, BilingualTextAreaField } from '../fields/BilingualFields.tsx';

type LinkList = 'linksAr' | 'linksEn';

export default function ReportsListEditor({ initial }: { initial: ReportsList }) {
  const title = 'التقارير';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'reports_list',
    initial,
    title,
  );

  function linkList(
    report: Report,
    i: number,
    patch: (fields: Partial<Report>) => void,
    list: LinkList,
  ) {
    const en = list === 'linksEn';
    return (
      <fieldset className="form">
        <legend className="form__label">{en ? 'الروابط الإنجليزية' : 'الروابط العربية'}</legend>
        <p className="form__hint">
          {en ? 'تظهر في النسخة الإنجليزية من الموقع فقط.' : 'تظهر في النسخة العربية من الموقع فقط.'}
        </p>
        <ItemList<ReportLink>
          items={report[list]}
          onChange={(links) => patch({ [list]: links })}
          makeItem={(id) => ({ id, label: en ? 'Link' : 'رابط جديد', url: '' })}
          idPrefix="rl"
          min={0}
          max={10}
          labelFor={(_, n) => `${en ? 'رابط إنجليزي' : 'رابط عربي'} ${n + 1}`}
          addLabel={en ? 'إضافة رابط إنجليزي' : 'إضافة رابط عربي'}
        >
          {(link, n, patchLink) => (
            <>
              <TextField
                label="نص الرابط"
                value={link.label}
                onChange={(v) => patchLink({ label: v })}
                name={`items.${i}.${list}.${n}.label`}
                error={errors[`items.${i}.${list}.${n}.label`]}
                lang={en ? 'en' : undefined}
              />
              <TextField
                label="الرابط"
                value={link.url}
                onChange={(v) => patchLink({ url: v })}
                name={`items.${i}.${list}.${n}.url`}
                error={errors[`items.${i}.${list}.${n}.url`]}
                hint="رابط كامل يبدأ بـ https://‎، ويُفتح في نافذة جديدة."
                ltr
              />
            </>
          )}
        </ItemList>
      </fieldset>
    );
  }

  return (
    <SectionForm
      title={title}
      lede="قائمة التقارير في صفحة «التقارير». يمكن إضافة التقارير وحذفها وترتيبها، ولكل تقرير روابط عربية تظهر في النسخة العربية وروابط إنجليزية تظهر في النسخة الإنجليزية."
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
      <ItemList<Report>
        items={draft.items}
        onChange={(items) => update({ ...draft, items })}
        makeItem={(id) => ({
          id,
          titleAr: 'تقرير جديد',
          titleEn: '',
          descriptionAr: 'وصف التقرير',
          descriptionEn: '',
          linksAr: [],
          linksEn: [],
        })}
        idPrefix="rp"
        min={0}
        max={30}
        labelFor={(_, i) => `التقرير ${i + 1}`}
        addLabel="إضافة تقرير"
      >
        {(report, i, patch) => (
          <>
            <BilingualTextField
              label="العنوان"
              value={report.titleAr}
              onChange={(v) => patch({ titleAr: v })}
              name={`items.${i}.titleAr`}
              error={errors[`items.${i}.titleAr`]}
              valueEn={report.titleEn}
              onChangeEn={(v) => patch({ titleEn: v })}
              errorEn={errors[`items.${i}.titleEn`]}
            />
            <BilingualTextAreaField
              label="الوصف"
              value={report.descriptionAr}
              onChange={(v) => patch({ descriptionAr: v })}
              name={`items.${i}.descriptionAr`}
              error={errors[`items.${i}.descriptionAr`]}
              rows={3}
              valueEn={report.descriptionEn}
              onChangeEn={(v) => patch({ descriptionEn: v })}
              errorEn={errors[`items.${i}.descriptionEn`]}
            />
            {linkList(report, i, patch, 'linksAr')}
            {linkList(report, i, patch, 'linksEn')}
          </>
        )}
      </ItemList>
    </SectionForm>
  );
}
