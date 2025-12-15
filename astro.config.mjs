import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import pagefind from 'astro-pagefind';
import netlify from '@astrojs/netlify';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), pagefind(), react()],
  adapter: netlify()
});