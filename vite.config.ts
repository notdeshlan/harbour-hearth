import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths so the built site works from any folder,
  // including a GitHub Pages project URL such as /harbour-hearth/.
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        menu: 'menu.html',
        about: 'about.html',
        contact: 'contact.html',
      },
    },
  },
});
