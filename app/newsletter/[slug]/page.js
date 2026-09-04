import { notFound } from "next/navigation";
import { getAllNewsletters, getNewsletterBySlug, readMinutes } from "@/lib/newsletters";
import { excerptFrom } from "@/lib/bodyParser";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import NewsletterReader from "@/components/NewsletterReader";

// Articles can be edited from /admin after publishing (title, body, cover
// image, SEO fields...) — fetch fresh on every request instead of serving
// the static build-time snapshot, so edits show up immediately rather than
// only after the next deploy.
export const revalidate = 0;

// Pre-render every known issue's params at build time so routing works
// offline/at build; the page content itself is still fetched fresh per
// request because of `revalidate = 0` above. New rows added to Supabase
// later are still served fine either way.
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
