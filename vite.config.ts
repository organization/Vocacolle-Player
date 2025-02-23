import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import solidSvg from 'vite-plugin-solid-svg';

import manifest from './src/manifest';

const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');

const isDev = process.env.__DEV__ === 'true';

export default defineConfig({
  plugins: [
    vanillaExtractPlugin({
      unstable_mode: 'transform',
    }),
    solidPlugin(),
    solidSvg(),
    crx({ manifest }),
  ],
  resolve: {
    alias: {
      '@src': root,
      '@assets': assetsDir,
      '@pages': pagesDir,
    },
  },
  publicDir,
  build: {
    outDir,
    sourcemap: isDev,
    rollupOptions: {
      input: {
        content: resolve(pagesDir, 'content', 'index.tsx'),
        progress: resolve(pagesDir, 'content', 'progress.ts'),
        background: resolve(pagesDir, 'background', 'index.ts'),
      },
      // input: {
      //   devtools: resolve(pagesDir, "devtools", "index.html"),
      //   panel: resolve(pagesDir, "panel", "index.html"),
      //   content: resolve(pagesDir, "content", "index.ts"),
      //   background: resolve(pagesDir, "background", "index.ts"),
      //   contentStyle: resolve(pagesDir, "content", "style.scss"),
      //   popup: resolve(pagesDir, "popup", "index.html"),
      //   newtab: resolve(pagesDir, "newtab", "index.html"),
      //   options: resolve(pagesDir, "options", "index.html"),
      // },
      output: {
        entryFileNames: 'src/pages/[name]/index.js',
        chunkFileNames: 'assets/js/[name].js',
      },
    },
  },
});
