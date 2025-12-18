import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import pagefind from 'astro-pagefind';
import cloudflare from '@astrojs/cloudflare'; // Esto se añadió con el comando
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://lemone.pages.dev', // Actualiza esto con tu nueva URL de Cloudflare Pages cuando la tengas

  integrations: [tailwind(), pagefind(), react()],

  output: 'server', // O 'static', el adaptador lo suele configurar, pero 'server' o 'hybrid' te da más poder en Cloudflare
  adapter: cloudflare()
});