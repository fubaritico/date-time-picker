import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './dev',
  build: {
    outDir: '../dist-dev',
  },
  server: {
    port: 3000,
  },
});
