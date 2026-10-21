import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://gogottigo.github.io',
  base: '/boutique5-preview',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
