/* eslint-env node */

import { chrome } from '../temp/electron-vendors.config.json';
import { resolve } from 'path';
import { builtinModules } from 'module';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PACKAGE_ROOT = __dirname;
const SRC_PATH = `${resolve(PACKAGE_ROOT, 'src')}`;

export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  resolve: {
    alias: {
      '@universe/client-renderer': SRC_PATH,
    },
  },
  plugins: [react()],
  build: {
    sourcemap: process.env.MODE === 'development' ? true : false,
    target: `chrome${chrome}`,
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    rollupOptions: {
      external: [...builtinModules],
      output: {
        dir: '../../../dist/client/renderer',
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
});
