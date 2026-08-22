import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Used from Server Components / Server Actions / route handlers. Public
// reads only need the anon key (Row Level Security enforces what's
// readable) — see supabase/schema.sql for the policies.
export function getSupabaseServerClient() {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
