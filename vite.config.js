import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ["**/*.glb"],

  plugins: [
    react(),
    tailwindcss(),

    // Bundle analyzer
    visualizer({
      filename: "dist/stats.html",
      template: "treemap",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});