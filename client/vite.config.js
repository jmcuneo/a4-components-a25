import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/submit': 'http://localhost:3000',
      '/data': 'http://localhost:3000',
      '/modify': 'http://localhost:3000',
      '/delete': 'http://localhost:3000',
    }
  }
})
