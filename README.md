# Aymane Fakihi — Portfolio

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · lucide-react · next/font

## Run

```bash
npm install
npm run dev
# open http://localhost:3000/?agents=on   (Chrome)
```

## Controls

| Key | Action |
| --- | --- |
| `T` | Tour: reloads, waits for the hero to build, then auto-scrolls the whole site (Esc or any scroll stops it) |
| `A` | Agents on / off (saved in localStorage) |
| `P` | Pause / resume |

`?agents=on` forces the animation (even with reduced motion), `?agents=off` turns it off.

| `S` | Sound on / off (soft blips while the robots build; off by default) |

The language switch (EN / FR) is in the top bar. Hovering near an idle robot cursor makes it step aside.

## Content

All text lives in `lib/data.ts` (taken from resume.md). Replace `public/headshot.png` and `public/aymane_fakihi.pdf` to update the photo / resume.
If either file is missing, the hero shows a silhouette / the download button is hidden.

## Contact form

The form posts to `/api/contact`, which sends the message to your inbox with [Resend](https://resend.com) (free tier).
Add these environment variables (locally in `.env.local`, on Vercel under Project → Settings → Environment Variables):

```
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO=faymane12@gmail.com      # optional, defaults to the email in lib/data.ts
CONTACT_FROM="Portfolio <onboarding@resend.dev>"   # optional
NEXT_PUBLIC_SITE_URL=https://your-domain.com       # optional, used for the social preview image
```

Without `RESEND_API_KEY` the form falls back to opening the visitor's mail app.

## Deploy free on Vercel

1. Push this folder to a GitHub repository.
2. Go to vercel.com → Add New → Project → import the repo.
3. Keep the defaults (Framework: Next.js) and click Deploy.

Or with the CLI: `npm i -g vercel && vercel --prod`.

Add a custom domain in Vercel under Project → Settings → Domains and follow the DNS steps. Vercel Analytics is already wired in: enable it in the project's Analytics tab.

## v5 additions

| Feature | How it works |
| --- | --- |
| **Command palette** | `Ctrl/⌘ + K` or `/` (or the Search button in the dock). Sections, projects, certificates, actions. Arrow keys + Enter, Esc closes. |
| **Resume viewer** | "View resume" opens an in-page preview (`public/resume-preview.webp`) with a download button. Hidden if the preview or the PDF is missing. |
| **Book a call** | Set `NEXT_PUBLIC_BOOKING_URL` (Calendly, Cal.com…). Unset → the button is hidden. |
| **Project screenshots** | Drop `public/projects/<slug>.webp` (or `.png/.jpg`) — e.g. `public/projects/interniq.png`. Shown on the case-study page; hidden if no file. |
| **Live status dots** | `/api/status` checks each live URL (cached 1 h). Only a clear online / 404 / 5xx result shows a dot; anything unclear shows nothing. |
| **Latest on GitHub** | Public, non-fork repos from the GitHub API (cached 1 h). Hidden if the API is unreachable. |
| **Right now strip** | Edit `currently` in `lib/content.ts` (EN + FR). |
| **Testimonials** | Add `{ quote, name, role }` objects to `testimonials` in `lib/data.ts`. Empty → section hidden. Only add real quotes. |
| **404 page, sitemap, robots, social card** | `app/not-found.tsx`, `app/sitemap.ts`, `app/robots.ts`, `public/og.jpg`.  |
| **Easter egg** | Konami code (↑ ↑ ↓ ↓ ← → ← → B A) sends the robots roaming for a few seconds (when agents are on). |
| **Checks** | `npm run check` = typecheck + data tests (11 projects, case studies in EN/FR, certificate files exist, no phone numbers in source, EN/FR key parity). |

Set `NEXT_PUBLIC_SITE_URL` to your final domain (e.g. `https://aymanefakihi.com`) in Vercel so the sitemap, canonical and social-card URLs are correct.
