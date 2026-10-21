// frontend/nuxt.config.ts
import tailwindcss from "@tailwindcss/vite";

const blobHosts = (
  process.env.NUXT_PUBLIC_BLOB_HOSTS ||
  "kcf3sfmzct23gf2n.public.blob.vercel-storage.com"
)
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  spaLoadingTemplate: "spa-loading-template.html",
  devtools: { enabled: process.env.NODE_ENV !== "production" },

  modules: [
    "@nuxt/icon",
    "@nuxt/image",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
    "@nuxt/eslint",
    "h3-compression/nuxt",
  ],

  css: ["~/assets/css/main.css"],

  icon: {
    clientBundle: {
      scan: true,
    },
  },

  image: {
    domains: blobHosts,
    densities: [1],
  },

  compression: {
    threshold: 1024,
  },

  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },
  },

  // @vite-pwa/nuxt cannot inject the manifest link into Nuxt's SPA shell
  // (no index.html in the pipeline), so it is declared explicitly here.
  app: {
    head: {
      link: [
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: "/fonts/poppins-latin-400-normal.woff2",
          crossorigin: "anonymous",
        },
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: "/fonts/poppins-latin-600-normal.woff2",
          crossorigin: "anonymous",
        },
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/pwa-192x192.png" },
      ],
      meta: [
        { name: "theme-color", content: "#101319" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
      ],
    },
  },

  routeRules: {
    "/": { redirect: "/dashboard" },
    "/**": {
      headers: {
        "cache-control": "no-cache",
        vary: "Accept-Encoding",
      },
    },
    "/sw.js": {
      headers: {
        "cache-control": "no-cache",
      },
    },
    "/manifest.webmanifest": {
      headers: {
        "cache-control": "no-cache",
      },
    },
    "/images/**": {
      headers: {
        "cache-control": "public, max-age=604800",
      },
    },
    "/fonts/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
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
      // Precache only the tiny app shell and icons. JS/CSS is cached at
      // runtime after the first visit instead of downloading all route
      // chunks (over 1 MB) during the service worker install.
      globPatterns: ["**/*.{html,png,svg,ico,webmanifest}"],
      maximumFileSizeToCacheInBytes: 500000,

      navigateFallback: "/",
      ignoreURLParametersMatching: [/.*/],

      runtimeCaching: [
        {
          urlPattern: /\/_nuxt\/.*\.(?:js|css)$/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "nuxt-assets",
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
        {
          urlPattern: /\/_ipx\/.*/,
          handler: "CacheFirst",
          options: {
            cacheName: "optimized-images",
            expiration: {
              maxEntries: 120,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
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
