import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';

import netlify from '@astrojs/netlify';

export default defineConfig({
  build: {
    format: 'file',  // ← Esto es clave para que funcione el bundle
  },

  integrations: [pagefind()],
  adapter: netlify(),
});