import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import pagefind from 'astro-pagefind';
// import netlify from '@astrojs/netlify'; <--- ELIMINA O COMENTA ESTO

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // --- CONFIGURACIÓN PARA GITHUB PAGES ---
  // Reemplaza con tu usuario real de GitHub
  site: 'https://liekki777.github.io',
  // El nombre de tu repositorio
  base: '/lemoneWeb', 
  // ---------------------------------------

  integrations: [tailwind(), pagefind(), react()],
  
  // adapter: netlify() <--- ELIMINA O COMENTA ESTO
});