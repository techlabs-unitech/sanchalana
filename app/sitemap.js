import { getAllNewsletters } from "@/lib/newsletters";
import { getAllGalleryImages } from "@/lib/gallery";
import { SITE_URL } from "@/lib/site";

// Served automatically at /sitemap.xml by Next.js's built-in convention.
export default async function sitemap() {
  const galleryImages = await getAllGalleryImages();

  const staticRoutes = ["", "/about", "/gallery", "/newsletter", "/contact"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
    // Google's image sitemap extension — lets gallery photos get indexed
    // and surfaced in Google Images even though the gallery itself is one
    // URL. Next.js includes this automatically when present.
    ...(path === "/gallery" && galleryImages.length > 0
      ? { images: galleryImages.map((img) => img.image_url) }
      : {}),
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
