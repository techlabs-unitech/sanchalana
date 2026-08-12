"use client";

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Used only from Client Components (e.g. the contact form). Returns null
// when Supabase hasn't been configured yet so callers can fail gracefully
// instead of throwing during local development/preview.
export function getSupabaseBrowserClient() {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}
