import tailwindcss from "@tailwindcss/vite";

const blobHosts = (process.env.NUXT_PUBLIC_BLOB_HOSTS || "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const cachedPage = (maxAge, staleMaxAge) => ({
  cache: {
    maxAge,
    swr: true,
    staleMaxAge,
  },
  headers: {
    vary: "Accept-Encoding",
  },
});

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: process.env.NODE_ENV !== "production" },

  experimental: {
    payloadExtraction: false,
  },

  modules: [
    "@nuxt/icon",
    "@pinia/nuxt",
    "@nuxt/image",
    "h3-compression/nuxt",
  ],

  icon: {
    serverBundle: {
      collections: ["heroicons"],
    },
    clientBundle: {
      scan: false,
    },
  },

  image: {
    domains: blobHosts,
    densities: [1],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  hooks: {
    "build:manifest": (manifest) => {
      for (const entry of Object.values(manifest)) {
        if (!Array.isArray(entry.assets)) continue;

        entry.assets = entry.assets.filter(
          (asset) => !/\.(?:avif|webp|png|jpe?g|gif|svg)$/i.test(asset),
        );
      }
    },
  },

  compression: {
    threshold: 1024,
  },

  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  routeRules: {
    "/": cachedPage(60, 300),
    "/about": cachedPage(300, 600),
    "/academic-hub": cachedPage(300, 600),
    "/become-a-worker": cachedPage(300, 600),
    "/biodata": cachedPage(300, 600),
    "/contact": cachedPage(300, 600),
    "/counselling": cachedPage(300, 600),
    "/events-calendar": cachedPage(60, 300),
    "/giving": cachedPage(300, 600),
    "/leadership": cachedPage(300, 600),
    "/ministries": cachedPage(300, 600),
    "/prayer": cachedPage(300, 600),
    "/**": {
      headers: {
        vary: "Accept-Encoding",
      },
    },
    "/_ipx/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
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

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      title: "Chapel of Praise | McPherson University Chapel",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Chapel of Praise is a vibrant campus church at McPherson University, raising a generation of champions who shine the gospel light.",
        },
        { name: "theme-color", content: "#a82a2a" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Chapel of Praise" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      link: [
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: "/fonts/inter-latin-wght-normal.woff2",
          crossorigin: "anonymous",
        },
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: "/fonts/anton-latin-400-normal.woff2",
          crossorigin: "anonymous",
        },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "",
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      blobHosts: process.env.NUXT_PUBLIC_BLOB_HOSTS,
    },
  },

  ssr: true,
});
