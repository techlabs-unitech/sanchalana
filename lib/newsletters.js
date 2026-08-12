import { getSupabaseServerClient } from "./supabase/server";
import { FALLBACK_NEWSLETTERS } from "./newsletters-data";

// Both functions are safe to call whether or not Supabase is configured:
// - No env vars yet -> serves the local FALLBACK_NEWSLETTERS so `npm run
//   dev` / `npm run build` work immediately, before you've set anything up.
// - Env vars set but the query fails for any reason -> also falls back,
//   so a Supabase outage doesn't take the newsletter section down.
// Once Supabase is configured and the `newsletters` table has rows (see
// supabase/schema.sql), those rows are what gets served.

export async function getAllNewsletters() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return FALLBACK_NEWSLETTERS;

  const { data, error } = await supabase
    .from("newsletters")
    .select("slug, tag, title, dek, published_at, cover_icon, body")
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) return FALLBACK_NEWSLETTERS;
  return data;
}

export async function getNewsletterBySlug(slug) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return FALLBACK_NEWSLETTERS.find((n) => n.slug === slug) || null;
  }

  const { data, error } = await supabase
    .from("newsletters")
    .select("slug, tag, title, dek, published_at, cover_icon, body")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return FALLBACK_NEWSLETTERS.find((n) => n.slug === slug) || null;
  }
  return data;
}

export function wordCount(body) {
  if (!Array.isArray(body)) return 0;
  return body.reduce((sum, block) => sum + (block.text ? block.text.trim().split(/\s+/).filter(Boolean).length : 0), 0);
}

export function readMinutes(body) {
  const WPM = 180; // tuned for a mixed Kannada/English news read
  return Math.max(1, Math.ceil(wordCount(body) / WPM));
}
