import { chrome } from '../temp/electron-vendors.config.json';
import { resolve } from 'path';
import { builtinModules } from 'module';
import { defineConfig } from 'vite';

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
  build: {
    sourcemap: process.env.MODE === 'development' ? true : false,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      external: [...builtinModules],
    },
    emptyOutDir: true,
    brotliSize: false,
  },
});
