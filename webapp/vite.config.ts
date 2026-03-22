import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "#components": "/src/components",
      "#utils": "/src/utils",
      "#styles": "/src/styles",
    },
  },
});
