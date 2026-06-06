import { chapters } from "../lib/chapters";

const siteUrl = "https://stopcallingitgreen.org";

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about/", priority: "0.6", changefreq: "monthly" }
];

const chapterPages = chapters.map((chapter) => ({
  path: `/chapters/${chapter.slug}/`,
  priority: chapter.slug === "introduction" ? "0.9" : "0.8",
  changefreq: "monthly"
}));

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export function GET() {
  const urls = [...staticPages, ...chapterPages]
    .map(
      (page) => `  <url>
    <loc>${escapeXml(new URL(page.path, siteUrl).toString())}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
