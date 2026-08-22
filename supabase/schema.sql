-- Sanchalana News — Supabase schema
-- Run this in your Supabase project's SQL Editor (Dashboard -> SQL Editor -> New query)
-- after creating a new project at https://supabase.com/dashboard.

-- ============================================================
-- 1. newsletters — one row per issue, each served at /newsletter/<slug>
-- ============================================================
create table if not exists public.newsletters (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  tag text not null,
  title text not null,
  dek text not null,
  published_at date not null default current_date,
  cover_icon text not null default 'camera', -- one of: droplet, pin, trophy, signal, camera
  body jsonb not null default '[]'::jsonb,     -- array of { type: "p" | "h2" | "quote", text: "..." }
  created_at timestamptz not null default now()
);

alter table public.newsletters enable row level security;

-- Anyone can read published newsletters (this powers the public site).
create policy "Newsletters are publicly readable"
  on public.newsletters for select
  using (true);

-- No public inserts/updates/deletes — manage issues from the Supabase
-- Table Editor, or add an authenticated admin policy of your own later.

-- ============================================================
-- 2. messages — submissions from the Contact page form
-- ============================================================
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- The public can only INSERT (submit the form) — never read other
-- people's messages back. Read them from the Supabase Table Editor,
-- or build an authenticated admin view later.
create policy "Anyone can submit a contact message"
  on public.messages for insert
  with check (true);

