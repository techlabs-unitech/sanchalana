import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Used from Server Components / Server Actions / route handlers.
export function getSupabaseServerClient() {
  if (!url || !anonKey) {
    console.error("Gallery: Supabase server client is not configured.");
    return null;
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
