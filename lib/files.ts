import fs from "node:fs";
import path from "node:path";

const pub = (f: string) => fs.existsSync(path.join(process.cwd(), "public", f));

/** headshot.png missing → the hero shows a dark silhouette placeholder. */
export const hasHeadshot = () => pub("headshot.png");
/** aymane_fakihi.pdf missing → the resume download button is hidden. */
export const hasResumePdf = () => pub("aymane_fakihi.pdf");

/** Optional project screenshot: drop public/projects/<slug>.webp (or .png / .jpg) and it appears on that case-study page. */
export function projectImage(slug: string): string | null {
  for (const ext of ["webp", "png", "jpg", "jpeg"]) {
    if (pub(`projects/${slug}.${ext}`)) return `/projects/${slug}.${ext}`;
  }
  return null;
}

/** Redacted preview image of the resume (no phone number) used by the in-page viewer. */
export const hasResumePreview = () => pub("resume-preview.webp");
