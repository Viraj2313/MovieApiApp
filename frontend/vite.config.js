import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    ,react()],
  server: {
    port: 5174,
    proxy:{
      "/api":{
        target:"https://mymovieapi-h7athbbzc4fmb0es.canadacentral-01.azurewebsites.net",
        changeOrigin:true,
      }
    }
  },
  build: {
    outDir: 'build', 
  },
});