import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';

import netlify from '@astrojs/netlify';

import preact from '@astrojs/preact';

export default defineConfig({
  build: {
    format: 'file',  // ← Esto es clave para que funcione el bundle
  },

  integrations: [pagefind(), preact()],
  adapter: netlify(),
});