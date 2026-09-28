import { getSupabaseServerClient } from "./supabase/server";

export async function getAllGalleryImages() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    console.error("Gallery: Supabase server client is not configured.");
    return [];
  }

  const { data, error } = await supabase
    .from("gallery_images")
    .select(
      "id, image_url, media_type, video_url, caption, alt_text, size, sort_order"
    )
    .order("sort_order", { ascending: false });

  if (error) {
    console.error("Gallery Supabase query error:", error.message);
    return [];
  }

  console.log("Gallery Supabase images found:", data?.length || 0);

  return data || [];
}