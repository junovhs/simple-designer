import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// MANDATE: Simple config without wasm plugin for now
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    fs: {
      allow: ['..'],
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
  },
  optimizeDeps: {
    exclude: ['simple_designer_core'],
  },
});