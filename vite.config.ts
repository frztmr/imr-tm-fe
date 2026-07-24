import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path"; 

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    watch: {
      usePolling: true,
      interval: 1000, // slower but more stable
    },
    host: "::",
    port: 8899,
    // port: 80,
    // port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
