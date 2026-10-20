const routes = [
  "/",
  "/about",
  "/ministries",
  "/leadership",
  "/events-calendar",
  "/giving",
  "/counselling",
  "/prayer",
  "/contact",
  "/become-a-worker",
];

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const siteUrl = String(config.public.siteUrl || "").replace(/\/$/, "");

  const urls = routes
    .map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`)
    .join("\n");

  setHeader(event, "Content-Type", "application/xml; charset=utf-8");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
});
