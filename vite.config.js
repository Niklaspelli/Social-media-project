// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Make sure Vite knows how to resolve node_modules
      "@": "/src",
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        // Add this if using CSS modules in general (optional)
        javascriptEnabled: true,
      },
    },
  },
});
