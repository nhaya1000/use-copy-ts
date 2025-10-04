import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UseCopyTs',
      formats: ['es', 'cjs'],
      fileName: (format) =>
        `index.${format === 'es' ? 'esm' : ''}${format === 'cjs' ? '' : '.'}js`,
    },
    rollupOptions: {
      external: ['react'],
    },
  },
});
