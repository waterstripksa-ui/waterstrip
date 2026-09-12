// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  // React is for the dashboard only — see docs/architecture.md. Public pages stay
  // zero-JS-framework and keep their vanilla inline scripts.
  integrations: [react()],
  security: {
    allowedDomains: [
      { hostname: "waterstrip.org", protocol: "https" }
    ]
  }
});
