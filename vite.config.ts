import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static SPA. Base is relative so the build works under any path (root,
// a subfolder, or GitHub Pages) without further configuration.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
