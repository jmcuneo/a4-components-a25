import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      "/results": "http://localhost:3000",
      "/add": "http://localhost:3000",
      "/delete": "http://localhost:3000",
      "/update": "http://localhost:3000",
      "/auth": "http://localhost:3000",
    }
  }
})
