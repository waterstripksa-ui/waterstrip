/**
 * Reads and bulk-writes the working-group collection.
 *
 * Unlike the singleton endpoint at ./content/[key].ts, there is one route for
 * the whole list: with only eight groups today, the dashboard edits and saves
 * the full array in one request (`replaceWorkingGroups`), the same mechanism
 * import already uses. Lives under `/admin` for the same reason as the other
 * content endpoints — see that file's note on the CSRF origin check.
 */
import type { APIRoute } from 'astro';
import { listAllWorkingGroups } from '../../../lib/content/cache.ts';
import { replaceWorkingGroups, ContentValidationError } from '../../../lib/content/repo.ts';

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export const GET: APIRoute = ({ locals }) => {
  if (locals.user?.role !== 'admin') {
    return json({ ok: false, message: 'غير مصرّح.' }, 403);
  }
  return json({ ok: true, data: listAllWorkingGroups() }, 200);
};

export const PUT: APIRoute = async ({ request, locals }) => {
  if (locals.user?.role !== 'admin') {
    return json({ ok: false, message: 'غير مصرّح.' }, 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: 'تعذّرت قراءة البيانات المرسلة.' }, 400);
  }

  if (!Array.isArray(body)) {
    return json({ ok: false, message: 'صيغة البيانات غير صحيحة.' }, 400);
  }

  const slugs = new Set<string>();
  for (const row of body) {
    const slug = (row as { slug?: unknown })?.slug;
    if (typeof slug === 'string' && slugs.has(slug)) {
      return json({ ok: false, message: `المعرّف "${slug}" مكرّر.` }, 422);
    }
    if (typeof slug === 'string') slugs.add(slug);
  }

  try {
    replaceWorkingGroups(body, locals.user.id);
    return json({ ok: true, data: listAllWorkingGroups() }, 200);
  } catch (error) {
    if (error instanceof ContentValidationError) {
      return json(
        { ok: false, message: 'تعذّر الحفظ: راجع الحقول المميّزة بالأحمر.', issues: error.issues },
        422,
      );
    }
    console.error('[content] failed to write working groups', error);
    return json({ ok: false, message: 'حدث خطأ غير متوقّع أثناء الحفظ.' }, 500);
  }
};
