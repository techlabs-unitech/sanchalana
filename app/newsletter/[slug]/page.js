import { notFound } from "next/navigation";
import { getAllNewsletters, getNewsletterBySlug, readMinutes } from "@/lib/newsletters";
import { excerptFrom } from "@/lib/bodyParser";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import NewsletterReader from "@/components/NewsletterReader";

// Pre-render every known issue at build time. New rows added to Supabase
// later are still served fine (Next.js falls back to on-demand rendering
// for slugs that weren't known at build time).
export async function generateStaticParams() {
  const items = await getAllNewsletters();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const newsletter = await getNewsletterBySlug(params.slug);
  if (!newsletter) return { title: "Newsletter" };

  const title = newsletter.meta_title || newsletter.title;
  const description = newsletter.meta_description || newsletter.dek || excerptFrom(newsletter.body);
  const url = `${SITE_URL}/newsletter/${newsletter.slug}`;
  const image = newsletter.cover_image_url || `${SITE_URL}/images/logo.jpg`;
  const keywords = newsletter.keywords
    ? newsletter.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    authors: [{ name: newsletter.author || SITE_NAME }],
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image }],
      publishedTime: newsletter.published_at,
      modifiedTime: newsletter.updated_at || newsletter.published_at,
      section: newsletter.tag,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function NewsletterArticlePage({ params }) {
  const newsletter = await getNewsletterBySlug(params.slug);
  if (!newsletter) notFound();
  const minutes = readMinutes(newsletter.body);

  // NewsArticle structured data — this is what makes the page eligible
  // for rich results / Google News surfaces, on top of the meta tags
  // set in generateMetadata above.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: newsletter.title,
    description: newsletter.meta_description || newsletter.dek,
    image: [newsletter.cover_image_url || `${SITE_URL}/images/logo.jpg`],
    datePublished: newsletter.published_at,
    dateModified: newsletter.updated_at || newsletter.published_at,
    author: [{ "@type": "Organization", name: newsletter.author || SITE_NAME }],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.jpg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/newsletter/${newsletter.slug}` },
    articleSection: newsletter.tag,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsletterReader newsletter={newsletter} minutes={minutes} />
    </>
  );
}
