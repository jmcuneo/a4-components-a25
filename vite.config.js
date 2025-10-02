import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/guess': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            '/game': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            '/stats': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    },
    build: {
        outDir: 'dist',
    }
})