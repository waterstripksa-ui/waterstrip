import { defineMiddleware } from 'astro:middleware';
import { auth } from './lib/auth.ts';

export const onRequest = defineMiddleware(async (context, next) => {
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
