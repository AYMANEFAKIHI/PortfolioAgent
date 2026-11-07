import { ArrowUpRight, Download, Github, Linkedin, Mail } from "lucide-react";
import type { Content } from "@/lib/content";
import { profile } from "@/lib/data";
import { hasResumePdf } from "@/lib/files";
import ContactForm from "./ContactForm";

export default function Contact({ c }: { c: Content }) {
  const pdf = hasResumePdf();
  const links = [
    { label: c.ui.email, value: profile.email, href: `mailto:${profile.email}`, icon: <Mail size={20} aria-hidden />, external: false },
    { label: "GitHub", value: "AYMANEFAKIHI", href: profile.github, icon: <Github size={20} aria-hidden />, external: true },
    { label: "LinkedIn", value: "aymane-fakihi", href: profile.linkedin, icon: <Linkedin size={20} aria-hidden />, external: true },
  ];
  return (
    <section id="contact" className="relative mx-auto max-w-[1280px] px-5 pt-24 md:px-10 md:pt-32">
      <p data-build="type" className="label">{c.ui.contactLabel}</p>
      <h2 data-build="wipe" data-label="h2" className="mt-4 w-fit font-display text-[clamp(3.2rem,9.5vw,9rem)] uppercase leading-[0.88] tracking-tight text-white">
        {c.ui.contactTitle}
      </h2>

      <div
        data-build="pop"
        data-label="cta"
        className="card relative mt-12 overflow-hidden p-8 md:p-14"
        style={{ backgroundImage: "radial-gradient(60% 120% at 100% 100%, rgba(255,59,47,0.28), transparent 70%)" }}
      >
        <h3 className="max-w-3xl font-display text-[clamp(2.8rem,8vw,7rem)] uppercase leading-[0.92] tracking-tight text-white">
          {c.ui.ctaA} <span className="text-accent">{c.ui.ctaB}</span>
        </h3>
        <p className="mt-5 max-w-xl text-zinc-300">{c.status}.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`mailto:${profile.email}`} className="btn btn-primary">
            <Mail size={16} aria-hidden /> {c.ui.emailMe}
          </a>
          {pdf && (
            <a href={profile.resumePdf} download className="btn btn-ghost">
              <Download size={16} aria-hidden /> {c.ui.resume}
            </a>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ul className="grid content-start gap-4">
          {links.map((l) => (
            <li key={l.label} className="flex">
              <a
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                data-build="pop"
                data-label="link"
                className="card group flex w-full items-center gap-4 p-5 outline-offset-4 focus-visible:outline-2 focus-visible:outline-white active:scale-[0.99]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-white transition-colors group-hover:bg-accent group-hover:text-bg">{l.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-zinc-500">{l.label}</span>
                  <span className="block truncate text-[0.95rem] text-zinc-100">{l.value}</span>
                </span>
                <ArrowUpRight size={18} className="text-zinc-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
        <div data-build="pop" data-label="form" className="card p-6 md:p-8">
          <ContactForm labels={c.ui} to={profile.email} />
        </div>
      </div>

      <div data-build="pop" data-label="services" className="mt-8 flex flex-wrap gap-2" role="list" aria-label={c.ui.services}>
        {c.services.map((s) => (
          <span key={s} role="listitem" className="chip !px-3.5 !py-2 !text-xs">{s}</span>
        ))}
      </div>

      <footer className="mt-24 border-t border-white/5 py-8 pb-28">
        <p data-build="type" className="font-mono text-xs text-zinc-500">© 2026 Aymane Fakihi</p>
      </footer>
    </section>
  );
}
