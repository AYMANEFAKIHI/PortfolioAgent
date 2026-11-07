import { ArrowUpRight, Github } from "lucide-react";
import { projects, stats } from "@/lib/data";

export default function Work() {
  return (
    <section id="work" className="relative mx-auto max-w-[1280px] px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p data-build="type" className="label">01 — Work</p>
          <h2 data-build="wipe" data-label="h2" className="mt-4 w-fit font-display text-[clamp(3.2rem,9.5vw,9rem)] uppercase leading-[0.88] tracking-tight text-white">
            Work that ships
          </h2>
        </div>
        <div className="max-w-md lg:text-right">
          <p data-build="type" className="text-zinc-400">
            Real products for real users, from a central academic portal to AI-powered tools.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.value} data-build="pop" data-label="stat" className="rounded-xl border border-white/10 bg-[#0c0c0e] p-3 text-left lg:text-right">
                <div className="font-display text-3xl leading-none text-white">{s.value}</div>
                <div className="mt-1.5 font-mono text-[0.6rem] uppercase leading-snug tracking-wider text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.n} className="flex">
            <article data-build="pop" data-label="card" className="card flex w-full flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <span className="font-display text-5xl leading-none text-zinc-800">{p.n}</span>
                <span className="max-w-[60%] pt-1 text-right font-mono text-[0.65rem] uppercase leading-snug tracking-[0.14em] text-accent">
                  {p.category}
                </span>
              </div>
              <h3 className="mt-5 font-display text-[1.9rem] uppercase leading-[1.02] tracking-tight text-white">{p.title}</h3>
              <ul className="bullets mt-4 space-y-2 text-[0.9rem] leading-relaxed text-zinc-400">
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" aria-label={`${p.title}: live site`}>
                    Live <ArrowUpRight size={14} aria-hidden />
                  </a>
                )}
                {p.code && (
                  <a href={p.code} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" aria-label={`${p.title}: source code`}>
                    <Github size={14} aria-hidden /> Code
                  </a>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
