/* eslint-disable */
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src',
      name: 'ReactDatePrimitives'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React'
        }
      }
    }
  }
});
