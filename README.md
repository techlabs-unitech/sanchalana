# Sanchalana News — Next.js + Supabase + Vercel

Same design as the static build, rebuilt on:
- **Next.js 14** (App Router) — pages, routing, image optimization
- **Supabase** — newsletter content (Postgres) + contact form submissions
- **Vercel** — hosting/deploy target

Nothing about the visual design changed: same fonts, same blue/navy/red
palette pulled from your logo, same dark/light toggle, same Kannada-default
language switcher, same ticker, WhatsApp FAB, and the newsletter reader's
locked theme / reading time / read-aloud behaviour.

## What's different from the static version

| | Static site | This version |
|---|---|---|
| Pages | 5 separate `.html` files | Next.js routes (`app/*/page.js`) |
| Newsletter issues | Hand-written `.html` files | Rows in a Supabase table, rendered dynamically |
| Contact form | Demo only (didn't send anywhere) | Real submit → Supabase `messages` table |
| Theme/language | In-memory only (reset on refresh) | Persisted in `localStorage` |
| Adding a new newsletter issue | Create a new `.html` file | Insert a row in Supabase — no redeploy needed |

## 1. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. **It works immediately without Supabase** —
every page (including the 4 sample newsletter issues) is served from a
local fallback dataset in `lib/newsletters-data.js` so you can see the
whole site before setting anything up. The contact form will tell you
Supabase isn't connected yet if you try to submit it at this stage.

## 2. Connect Supabase

1. Create a project at https://supabase.com/dashboard (free tier is fine).
2. Open **SQL Editor → New query**, paste the contents of
   `supabase/schema.sql`, and run it. This creates:
   - `newsletters` — one row per issue, each served at `/newsletter/<slug>`
   - `messages` — contact form submissions
   - Row Level Security policies (public read on newsletters, insert-only
     on messages — nobody but you can read other people's messages)
   - The same 4 sample issues shown in the demo, so the site output
     doesn't change the moment you connect it
3. Go to **Project Settings → API** and copy the **Project URL** and the
   **anon public** key.
4. Copy `.env.example` to `.env.local` and fill them in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Restart `npm run dev`. The site now reads/writes real Supabase data.

### Publishing a new newsletter issue

No code changes needed — open **Table Editor → newsletters** in Supabase
and insert a row:

- `slug` — becomes the URL: `/newsletter/<slug>`
- `tag`, `title`, `dek`, `published_at`, `cover_icon` (`droplet` / `pin` /
  `trophy` / `signal` / `camera`)
- `body` — a JSON array of blocks, e.g.
  ```json
  [
    {"type": "p", "text": "First paragraph..."},
    {"type": "h2", "text": "A subheading"},
    {"type": "quote", "text": "A pull quote"},
    {"type": "p", "text": "More text..."}
  ]
  ```

Reading time is computed automatically from the word count in `body`.

### Reading contact messages

They land in **Table Editor → messages** in the Supabase dashboard. There's
no public read access by design (RLS only allows public *insert*) — build
an authenticated admin view later if you want one in-app.

## 3. Deploy to Vercel

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. Go to https://vercel.com/new and import the repo (or run `npx vercel`
   from this folder if you prefer the CLI).
3. In the Vercel project's **Settings → Environment Variables**, add the
   same two variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Vercel auto-detects Next.js — no build config needed.

Every subsequent `git push` redeploys automatically. Newsletter issues,
though, update live the moment you add a row in Supabase — no redeploy
required for those.

## Project structure

```
app/
  layout.js              Root layout, wraps everything in SiteProvider
  globals.css             Full design system (ported 1:1 from the static site)
  page.js                 Home
  about/page.js
  gallery/page.js
  contact/page.js
  newsletter/page.js      Listing — Server Component, fetches from Supabase
  newsletter/[slug]/page.js   Reader — Server Component + generateStaticParams
  api/contact/route.js    POST handler, inserts into Supabase `messages`
components/               Header, Footer, WhatsAppFab, icons, reader widgets
context/SiteContext.js    Theme + language state (persisted to localStorage)
lib/
  dictionary.js           Kannada/English UI translations
  newsletters.js          Data-access layer (Supabase, with local fallback)
  newsletters-data.js     The local fallback content
  supabase/client.js      Browser Supabase client
  supabase/server.js      Server Supabase client
supabase/schema.sql       Tables, RLS policies, and seed data
```

## Notes / known limitations (same as the static version)

- Video/article/gallery placeholders are still placeholders — swap the
  `<div className="video-box">` / `.img-placeholder` blocks for real
  `<iframe>` embeds or Supabase Storage images whenever you have them.
- Newsletter *article bodies* are Kannada-only, same as before — only the
  page chrome (nav, footer, buttons, dates) is translated when you switch
  to English.
- Read-aloud uses the browser's built-in Web Speech API. Kannada voice
  availability depends on the reader's browser/OS, not on this app.
