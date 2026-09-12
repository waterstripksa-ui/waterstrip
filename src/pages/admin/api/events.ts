/**
 * Reads and bulk-writes the event collection. Same shape as
 * ./working-groups.ts — see that file's note on why one route replaces the
 * whole list instead of per-row endpoints. `event`'s own repo comment ("the
 * dashboard edits records one at a time through `upsertEvent`") predates this
 * admin surface; bulk replace is what shipped for working groups and articles
 * at the same small scale, so events follows suit rather than being the odd
 * one out.
 */
import type { APIRoute } from 'astro';
import { listAllEvents } from '../../../lib/content/cache.ts';
import { replaceEvents, ContentValidationError } from '../../../lib/content/repo.ts';

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
  return json({ ok: true, data: listAllEvents() }, 200);
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
    replaceEvents(body, locals.user.id);
    return json({ ok: true, data: listAllEvents() }, 200);
  } catch (error) {
    if (error instanceof ContentValidationError) {
      return json(
        { ok: false, message: 'تعذّر الحفظ: راجع الحقول المميّزة بالأحمر.', issues: error.issues },
        422,
      );
    }
    console.error('[content] failed to write events', error);
    return json({ ok: false, message: 'حدث خطأ غير متوقّع أثناء الحفظ.' }, 500);
  }
};
