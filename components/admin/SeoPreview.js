"use client";

import { SITE_URL } from "@/lib/site";

// A rough approximation of how the article will look in Google search
// results, so the admin can tune the meta title/description before
// publishing rather than finding out after Google has already crawled it.
export default function SeoPreview({ slug, metaTitle, metaDescription }) {
  const url = `${SITE_URL}/newsletter/${slug || "your-article-slug"}`;
  const title = metaTitle || "Your article title will appear here";
  const desc = metaDescription || "Your meta description will appear here — aim for 120–155 characters.";

  return (
    <div className="admin-seo-preview">
      <div className="g-url">{url}</div>
      <div className="g-title">{title}</div>
      <div className="g-desc">{desc}</div>
    </div>
  );
}
