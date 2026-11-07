import { getContent, type Lang } from "./content";
import { getCertificateFiles } from "./certificates";
import { profile } from "./data";
import { hasResumePdf } from "./files";

export type PaletteItem = {
  id: string;
  group: "sections" | "projects" | "certs" | "actions";
  label: string;
  hint?: string;
  /** href: navigate. action: run a built-in. */
  href?: string;
  external?: boolean;
  action?: "lang" | "tour" | "agents";
};

export function getPaletteItems(lang: Lang): PaletteItem[] {
  const c = getContent(lang);
  const u = c.ui;
  const clean = (s: string) => s.replace(/^\d+\s*—\s*/, "");
  const items: PaletteItem[] = [
    { id: "s-top", group: "sections", label: profile.name, href: "/#top" },
    { id: "s-work", group: "sections", label: clean(u.workLabel), href: "/#work" },
    { id: "s-stack", group: "sections", label: clean(u.stackLabel), href: "/#stack" },
    { id: "s-record", group: "sections", label: clean(u.recordLabel), href: "/#record" },
    { id: "s-about", group: "sections", label: clean(u.aboutLabel), href: "/#about" },
    { id: "s-contact", group: "sections", label: clean(u.contactLabel), href: "/#contact" },
  ];
  c.projects.forEach((p) => items.push({ id: `p-${p.slug}`, group: "projects", label: p.title, hint: u.workLabel ? clean(u.workLabel) : undefined, href: `/projects/${p.slug}` }));
  getCertificateFiles(lang).forEach((f) => items.push({ id: `c-${f.slug}`, group: "certs", label: f.title, hint: f.issuer, href: f.pdf, external: true }));
  items.push(
    { id: "a-lang", group: "actions", label: u.actLang, action: "lang" },
    { id: "a-tour", group: "actions", label: u.actTour, action: "tour" },
    { id: "a-agents", group: "actions", label: u.actAgents, action: "agents" },
    { id: "a-email", group: "actions", label: u.actEmail, href: `mailto:${profile.email}`, external: true },
    { id: "a-github", group: "actions", label: u.actGithub, href: profile.github, external: true },
    { id: "a-linkedin", group: "actions", label: u.actLinkedin, href: profile.linkedin, external: true }
  );
  if (hasResumePdf()) items.push({ id: "a-resume", group: "actions", label: u.actResume, href: profile.resumePdf, external: true });
  return items;
}
