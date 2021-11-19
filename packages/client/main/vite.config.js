import { defineConfig } from 'vite';
import { node } from '../temp/electron-vendors.config.json';
import { resolve } from 'path';
import { builtinModules } from 'module';

const PACKAGE_ROOT = __dirname;
const SRC_PATH = `${resolve(PACKAGE_ROOT, 'src')}`;

export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      '@universe/client-main': SRC_PATH,
    },
  },
  build: {
    sourcemap: process.env.MODE === 'development' ? 'inline' : false,
    target: `node${node}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['electron', 'electron-devtools-installer', ...builtinModules],
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
});
