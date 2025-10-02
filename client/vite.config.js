import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [react()],
    server: {
      port: 5173, // default Vite dev port
      proxy: {
        // Proxy all API requests to your backend server running on port 3001
        "/login": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/signup": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/logout": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/me": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/session": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/submit": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/results": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/edit": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/delete": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/update": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
      },
      hmr: {
        overlay: true, // show errors in the browser overlay
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    build: {
      sourcemap: true, // optional, helps debugging
    },
  };
});
