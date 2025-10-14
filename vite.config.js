import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/getdata': 'http://localhost:3000',
      '/submit': 'http://localhost:3000',
      '/delete': 'http://localhost:3000',
      '/update': 'http://localhost:3000',
    },
  },
})
