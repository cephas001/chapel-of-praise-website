export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },

  // 1. Add the module here
  modules: ["@nuxt/icon", "@nuxt/ui", "@pinia/nuxt", "@nuxt/image"],

  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost:5000/api",
    },
  },

  ssr: false,
});
