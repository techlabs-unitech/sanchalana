"use client";

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cachedClient = null;

// Used only from Client Components (e.g. the contact form, the admin
// dashboard). Returns null when Supabase hasn't been configured yet so
// callers can fail gracefully instead of throwing during local
// development/preview. Memoized so auth state is shared across every
// component that calls this, instead of each one getting its own client.
export function getSupabaseBrowserClient() {
  if (!url || !anonKey) return null;
  if (!cachedClient) cachedClient = createClient(url, anonKey);
  return cachedClient;
}
