import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Cross-browser: Safari 14+, Chrome 89+, Firefox 89+, Edge 89+
    target: ["es2020", "chrome89", "firefox89", "safari14", "edge89"],
    // Increase warning limit for vendor chunks
    chunkSizeWarningLimit: 600,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Source maps disabled for smaller deploy
    sourcemap: false,
    // Rollup options for optimal chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime
          "vendor-react": ["react", "react-dom"],
          // Router
          "vendor-router": ["react-router-dom"],
          // UI library (Radix)
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-label",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
          ],
          // Animation — separate chunk, loaded on demand
          "vendor-animation": ["framer-motion"],
          // Forms & validation
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          // Data fetching
          "vendor-data": ["axios", "react-query", "@supabase/supabase-js"],
          // Icons — tree-shaken but keep in own chunk
          "vendor-icons": ["lucide-react"],
        },
      },
    },
    // Minification
    minify: "esbuild",
    // Aggressive tree-shaking
    modulePreload: { polyfill: false },
  },
});
