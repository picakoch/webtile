// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false }, // Disable devtools for production
  modules: ["@nuxtjs/apollo", "@pinia/nuxt"],

  // Configure for static site generation
  ssr: true,
  experimental: {
    payloadExtraction: false, // Disable _payload.json extraction for cleaner HTML
  },
  css: ["~/assets/main.less"],
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.GRAPHQL_URL || "http://localhost/graphql",
      },
    },
  },
  nitro: {
    prerender: {
      routes: ["/time", "/tag", "/media", "/bio", "/contact", "/support"],
      crawlLinks: true, // Automatically discover additional routes
      failOnError: false, // Continue build even if some pages fail
    },
    routeRules: {
      "/newsletter": { prerender: false }, // Newsletter subscription needs runtime
      "/search": { prerender: false }, // Search needs runtime queries
      "/": { headers: { "Cache-Control": "s-maxage=86400" } },
    },
    compressPublicAssets: true,
  },
});
