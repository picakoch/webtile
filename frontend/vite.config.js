import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { DEFAULT_FONTS, FONTS } from "./fonts.config.js";

// The site's fonts (frontend/.env, see fonts.config.js) as a module:
// `import "virtual:site-fonts"` bundles only those fonts and defines
// --font-title / --font-text
function siteFonts(env) {
  const setting = (name) => env[`VITE_${name}`] || env[`VUE_APP_${name}`];
  const chosen = {
    title: setting("FONT_TITLE") || DEFAULT_FONTS.title,
    text: setting("FONT_TEXT") || DEFAULT_FONTS.text,
  };
  for (const [role, name] of Object.entries(chosen)) {
    if (!FONTS[name]) {
      throw new Error(
        `Unknown ${role} font "${name}" (VITE_FONT_${role.toUpperCase()}). ` +
          `Supported: ${Object.keys(FONTS).join(", ")} (fonts.config.js)`,
      );
    }
  }
  const stack = (name) => `"${name}", ${FONTS[name].fallback}`;
  const files = [
    ...new Set([chosen.title, chosen.text].flatMap((n) => FONTS[n].files)),
  ];

  const JS = "virtual:site-fonts";
  const CSS = "virtual:site-fonts-vars.css";
  return {
    name: "site-fonts",
    resolveId(id) {
      if (id === JS || id === CSS) return "\0" + id;
    },
    load(id) {
      if (id === "\0" + JS) {
        return [...files, CSS]
          .map((f) => `import ${JSON.stringify(f)};`)
          .join("\n");
      }
      if (id === "\0" + CSS) {
        return `:root {\n  --font-title: ${stack(chosen.title)};\n  --font-text: ${stack(chosen.text)};\n}\n`;
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue(), siteFonts(env)],
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
