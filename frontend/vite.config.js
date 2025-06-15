import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    proxy: {
      '/api': 'http://localhost:4000',      // Změněno z 3001 na 4000
      '/auth': 'http://localhost:4000',     // Změněno z 3001 na 4000  
      '/ws': {
        target: 'ws://localhost:4000',      // Změněno z 3001 na 4000
        ws: true
      }
    }
  }
});