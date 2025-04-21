import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Load env from packages/config directory where .env resides
  envDir: path.resolve(__dirname, '../../packages/config'),
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@config": path.resolve(__dirname, "../../packages/config"),
      "@ui": path.resolve(__dirname, "../../packages/ui"),
    },
  },
}));
