import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
