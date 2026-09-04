import { SITE_URL } from "@/lib/site";

// Served automatically at /robots.txt by Next.js's built-in convention.
export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
