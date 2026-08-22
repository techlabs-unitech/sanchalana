// Central place for the site's public URL, used for canonical links,
// Open Graph/Twitter tags, JSON-LD, and the sitemap. Set
// NEXT_PUBLIC_SITE_URL in your environment once you have a real domain
// (Vercel also auto-provides one, see the README) — falls back to a
// placeholder so nothing crashes before that's set.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://sanchalananews.com").replace(/\/$/, "");
export const SITE_NAME = "Sanchalana News";
