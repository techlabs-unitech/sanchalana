# Sanchalana News — Next.js + Supabase + Vercel

Same design as the static build, rebuilt on:
- **Next.js 14** (App Router) — pages, routing, image optimization
- **Supabase** — article content (Postgres + Storage + Auth) and contact form submissions
- **Vercel** — hosting/deploy target

Nothing about the visual design changed: same fonts, same blue/navy/red
palette pulled from your logo, same dark/light toggle, same Kannada-default
language switcher, same ticker, WhatsApp FAB, and the newsletter reader's
locked theme / reading time / read-aloud behaviour.

## What's different from the static version

| | Static site | This version |
|---|---|---|
| Pages | 5 separate `.html` files | Next.js routes (`app/*/page.js`) |
| Articles | Hand-written `.html` files | Rows in Supabase, written from `/admin` |
| Publishing | Create/edit a `.html` file, redeploy | Fill in a form at `/admin` — live immediately, no redeploy |
| SEO | Static meta tags only | Per-article title/description/keywords, Open Graph + Twitter cards, `NewsArticle` JSON-LD, `sitemap.xml`, `robots.txt` |
| Contact form | Demo only (didn't send anywhere) | Real submit → Supabase `messages` table |
| Theme/language | In-memory only (reset on refresh) | Persisted in `localStorage` |

## 1. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. **It works immediately without Supabase** —
every page (including the 4 sample articles) is served from a local
fallback dataset in `lib/newsletters-data.js` so you can see the whole
site before setting anything up. The contact form and `/admin` dashboard
will both tell you plainly that Supabase isn't connected yet if you try
them at this stage, rather than failing silently.

## 2. Connect Supabase

1. Create a project at https://supabase.com/dashboard (free tier is fine).
2. Open **SQL Editor → New query**, paste the contents of
   `supabase/schema.sql`, and run it. Then do the same with
   `supabase/002_admin_and_seo.sql`. Together these create:
   - `newsletters` — one row per article, each served at `/newsletter/<slug>`
   - `messages` — contact form submissions
   - The SEO columns (`meta_title`, `meta_description`, `keywords`,
     `cover_image_url`, `author`, `updated_at`)
   - A public `article-covers` Storage bucket for uploaded cover images
   - Row Level Security policies: anyone can *read* articles; only a
     signed-in admin can insert/update/delete them or upload images;
     anyone can *submit* a contact message, but only a signed-in admin
     can read them back
   - The same 4 sample articles shown in the demo, so the site's output
     doesn't change the moment you connect it
3. Go to **Project Settings → API** and copy the **Project URL** and the
   **anon public** key.
4. Copy `.env.example` to `.env.local` and fill them in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   NEXT_PUBLIC_SITE_URL=https://your-real-domain.com
   ```
   (`NEXT_PUBLIC_SITE_URL` is only used for SEO tags/sitemap — fine to
   leave as the placeholder until you have a real domain.)
5. Restart `npm run dev`. The site now reads/writes real Supabase data.

### Create your admin login

There's no public sign-up — that's intentional, so random visitors can't
create themselves an admin account. In the Supabase dashboard:

**Authentication → Users → Add user** → enter an email + password, and
check "Auto Confirm User". That's it — sign in at `/admin/login` with
those same credentials.

## 3. The admin dashboard (`/admin`)

- **`/admin`** — list of all articles, with Edit / View links
- **`/admin/articles/new`** — publish a new article
- **`/admin/articles/<slug>/edit`** — edit or delete an existing one

Each article form has two parts:

**Content** — title, URL slug (auto-generated from the title, but always
editable — Kannada titles won't auto-romanize, so set a readable slug
yourself), category tag, summary, a cover image upload (stored in
Supabase Storage), and the body text.

The body uses a tiny markdown-like syntax instead of raw JSON:
```
A plain paragraph, just written normally.

## A subheading

> A pull quote

Another paragraph.
```
Blank lines separate blocks. Reading time is then computed automatically
from the real word count.

**SEO** — meta title, meta description (with a character counter, aim
for ~120–155), optional comma-separated keywords, and a live preview of
roughly how the article will look in Google search results. Leave any of
these blank and the page falls back to the title/summary above — so SEO
fields are an optional refinement, not a requirement to publish.

Once published, every article automatically gets:
- A real `<title>`/meta description, canonical URL
- Open Graph + Twitter card tags (so links look right when shared)
- `NewsArticle` JSON-LD structured data (for Google News/rich results eligibility)
- A `sitemap.xml` entry

### Reading contact messages

Previously only visible in the Supabase Table Editor — now also readable
by any signed-in admin (see the RLS policy in `002_admin_and_seo.sql`).
There's no dashboard UI for them yet; query the `messages` table directly,
or ask to have an inbox view added to `/admin`.

## 4. Deploy to Vercel

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. Go to https://vercel.com/new and import the repo (or run `npx vercel`
   from this folder if you prefer the CLI).
3. In the Vercel project's **Settings → Environment Variables**, add the
   same variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set this to your real Vercel/custom domain)
4. Deploy. Vercel auto-detects Next.js — no build config needed.

Every subsequent `git push` redeploys automatically. Articles published
from `/admin`, though, go live immediately — no redeploy required for those.

## Project structure

```
app/
  layout.js                    Root layout: SiteProvider, site-wide SEO defaults, Organization JSON-LD
  globals.css                  Full design system (ported 1:1 from the static site) + admin styles
  sitemap.js / robots.js       Auto-generated /sitemap.xml and /robots.txt
  page.js                      Home — Server Component, pulls latest 3 articles from Supabase
  about/page.js
  gallery/page.js
  contact/page.js
  newsletter/page.js           Article listing — Server Component
  newsletter/[slug]/page.js    Article reader — SEO metadata + JSON-LD + generateStaticParams
  admin/
    layout.js                  Auth guard + admin topbar (locked to one fixed theme)
    login/page.js
    page.js                    Article list
    articles/new/page.js
    articles/[slug]/edit/page.js
  api/contact/route.js         POST handler, inserts into Supabase `messages`
components/
  admin/                       ArticleForm, CoverImageUploader, SeoPreview
  Header, Footer, WhatsAppFab, icons, reader widgets
context/
  SiteContext.js                Theme + language state (persisted to localStorage)
  AdminAuthContext.js           Supabase Auth session state for /admin
lib/
  dictionary.js                 Kannada/English UI translations
  newsletters.js                 Data-access layer (Supabase, with local fallback)
  newsletters-data.js            The local fallback content
  bodyParser.js                  Converts the admin's plain-text body <-> JSON blocks, slugify, excerpt
  site.js                        SITE_URL / SITE_NAME used across SEO tags
  supabase/client.js              Browser Supabase client (memoized)
  supabase/server.js              Server Supabase client
supabase/
  schema.sql                      Base tables + RLS + seed data
  002_admin_and_seo.sql           SEO columns, admin write policies, Storage bucket
```

## Notes / known limitations

- Video/gallery placeholders are still placeholders — swap the
  `<div className="video-box">` / `.img-placeholder` blocks for real
  `<iframe>` embeds or Storage images whenever you have them.
- The admin body editor is intentionally simple (paragraphs, `##`
  headings, `>` quotes) rather than a full rich-text editor — trades some
  formatting power for something that's easy to build on top of later.
- Read-aloud uses the browser's built-in Web Speech API. Kannada voice
  availability depends on the reader's browser/OS, not on this app.
- Any signed-in Supabase user counts as an admin (there's just no public
  sign-up). For multiple admins with different permission levels, add a
  role/`admins` table and tighten the RLS policies in
  `002_admin_and_seo.sql` accordingly.
