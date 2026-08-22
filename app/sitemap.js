import { getAllNewsletters } from "@/lib/newsletters";
import { SITE_URL } from "@/lib/site";

// Served automatically at /sitemap.xml by Next.js's built-in convention.
export default async function sitemap() {
  const staticRoutes = ["", "/about", "/gallery", "/newsletter", "/contact"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const items = await getAllNewsletters();
  const articleRoutes = items.map((item) => ({
    url: `${SITE_URL}/newsletter/${item.slug}`,
    lastModified: item.updated_at || item.published_at,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes];
}
