import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/auth': 'http://localhost:3000',
      '/me': 'http://localhost:3000',
      '/todos': 'http://localhost:3000',
      '/submit': 'http://localhost:3000',
      '/delete': 'http://localhost:3000',
      '/toggle': 'http://localhost:3000',
      '/edit': 'http://localhost:3000',
      '/logout': 'http://localhost:3000'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
