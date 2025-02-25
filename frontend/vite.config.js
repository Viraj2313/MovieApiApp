import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://localhost:7264',
        changeOrigin: true,
        secure:false
      }
    }
  },
  build: {
    outDir: 'build', 
  },
});