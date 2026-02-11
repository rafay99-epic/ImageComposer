import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core – keep together for a single vendor chunk
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "react-vendor";
          }
          // Router – separate chunk, used on every route
          if (id.includes("node_modules/react-router")) {
            return "router";
          }
          // Mermaid (docs only) – large; load only when Documentation is opened
          if (id.includes("node_modules/mermaid")) {
            return "mermaid";
          }
          // Syntax highlighter (docs only)
          if (id.includes("node_modules/react-syntax-highlighter")) {
            return "syntax-highlighter";
          }
          // Radix UI – shared across several pages
          if (id.includes("node_modules/@radix-ui")) {
            return "radix";
          }
          // Markdown / docs tooling
          if (
            id.includes("node_modules/react-markdown") ||
            id.includes("node_modules/remark-") ||
            id.includes("node_modules/rehype-") ||
            id.includes("node_modules/unified")
          ) {
            return "markdown";
          }
        },
      },
    },
    // Mermaid is a single ~2.4 MB vendor chunk (diagram engines); it loads only when /docs is visited.
    chunkSizeWarningLimit: 2500,
  },
  server: {
    proxy: {
      "/api/replicate": {
        target: "https://api.replicate.com/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/replicate/, ""),
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            // Add the Authorization header to the proxied request
            proxyReq.setHeader(
              "Authorization",
              `Token ${process.env.VITE_REPLICATE_API_TOKEN}`
            );
          });
        },
      },
    },
  },
  define: {
    "process.env": {},
    "process.platform": JSON.stringify("browser"),
    "process.version": JSON.stringify("v16.0.0"),
    process: {
      platform: "browser",
      env: {},
      version: "v16.0.0",
      nextTick: (callback: Function, ...args: any[]) =>
        queueMicrotask(() => callback(...args)),
    },
  },
});
