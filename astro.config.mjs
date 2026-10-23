// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://vurgn.com',
  // GitHub Pages serves the preview from /<repo>/; the deploy workflow sets BASE_PATH. Production stays at the root.
  base: process.env.BASE_PATH || '/',
  output: 'static',
  // Pages stay static HTML; only /api/contact runs on demand. Swap this adapter for the host's own (Vercel, Netlify, Cloudflare) at deploy.
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  build: { inlineStylesheets: 'always' },
  env: {
    schema: {
      CONTACT_WEBHOOK_URL: envField.string({ context: 'server', access: 'secret', optional: true, url: true }),
    },
  },
});
