import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue()],
    // VUE_APP_ kept so existing .env files (from vue-cli) keep working
    envPrefix: ["VITE_", "VUE_APP_"],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      // Imports like "@/components/NotFound" omit the extension
      extensions: [".mjs", ".js", ".json", ".vue"],
    },
    server: {
      port: Number(env.PORT) || 8080,
    },
    build: {
      // pdf.js (used by @tato30/vue-pdf) relies on top-level await
      target: "es2022",
    },
    css: {
      preprocessorOptions: {
        // Lets UIkit's data-uri() find its SVGs relative to its own less files
        less: { rewriteUrls: "all" },
      },
    },
  };
});
