-- Sanchalana News — Admin dashboard + SEO migration
-- Run this in the Supabase SQL Editor AFTER supabase/schema.sql.
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE / ON CONFLICT throughout).

-- ============================================================
-- 1. New columns on newsletters: SEO fields + real cover images
-- ============================================================
alter table public.newsletters
  add column if not exists meta_title text,
  add column if not exists meta_description text,
  add column if not exists keywords text,
  add column if not exists cover_image_url text,
  add column if not exists author text not null default 'Sanchalana News',
  add column if not exists updated_at timestamptz not null default now();

-- Keep updated_at current on every edit (used for the sitemap's lastModified too).
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists newsletters_set_updated_at on public.newsletters;
create trigger newsletters_set_updated_at
  before update on public.newsletters
  for each row execute function public.set_updated_at();

-- ============================================================
-- 2. Write access for signed-in admins (reads stay public)
-- ============================================================
-- Anyone signed in via Supabase Auth counts as an admin for this project
-- (there's no public sign-up — you create admin accounts by hand in the
-- Supabase dashboard, see the README). If you later want per-user roles,
-- swap `auth.role() = 'authenticated'` below for a check against a
-- separate `admins` table keyed by auth.uid().

drop policy if exists "Admins can insert newsletters" on public.newsletters;
create policy "Admins can insert newsletters"
  on public.newsletters for insert
  to authenticated
  with check (true);

drop policy if exists "Admins can update newsletters" on public.newsletters;
create policy "Admins can update newsletters"
  on public.newsletters for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can delete newsletters" on public.newsletters;
create policy "Admins can delete newsletters"
  on public.newsletters for delete
  to authenticated
  using (true);

-- Let admins read contact messages from inside the app too (previously
-- Table Editor was the only way to see them).
drop policy if exists "Admins can read messages" on public.messages;
create policy "Admins can read messages"
  on public.messages for select
  to authenticated
  using (true);

-- ============================================================
-- 3. Storage bucket for uploaded cover images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('article-covers', 'article-covers', true)
on conflict (id) do nothing;

drop policy if exists "Cover images are publicly readable" on storage.objects;
create policy "Cover images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'article-covers');

drop policy if exists "Admins can upload cover images" on storage.objects;
create policy "Admins can upload cover images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'article-covers');

drop policy if exists "Admins can update cover images" on storage.objects;
create policy "Admins can update cover images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'article-covers');

drop policy if exists "Admins can delete cover images" on storage.objects;
create policy "Admins can delete cover images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'article-covers');
