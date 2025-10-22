import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
        include: ["chart.js"],
    },
    build: {
        chunkSizeWarningLimit: 2000,
        rollupOptions: {
            onwarn(warning, warn) {
                if (warning.code === "EVAL") return;
                warn(warning);
            },
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://13.214.216.27:3000",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
