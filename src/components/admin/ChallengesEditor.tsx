/**
 * Edits `home_challenges` — the intro and the water value-chain diagram.
 *
 * The five stages are fixed, named fields (their icons and order are the
 * diagram's structure); only their wording and the cards under each are editable.
 */
import {
  STAGE_IDS,
  type HomeChallengeCard,
  type HomeChallenges,
  type StageId,
} from '../../lib/content/schemas/home-challenges.ts';
import { useSingletonEditor } from './useSingletonEditor.ts';
import { SectionForm } from './SectionForm.tsx';
import { ItemList } from './ItemList.tsx';
import { BilingualTextField, BilingualTextAreaField } from './fields/BilingualFields.tsx';
import { HrefField } from './fields/HrefField.tsx';

const stageLabels: Record<StageId, string> = {
  supply: 'المرحلة ١ — الإمداد',
  storage: 'المرحلة ٢ — النقل والتخزين',
  distribution: 'المرحلة ٣ — التوزيع',
  reuse: 'المرحلة ٤ — معالجة مياه الصرف وإعادة استخدامها',
  demand: 'المرحلة ٥ — الطلب',
};

export default function ChallengesEditor({ initial }: { initial: HomeChallenges }) {
  const title = 'التحديات';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'home_challenges',
    initial,
    title,
  );

  function patchChain(patch: Partial<HomeChallenges['chain']>) {
    update({ ...draft, chain: { ...draft.chain, ...patch } });
  }

  function patchStage(id: StageId, patch: Partial<HomeChallenges['chain']['stages'][StageId]>) {
    patchChain({ stages: { ...draft.chain.stages, [id]: { ...draft.chain.stages[id], ...patch } } });
  }

  return (
    <SectionForm
      title={title}
      lede="نص القسم ومخطط سلسلة قيمة المياه. المراحل الخمس وأيقوناتها وترتيبها ثابتة؛ يمكن تحرير أسمائها وإضافة بطاقات كل مرحلة وحذفها وترتيبها."
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
      <BilingualTextField
        label="العنوان"
        value={draft.titleAr}
        onChange={(v) => update({ ...draft, titleAr: v })}
        name="titleAr"
        error={errors.titleAr}
        valueEn={draft.titleEn}
        onChangeEn={(v) => update({ ...draft, titleEn: v })}
        errorEn={errors.titleEn}
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
      <BilingualTextAreaField
        label="النص الثانوي"
        value={draft.textAr}
        onChange={(v) => update({ ...draft, textAr: v })}
        name="textAr"
        error={errors.textAr}
        rows={3}
        valueEn={draft.textEn}
        onChangeEn={(v) => update({ ...draft, textEn: v })}
        errorEn={errors.textEn}
      />
      <BilingualTextField
        label="نص الزر"
        value={draft.ctaLabelAr}
        onChange={(v) => update({ ...draft, ctaLabelAr: v })}
        name="ctaLabelAr"
        error={errors.ctaLabelAr}
        valueEn={draft.ctaLabelEn}
        onChangeEn={(v) => update({ ...draft, ctaLabelEn: v })}
        errorEn={errors.ctaLabelEn}
      />
      <HrefField
        label="رابط الزر"
        value={draft.ctaHref}
        onChange={(v) => update({ ...draft, ctaHref: v })}
        name="ctaHref"
        error={errors.ctaHref}
      />

      <BilingualTextField
        label="شريط الهدف العام (أسفل المراحل)"
        value={draft.chain.bandAr}
        onChange={(v) => patchChain({ bandAr: v })}
        name="chain.bandAr"
        error={errors['chain.bandAr']}
        valueEn={draft.chain.bandEn}
        onChangeEn={(v) => patchChain({ bandEn: v })}
        errorEn={errors['chain.bandEn']}
      />
      <BilingualTextField
        label="سطر المصدر"
        value={draft.chain.sourceAr}
        onChange={(v) => patchChain({ sourceAr: v })}
        name="chain.sourceAr"
        error={errors['chain.sourceAr']}
        valueEn={draft.chain.sourceEn}
        onChangeEn={(v) => patchChain({ sourceEn: v })}
        errorEn={errors['chain.sourceEn']}
      />

      {STAGE_IDS.map((id) => {
        const stage = draft.chain.stages[id];
        return (
          <div key={id}>
            <BilingualTextField
              label={`${stageLabels[id]} — الاسم`}
              value={stage.nameAr}
              onChange={(v) => patchStage(id, { nameAr: v })}
              name={`chain.stages.${id}.nameAr`}
              error={errors[`chain.stages.${id}.nameAr`]}
              valueEn={stage.nameEn}
              onChangeEn={(v) => patchStage(id, { nameEn: v })}
              errorEn={errors[`chain.stages.${id}.nameEn`]}
            />
            <ItemList<HomeChallengeCard>
              items={stage.items}
              onChange={(items) => patchStage(id, { items })}
              makeItem={(itemId) => ({ id: itemId, textAr: 'بطاقة جديدة', textEn: '' })}
              idPrefix={id}
              min={1}
              max={6}
              labelFor={(_, i) => `بطاقة ${i + 1}`}
              addLabel="إضافة بطاقة"
            >
              {(item, i, patch) => (
                <BilingualTextField
                  label="النص"
                  value={item.textAr}
                  onChange={(v) => patch({ textAr: v })}
                  name={`chain.stages.${id}.items.${i}.textAr`}
                  error={errors[`chain.stages.${id}.items.${i}.textAr`]}
                  valueEn={item.textEn}
                  onChangeEn={(v) => patch({ textEn: v })}
                  errorEn={errors[`chain.stages.${id}.items.${i}.textEn`]}
                />
              )}
            </ItemList>
          </div>
        );
      })}
    </SectionForm>
  );
}
