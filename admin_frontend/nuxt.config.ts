// frontend/nuxt.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: process.env.NODE_ENV !== "production" },

  modules: ["@nuxt/icon", "@pinia/nuxt", "@vite-pwa/nuxt", "@nuxt/eslint"],

  css: ["~/assets/css/main.css"],

  routeRules: {
    "/": { redirect: "/dashboard" },
  },

  // Light mode only (grayscale-first UI, no dark variant): there are no
  // dark: utilities anywhere, so Tailwind's default dark behavior stays
  // inert. The legacy tailwind.config.js bridge has been deleted.

  vite: {
    // Tailwind CSS v4 is wired directly through its Vite plugin now that
    // @nuxt/ui (which used to provide this wiring) is fully removed.
    plugins: [tailwindcss()],
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Chapel of Praise Admin",
      short_name: "COP Admin",
      description: "Administrative system for Chapel of Praise",
      theme_color: "#101319",
      background_color: "#f6f7f9",
      display: "standalone", // This hides the browser URL bar to make it look like a native app
      orientation: "portrait",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable", // Crucial for Android home screen icons
        },
      ],
    },
    workbox: {
      // This tells the service worker to cache ALL your JS, CSS, and HTML for offline use
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      // Increase the file size limit to 3MB just in case your bundled assets get large
      maximumFileSizeToCacheInBytes: 3000000,

      // NEW: The magic rule that fixes the "You're offline" screen
      navigateFallback: "/",
      // NEW: Ensures query parameters (like ?event=123) don't break the offline cache
      ignoreURLParametersMatching: [/.*/],
    },
    devOptions: {
      enabled: process.env.NODE_ENV !== "production", // Lets you test the PWA locally
      type: "module",
    },
  },

  // Centralized API access linking to your Express backend
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || "http://localhost:5000/api",
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    },
  },

  ssr: false,
});
