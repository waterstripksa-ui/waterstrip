import type { APIRoute } from 'astro';
import { auth } from '../../lib/auth.ts';

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const email = String(form.get('email') ?? '');
  const password = String(form.get('password') ?? '');

  if (!email || !password) {
    return redirectWithCookies('/login?error=missing', []);
  }

  try {
    const result = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });

    if (!result.ok) {
      // Server-side only — never let this detail reach the user (see docs/better-auth.md).
      const body = await result.clone().text();
      console.error(`[login] signInEmail not ok for ${email}: ${result.status} ${body}`);
      return redirectWithCookies('/login?error=invalid', []);
    }

    // Forward the session cookie onto our own redirect response.
    return redirectWithCookies('/admin', result.headers.getSetCookie());
  } catch (err) {
    console.error(`[login] signInEmail threw for ${email}:`, err);
    return redirectWithCookies('/login?error=invalid', []);
  }
};

function redirectWithCookies(location: string, cookies: string[]) {
  const headers = new Headers({ Location: location });
  for (const cookie of cookies) {
    headers.append('Set-Cookie', cookie);
  }
  return new Response(null, { status: 302, headers });
}
