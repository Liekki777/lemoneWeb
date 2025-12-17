import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import pagefind from 'astro-pagefind';
import cloudflare from '@astrojs/cloudflare'; // Esto se añadió con el comando
import react from '@astrojs/react';

export default defineConfig({
  // BORRA o comenta las líneas 'site' y 'base' que pusimos para GitHub.
  // Al no ponerlas, Astro asume que el sitio está en la raíz '/', que es lo que queremos.

  integrations: [tailwind(), pagefind(), react()],

  output: 'server', // O 'static', el adaptador lo suele configurar, pero 'server' o 'hybrid' te da más poder en Cloudflare
  adapter: cloudflare()
});