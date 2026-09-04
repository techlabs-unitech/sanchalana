-- Sanchalana News — Gallery migration
-- Run this in the Supabase SQL Editor AFTER supabase/002_admin_and_seo.sql.
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE / ON CONFLICT throughout).

-- ============================================================
-- 1. gallery_images — one row per photo/video shown on /gallery
-- ============================================================
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,          -- public Storage URL (photo, or the video's thumbnail)
  media_type text not null default 'photo' check (media_type in ('photo', 'video')),
  video_url text,                    -- optional, only used when media_type = 'video'
  caption text,
  size text not null default '' check (size in ('', 'tall', 'wide')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.gallery_images enable row level security;

-- Anyone can read the gallery (this powers the public /gallery page).
drop policy if exists "Gallery images are publicly readable" on public.gallery_images;
create policy "Gallery images are publicly readable"
  on public.gallery_images for select
  using (true);

-- Only signed-in admins can add/reorder/remove gallery images.
drop policy if exists "Admins can insert gallery images" on public.gallery_images;
create policy "Admins can insert gallery images"
  on public.gallery_images for insert
  to authenticated
  with check (true);

drop policy if exists "Admins can update gallery images" on public.gallery_images;
create policy "Admins can update gallery images"
  on public.gallery_images for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can delete gallery images" on public.gallery_images;
create policy "Admins can delete gallery images"
  on public.gallery_images for delete
  to authenticated
  using (true);

-- ============================================================
-- 2. Storage bucket for uploaded gallery images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

drop policy if exists "Gallery images are publicly readable" on storage.objects;
create policy "Gallery images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'gallery-images');

drop policy if exists "Admins can upload gallery images" on storage.objects;
create policy "Admins can upload gallery images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery-images');

drop policy if exists "Admins can update gallery images" on storage.objects;
create policy "Admins can update gallery images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'gallery-images');

drop policy if exists "Admins can delete gallery images" on storage.objects;
create policy "Admins can delete gallery images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery-images');
