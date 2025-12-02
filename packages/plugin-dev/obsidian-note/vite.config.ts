import { defineConfig } from 'vite';
import { resolve } from 'path';
import copyFiles from './vite-plugin-copy-files.js';

export default defineConfig({
  base: './',
  plugins: [copyFiles()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.ts'),
      output: {
        entryFileNames: 'plugin.js',
        format: 'iife',
      },
    },
    copyPublicDir: false,
  },
});
