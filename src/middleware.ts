import { defineMiddleware } from 'astro:middleware';
import { auth } from './lib/auth.ts';

export const onRequest = defineMiddleware(async (context, next) => {
  // Uploaded images are public and immutable. A session lookup is a database read
  // per image, for a response that never depends on who is asking.
  if (context.url.pathname.startsWith('/media/')) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  const result = await auth.api.getSession({ headers: context.request.headers });

  context.locals.user = result?.user ?? null;
  context.locals.session = result?.session ?? null;

  if (context.url.pathname.startsWith('/admin')) {
    if (!context.locals.user) {
      return context.redirect('/login', 302);
    }
    if (context.locals.user.role !== 'admin') {
      return new Response('Forbidden', { status: 403 });
    }
  }

  return next();
});
