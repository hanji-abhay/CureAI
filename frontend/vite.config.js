import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/api": {
        target: "https://cureai-backend-stq7.onrender.com",
        changeOrigin: true,
        secure: true,
        headers: {
          Origin: "https://cure-ai-tau.vercel.app",
         },
      },
    },
  },

  test: {
    environment: "jsdom",
    clearMocks: true,
    restoreMocks: true,
  },
});
