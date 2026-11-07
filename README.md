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

## Content

All text lives in `lib/data.ts` (taken from resume.md). Replace `public/headshot.png` and `public/aymane_fakihi.pdf` to update the photo / resume.
If either file is missing, the hero shows a silhouette / the download button is hidden.

## Deploy free on Vercel

1. Push this folder to a GitHub repository.
2. Go to vercel.com → Add New → Project → import the repo.
3. Keep the defaults (Framework: Next.js) and click Deploy.

Or with the CLI: `npm i -g vercel && vercel --prod`.
