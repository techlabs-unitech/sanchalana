import { getAllNewsletters, readMinutes } from "@/lib/newsletters";
import NewsletterListing from "@/components/NewsletterListing";

export const metadata = {
  title: "Newsletter | Sanchalana News",
};

// Server Component: fetches from Supabase (or the local fallback) at
// request time, computes each issue's reading time from the real word
// count, then hands off to the client component for interactive/i18n bits.
export default async function NewsletterPage() {
  const items = await getAllNewsletters();
  const withMinutes = items.map((item) => ({ ...item, minutes: readMinutes(item.body) }));
  return <NewsletterListing items={withMinutes} />;
}
