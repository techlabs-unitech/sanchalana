-- Sanchalana News — Gallery SEO migration
-- Run this in the Supabase SQL Editor AFTER supabase/004_gallery.sql.
-- Safe to re-run (uses IF NOT EXISTS throughout).

-- Descriptive alt text is what search engines (and screen readers) use to
-- understand an image — separate from `caption`, which is the short label
-- shown on-page. The admin upload form requires it for new items.
alter table public.gallery_images
  add column if not exists alt_text text;
