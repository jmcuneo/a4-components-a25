import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy:{
      "/login": "http://localhost:3000",
      "/table": "http://localhost:3000",
      "/fields": "http://localhost:3000",
      "/add": "http://localhost:3000",
      "/remove": "http://localhost:3000",
      "/update": "http://localhost:3000",
      "/docs": "http://localhost:3000",
    }
  }
});
