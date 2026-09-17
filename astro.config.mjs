// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  // The adapter's default body limit is 1 GB. Image uploads cap at 8 MB (see
  // src/lib/content/media.ts); this leaves headroom for the multipart envelope.
  adapter: node({ mode: 'standalone', bodySizeLimit: 10 * 1024 * 1024 }),
  // React is for the dashboard only — see docs/architecture.md. Public pages stay
  // zero-JS-framework and keep their vanilla inline scripts.
  integrations: [react()],
  // Arabic (RTL) at the root, English (LTR) under /en. Each public page is a
  // view in src/views/ with a thin route in both src/pages/ and src/pages/en/.
  // See docs/i18n.md.
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    routing: { prefixDefaultLocale: false },
  },
  security: {
    allowedDomains: [
      { hostname: "waterstrip.org", protocol: "https" }
    ]
  }
});
