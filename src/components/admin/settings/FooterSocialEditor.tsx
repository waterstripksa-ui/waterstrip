/** Edits `footer_social` — the social buttons in the site footer. */
import type { FooterSocial } from '../../../lib/content/schemas/footer-social.ts';
import { useSingletonEditor } from '../useSingletonEditor.ts';
import { SectionForm } from '../SectionForm.tsx';
import { UrlField } from '../fields/UrlField.tsx';

export default function FooterSocialEditor({ initial }: { initial: FooterSocial }) {
  const title = 'روابط التواصل الاجتماعي';
  const { draft, update, dirty, status, message, errors, save, reset } = useSingletonEditor(
    'footer_social',
    initial,
    title,
  );

  return (
    <SectionForm
      title={title}
      lede="روابط أزرار التواصل الاجتماعي الظاهرة في تذييل الموقع."
      dirty={dirty}
      status={status}
      message={message}
      onSave={save}
      onReset={reset}
    >
      <UrlField
        label="إكس (تويتر)"
        value={draft.xUrl}
        onChange={(v) => update({ ...draft, xUrl: v })}
        name="xUrl"
        error={errors.xUrl}
      />
      <UrlField
        label="لينكدإن"
        value={draft.linkedinUrl}
        onChange={(v) => update({ ...draft, linkedinUrl: v })}
        name="linkedinUrl"
        error={errors.linkedinUrl}
      />
    </SectionForm>
  );
}
