-- Sanchalana News — YouTube video migration
-- Run this in the Supabase SQL Editor AFTER supabase/002_admin_and_seo.sql.
-- Safe to re-run (uses IF NOT EXISTS throughout).

alter table public.newsletters
  add column if not exists youtube_url text;
