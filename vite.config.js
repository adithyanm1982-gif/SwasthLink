import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// /api is proxied to the Express server. If it is offline the UI falls back to demo mode.
export default defineConfig({
  plugins: [react()],
  optimizeDeps: { include: ["react", "react-dom", "react-router-dom", "axios", "lucide-react", "recharts", "@jitsi/react-sdk"] },
  server: { port: 5173, proxy: { "/api": { target: process.env.VITE_API_PROXY || "http://localhost:5000", changeOrigin: true } } },
  build: { rollupOptions: { output: { manualChunks: { vendor: ["react", "react-dom", "react-router-dom"], charts: ["recharts"], video: ["@jitsi/react-sdk"] } } } },
});
