const blobHosts = (process.env.NUXT_PUBLIC_BLOB_HOSTS || "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: process.env.NODE_ENV !== "production" },

  modules: ["@nuxt/icon", "@nuxt/ui", "@pinia/nuxt", "@nuxt/image"],

  image: {
    domains: blobHosts,
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
      apiBaseUrl: "http://localhost:5000/api",
      siteUrl: "http://localhost:3000",
      blobHosts: process.env.NUXT_PUBLIC_BLOB_HOSTS,
    },
  },

  ssr: true,
});
