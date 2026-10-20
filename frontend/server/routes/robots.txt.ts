export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const siteUrl = String(config.public.siteUrl || "").replace(/\/$/, "");

  setHeader(event, "Content-Type", "text/plain; charset=utf-8");

  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /biodata",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
});
