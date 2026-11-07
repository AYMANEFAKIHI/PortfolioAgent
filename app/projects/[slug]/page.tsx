import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { cases } from "@/lib/cases";
import { getContent, getLang } from "@/lib/content";
import { profile } from "@/lib/data";
import LangToggle from "@/components/LangToggle";
import { projectImage } from "@/lib/files";

// NOTE: links use plain <a> (full page load) so the build animation restarts on every page.

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = getContent(await getLang());
  const p = c.projects.find((x) => x.slug === slug);
  if (!p) return {};
  const intro = cases[p.n][c.lang].intro;
  return {
    title: `${p.title} | ${profile.name}`,
    description: intro,
    openGraph: { title: `${p.title} | ${profile.name}`, description: intro, type: "article" },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const c = getContent(await getLang());
  const i = c.projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = c.projects[i];
  const cs = cases[p.n][c.lang];
  const shot = projectImage(p.slug);
  const prev = c.projects[(i - 1 + c.projects.length) % c.projects.length];
  const next = c.projects[(i + 1) % c.projects.length];

  const section = (title: string, body: React.ReactNode, n: string) => (
    <section data-build="pop" data-label="section" className="card p-6 md:p-9">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent">{n} — {title}</p>
      <div className="mt-4 text-[1.02rem] leading-relaxed text-zinc-300">{body}</div>
    </section>
  );

  return (
    <main id="main" className="mx-auto max-w-[980px] px-5 pb-40 pt-6 md:px-10">
      <header className="flex items-center justify-between gap-3 py-3">
        <a href="/" className="flex items-center gap-2.5 rounded-lg font-mono text-sm font-semibold text-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-white">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-accent font-display text-base leading-none text-bg">AF</span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>
        <div className="flex items-center gap-2">
          <LangToggle />
          <a href="/#contact" className="btn btn-primary btn-sm">{c.ui.nav.contact}</a>
        </div>
      </header>

      <a href="/#work" data-build="pop" data-label="back" className="btn btn-ghost btn-sm mt-10">
        <ArrowLeft size={14} aria-hidden /> {c.ui.allProjects}
      </a>

      <p data-build="type" className="label mt-10">{p.n} — {c.ui.caseStudy} · {p.category}</p>
      <h1 data-build="wipe" data-label="h1" className="mt-4 w-fit font-display text-[clamp(3rem,9vw,7.5rem)] uppercase leading-[0.9] tracking-tight text-white">
        {p.title}
      </h1>
      <p data-build="type" className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-200">{cs.intro}</p>

      <div data-build="pop" data-label="links" className="mt-8 flex flex-wrap gap-3">
        {p.live && (
          <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {c.ui.visitLive} <ArrowUpRight size={16} aria-hidden />
          </a>
        )}
        {p.code && (
          <a href={p.code} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <Github size={16} aria-hidden /> {c.ui.sourceCode}
          </a>
        )}
      </div>

      {shot && (
        <figure data-build="pop" data-label="screenshot" className="card mt-12 overflow-hidden p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shot} alt={`${p.title} screenshot`} className="w-full rounded-xl" loading="lazy" />
        </figure>
      )}

      <div className="mt-14 grid gap-4">
        {section(c.ui.problem, <p>{cs.problem}</p>, "01")}
        {section(
          c.ui.solution,
          typeof cs.solution === "string" ? (
            <p>{cs.solution}</p>
          ) : (
            <ul className="bullets space-y-3">
              {cs.solution.map((s) => (
                <li key={s.label}>
                  <strong className="font-semibold text-white">{s.label}: </strong>
                  {s.text}
                </li>
              ))}
            </ul>
          ),
          "02"
        )}
        {section(c.ui.results, <p>{cs.results}</p>, "03")}
        <div data-build="pop" data-label="tech" className="card p-6 md:p-9">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent">{c.ui.techUsed}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <span key={t} className="chip !px-3.5 !py-2 !text-xs">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <nav className="mt-14 grid gap-4 sm:grid-cols-2" aria-label="Projects">
        {[
          { x: prev, label: c.ui.prevProject, Icon: ArrowLeft, right: false },
          { x: next, label: c.ui.nextProject, Icon: ArrowRight, right: true },
        ].map(({ x, label, Icon, right }) => (
          <a
            key={label}
            href={`/projects/${x.slug}`}
            data-build="pop"
            data-label="nav"
            className={`card group flex items-center gap-4 p-5 outline-offset-4 focus-visible:outline-2 focus-visible:outline-white active:scale-[0.99] ${right ? "flex-row-reverse text-right" : ""}`}
          >
            <Icon size={18} className="shrink-0 text-zinc-500 transition-colors group-hover:text-accent" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-zinc-500">{label}</span>
              <span className="block truncate font-display text-2xl uppercase text-white">{x.title}</span>
            </span>
          </a>
        ))}
      </nav>
    </main>
  );
}
