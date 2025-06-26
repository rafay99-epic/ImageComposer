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
});
