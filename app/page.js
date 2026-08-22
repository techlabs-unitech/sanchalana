import { getAllNewsletters } from "@/lib/newsletters";
import HomeClient from "@/components/HomeClient";

// Server Component: pulls the 3 most recent published articles from
// Supabase (or the local fallback) so the homepage reflects whatever's
// been published from /admin, without needing a redeploy.
export default async function HomePage() {
  const items = await getAllNewsletters();
  const latestArticles = items.slice(0, 3);
  return <HomeClient latestArticles={latestArticles} />;
}
