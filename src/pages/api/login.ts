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
      return redirectWithCookies('/login?error=invalid', []);
    }

    // Forward the session cookie onto our own redirect response.
    return redirectWithCookies('/admin', result.headers.getSetCookie());
  } catch {
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
