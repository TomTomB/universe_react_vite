import { chrome } from '../temp/electron-vendors.config.json';
import { resolve } from 'path';
import { builtinModules } from 'module';
import { defineConfig } from 'vite';

const PACKAGE_ROOT = __dirname;
const SRC_PATH = `${resolve(PACKAGE_ROOT, 'src')}`;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      '@universe/client-preload': SRC_PATH,
    },
  },
  build: {
    sourcemap: process.env.MODE === 'development' ? 'inline' : false,
    target: `chrome${chrome}`,
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['electron', ...builtinModules],
      output: {
        dir: '../../../dist/client/preload',
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
});
