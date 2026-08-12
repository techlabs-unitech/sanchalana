import { notFound } from "next/navigation";
import { getAllNewsletters, getNewsletterBySlug, readMinutes } from "@/lib/newsletters";
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
  if (!newsletter) return { title: "Newsletter | Sanchalana News" };
  return {
    title: `${newsletter.title} | Sanchalana Newsletter`,
    description: newsletter.dek,
  };
}

export default async function NewsletterArticlePage({ params }) {
  const newsletter = await getNewsletterBySlug(params.slug);
  if (!newsletter) notFound();
  const minutes = readMinutes(newsletter.body);
  return <NewsletterReader newsletter={newsletter} minutes={minutes} />;
}