-- ============================================================
-- 3. Seed data — matches the 4 sample issues shipped in the UI
-- ============================================================
insert into public.newsletters (slug, tag, title, dek, published_at, cover_icon, body) values
(
  'jala-sampanmoola-yojane',
  'ರಾಜ್ಯ',
  'ಜಲಸಂಪನ್ಮೂಲ ಯೋಜನೆಗೆ ಸರ್ಕಾರದ ಒಪ್ಪಿಗೆ',
  'ರಾಜ್ಯದ ಬರಪೀಡಿತ ಪ್ರದೇಶಗಳಿಗೆ ಅನುಕೂಲವಾಗುವಂತೆ ಹೊಸ ಜಲಸಂಪನ್ಮೂಲ ಯೋಜನೆಗೆ ಸಂಪುಟ ಸಭೆಯಲ್ಲಿ ಅಂಗೀಕಾರ ದೊರೆತಿದೆ.',
  '2026-08-06',
  'droplet',
  '[
    {"type":"p","text":"ರಾಜ್ಯದ ಬರಪೀಡಿತ ಪ್ರದೇಶಗಳಿಗೆ ಶಾಶ್ವತ ಪರಿಹಾರ ಒದಗಿಸುವ ಗುರಿಯೊಂದಿಗೆ ಸರ್ಕಾರ ಹೊಸ ಜಲಸಂಪನ್ಮೂಲ ಯೋಜನೆಗೆ ಅಂಗೀಕಾರ ನೀಡಿದೆ."},
    {"type":"p","text":"ಈ ಯೋಜನೆಯಡಿ ಒಟ್ಟು 12 ಜಿಲ್ಲೆಗಳ 40ಕ್ಕೂ ಹೆಚ್ಚು ತಾಲೂಕುಗಳಿಗೆ ಕುಡಿಯುವ ನೀರು ಮತ್ತು ನೀರಾವರಿ ಸೌಲಭ್ಯ ಒದಗಿಸಲಾಗುವುದು."},
    {"type":"h2","text":"ಯೋಜನೆಯ ಪ್ರಮುಖ ಅಂಶಗಳು"},
    {"type":"p","text":"ಜಲಾಶಯಗಳ ಮರುಪೂರಣ, ಕಾಲುವೆ ಜಾಲದ ಆಧುನೀಕರಣ ಮತ್ತು ಹನಿ ನೀರಾವರಿ ಪದ್ಧತಿಯ ಪ್ರೋತ್ಸಾಹ ಈ ಯೋಜನೆಯ ಮೂರು ಮುಖ್ಯ ಆಧಾರಸ್ತಂಭಗಳಾಗಿವೆ."},
    {"type":"quote","text":"ಈ ಯೋಜನೆ ಕೇವಲ ಮೂಲಸೌಕರ್ಯವಲ್ಲ, ಇದು ಲಕ್ಷಾಂತರ ರೈತ ಕುಟುಂಬಗಳ ಭವಿಷ್ಯದ ಪ್ರಶ್ನೆ."},
    {"type":"p","text":"ಪ್ರತಿಪಕ್ಷಗಳು ಯೋಜನೆಯ ಅನುಷ್ಠಾನದ ವೇಗದ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಎತ್ತಿದ್ದು, ಸಂಚಲನ ನ್ಯೂಸ್ ಈ ಯೋಜನೆಯ ಪ್ರಗತಿಯನ್ನು ನಿರಂತರವಾಗಿ ವರದಿ ಮಾಡಲಿದೆ."}
  ]'::jsonb
),
(
  'metro-marga-udghatane',
  'ರಾಜ್ಯ',
  'ಬೆಂಗಳೂರಿನಲ್ಲಿ ಹೊಸ ಮೆಟ್ರೋ ಮಾರ್ಗ ಉದ್ಘಾಟನೆ',
  'ನಗರದ ಸಂಚಾರ ದಟ್ಟಣೆ ತಗ್ಗಿಸುವ ಗುರಿಯೊಂದಿಗೆ ಬಹುನಿರೀಕ್ಷಿತ ಮೆಟ್ರೋ ಮಾರ್ಗ ಇಂದು ಸಾರ್ವಜನಿಕ ಸೇವೆಗೆ ಮುಕ್ತಗೊಂಡಿದೆ.',
  '2026-08-04',
  'pin',
  '[
    {"type":"p","text":"ಬೆಂಗಳೂರಿನ ಸಂಚಾರ ದಟ್ಟಣೆಗೆ ಪರಿಹಾರ ಒದಗಿಸುವ ನಿಟ್ಟಿನಲ್ಲಿ ಬಹುನಿರೀಕ್ಷಿತ ಹೊಸ ಮೆಟ್ರೋ ಮಾರ್ಗ ಇಂದು ಅಧಿಕೃತವಾಗಿ ಲೋಕಾರ್ಪಣೆಗೊಂಡಿತು."},
    {"type":"p","text":"ಸುಮಾರು 18 ಕಿ.ಮೀ. ಉದ್ದದ ಈ ಮಾರ್ಗ 14 ನಿಲ್ದಾಣಗಳನ್ನು ಒಳಗೊಂಡಿದ್ದು, ನಿತ್ಯ 3 ಲಕ್ಷಕ್ಕೂ ಹೆಚ್ಚು ಪ್ರಯಾಣಿಕರಿಗೆ ಅನುಕೂಲವಾಗುವ ನಿರೀಕ್ಷೆ ಇದೆ."},
    {"type":"h2","text":"ಪ್ರಯಾಣಿಕರಿಗೆ ಅನುಕೂಲಗಳು"},
    {"type":"p","text":"ಎಲ್ಲಾ ನಿಲ್ದಾಣಗಳಲ್ಲಿ ಎಲಿವೇಟರ್, ಎಸ್ಕಲೇಟರ್ ಮತ್ತು ದಿವ್ಯಾಂಗ ಸ್ನೇಹಿ ಸೌಲಭ್ಯಗಳನ್ನು ಅಳವಡಿಸಲಾಗಿದೆ."},
    {"type":"quote","text":"ಈ ಮಾರ್ಗ ನಗರದ ಪೂರ್ವ-ದಕ್ಷಿಣ ಸಂಪರ್ಕವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಬದಲಿಸಲಿದೆ."},
    {"type":"p","text":"ಮುಂದಿನ ಹಂತದಲ್ಲಿ ವಿಮಾನ ನಿಲ್ದಾಣದವರೆಗಿನ ವಿಸ್ತರಣೆ ಕಾಮಗಾರಿ ಆರಂಭವಾಗಲಿದ್ದು, 2028ರ ವೇಳೆಗೆ ಪೂರ್ಣಗೊಳ್ಳುವ ಗುರಿ ಹೊಂದಲಾಗಿದೆ."}
  ]'::jsonb
),
(
  'kpl-final-highlights',
  'ಕ್ರೀಡೆ',
  'ಕರ್ನಾಟಕ ಪ್ರೀಮಿಯರ್ ಲೀಗ್ ಫೈನಲ್ ಹೈಲೈಟ್ಸ್',
  'ರೋಚಕ ಫೈನಲ್ ಪಂದ್ಯದಲ್ಲಿ ಕೊನೆಯ ಓವರ್‌ನಲ್ಲಿ ನಿರ್ಧಾರವಾದ ಗೆಲುವು — ಪಂದ್ಯದ ಸಂಪೂರ್ಣ ವಿಶ್ಲೇಷಣೆ.',
  '2026-08-02',
  'trophy',
  '[
    {"type":"p","text":"ಕರ್ನಾಟಕ ಪ್ರೀಮಿಯರ್ ಲೀಗ್‌ನ ಫೈನಲ್ ಪಂದ್ಯ ಕೊನೆಯ ಓವರ್‌ವರೆಗೂ ರೋಚಕತೆ ಉಳಿಸಿಕೊಂಡಿತು."},
    {"type":"p","text":"ಗುರಿ ಬೆನ್ನಟ್ಟಿದ ತಂಡ ಕೊನೆಯ ಎಸೆತದವರೆಗೂ ಹೋರಾಟ ನಡೆಸಿ, ಕೊನೆಯ ಓವರ್‌ನಲ್ಲಿ ಅಗತ್ಯವಿದ್ದ 9 ರನ್‌ಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ ಪಂದ್ಯವನ್ನು ತನ್ನದಾಗಿಸಿಕೊಂಡಿತು."},
    {"type":"h2","text":"ಪಂದ್ಯದ ಪ್ರಮುಖ ಕ್ಷಣಗಳು"},
    {"type":"p","text":"ಆರಂಭಿಕ ಆಟಗಾರನ ಅರ್ಧಶತಕ ಮತ್ತು ಕೊನೆಯ ಹಂತದಲ್ಲಿ ಆಲ್‌ರೌಂಡರ್‌ನ ವೇಗದ ಬ್ಯಾಟಿಂಗ್ ಪಂದ್ಯದ ಫಲಿತಾಂಶವನ್ನು ನಿರ್ಧರಿಸಿತು."},
    {"type":"quote","text":"ಇದು ನನ್ನ ವೃತ್ತಿಜೀವನದ ಅತ್ಯುತ್ತಮ ಫೈನಲ್‌ಗಳಲ್ಲಿ ಒಂದು."},
    {"type":"p","text":"ಮುಂದಿನ ಋತುವಿನ ಕೆಪಿಎಲ್ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಶೀಘ್ರದಲ್ಲೇ ಪ್ರಕಟಿಸಲಾಗುವುದು ಎಂದು ಸಂಘಟಕರು ತಿಳಿಸಿದ್ದಾರೆ."}
  ]'::jsonb
),
(
  'digital-india-gramina',
  'ರಾಷ್ಟ್ರೀಯ',
  'ಡಿಜಿಟಲ್ ಇಂಡಿಯಾ — ಗ್ರಾಮೀಣ ಭಾಗದಲ್ಲಿ ಪ್ರಗತಿ',
  'ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಲ್ಲಿ ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಮತ್ತು ಡಿಜಿಟಲ್ ಸೇವೆಗಳ ವಿಸ್ತರಣೆಯ ಕುರಿತ ವಿಶೇಷ ವರದಿ.',
  '2026-07-30',
  'signal',
  '[
    {"type":"p","text":"ಕೇಂದ್ರ ಸರ್ಕಾರದ ಡಿಜಿಟಲ್ ಇಂಡಿಯಾ ಯೋಜನೆಯಡಿ ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಲ್ಲಿ ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಗಣನೀಯವಾಗಿ ಹೆಚ್ಚಿದೆ."},
    {"type":"p","text":"ಗ್ರಾಮ ಪಂಚಾಯತಿಗಳಲ್ಲಿ ಸ್ಥಾಪಿಸಲಾದ ಸಾಮಾನ್ಯ ಸೇವಾ ಕೇಂದ್ರಗಳು (CSC) ಈ ಪ್ರಗತಿಗೆ ಪ್ರಮುಖ ಕಾರಣವಾಗಿವೆ."},
    {"type":"h2","text":"ಸವಾಲುಗಳು ಇನ್ನೂ ಇವೆ"},
    {"type":"p","text":"ಆದರೂ, ಗುಡ್ಡಗಾಡು ಮತ್ತು ಅರಣ್ಯ ಪ್ರದೇಶಗಳಲ್ಲಿ ನೆಟ್‌ವರ್ಕ್ ಸಮಸ್ಯೆ ಮುಂದುವರಿದಿದೆ ಎಂದು ವರದಿ ಗಮನಿಸಿದೆ."},
    {"type":"quote","text":"ಸಂಪರ್ಕ ಒದಗಿಸುವುದು ಮಾತ್ರವಲ್ಲ, ಬಳಕೆಯ ಕೌಶಲ್ಯ ಕಲಿಸುವುದೂ ಅಷ್ಟೇ ಮುಖ್ಯ."},
    {"type":"p","text":"ಮುಂದಿನ ಹಂತದಲ್ಲಿ ಡಿಜಿಟಲ್ ಸಾಕ್ಷರತಾ ಶಿಬಿರಗಳನ್ನು ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಆಯೋಜಿಸುವ ಯೋಜನೆ ಇದೆ."}
  ]'::jsonb
)
on conflict (slug) do nothing;
