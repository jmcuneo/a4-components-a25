import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/submit': 'http://localhost:3000',
      '/login': 'http://localhost:3000',
      '/delete': 'http://localhost:3000',
      '/change': 'http://localhost:3000',
      '/data': 'http://localhost:3000'
    }
  }
})
