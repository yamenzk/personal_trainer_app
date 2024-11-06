import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import proxyOptions from './proxyOptions';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: proxyOptions
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  base: '', // Changed from '/dashboard/' to empty string
  build: {
    outDir: '../personal_trainer_app/public/dashboard',
    emptyOutDir: true,
    target: 'es2015',
  },
});