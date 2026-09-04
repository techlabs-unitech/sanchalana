import { getSupabaseServerClient } from "./supabase/server";

// Safe to call whether or not Supabase is configured, and whether or not
// any images have been added yet — always returns an array (possibly
// empty), so callers (the /gallery page, its metadata, JSON-LD, and the
// sitemap) don't need their own fallback branching.
export async function getAllGalleryImages() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("gallery_images")
    .select("id, image_url, media_type, video_url, caption, alt_text, size, sort_order")
    .order("sort_order", { ascending: false });

  if (error || !data) return [];
  return data;
}
