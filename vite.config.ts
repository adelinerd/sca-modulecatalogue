import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/gitlab': {
        target: 'https://gitlab.opencode.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gitlab/, '')
      }
    }
  }
});
