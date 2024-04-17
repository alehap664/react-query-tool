import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'Index',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react', '@tanstack/query-core', '@tanstack/react-query']
    }
  },
  plugins: [dts()]
});
