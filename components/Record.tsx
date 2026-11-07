import { Award } from "lucide-react";
import type { Content } from "@/lib/content";

export default function Record({ c }: { c: Content }) {
  const { certs: certifications, education, experience } = c;
  return (
    <section id="record" className="relative mx-auto max-w-[1280px] px-5 py-24 md:px-10 md:py-32">
      <p data-build="type" className="label">{c.ui.recordLabel}</p>
      <h2 data-build="wipe" data-label="h2" className="mt-4 w-fit font-display text-[clamp(3.2rem,9.5vw,9rem)] uppercase leading-[0.88] tracking-tight text-white">
        {c.ui.recordTitle}
      </h2>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="space-y-14">
          <div>
            <h3 data-build="type" className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">{c.ui.experience}</h3>
            <div className="tl mt-6 space-y-5">
              {experience.map((e) => (
                <div key={e.role} className="tl-item">
                  <article data-build="pop" data-label="card" className="card p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-accent">{e.dates}</p>
                        <h4 className="mt-2 font-display text-3xl uppercase leading-none text-white">{e.role}</h4>
                        <p className="mt-1.5 text-sm text-zinc-300">
                          {e.org} <span className="text-zinc-500">· {e.place}</span>
                        </p>
                      </div>
                      {e.highlight && (
                        <div className="rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-right">
                          <div className="font-display text-3xl leading-none text-accent">{e.highlight}</div>
                          <div className="mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-zinc-400">{c.ui.efficiency}</div>
                        </div>
                      )}
                    </div>
                    <ul className="bullets mt-4 space-y-2 text-[0.9rem] leading-relaxed text-zinc-400">
                      {e.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    {e.tech.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {e.tech.map((t) => (
                          <span key={t} className="chip">{t}</span>
                        ))}
                      </div>
                    )}
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 data-build="type" className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">{c.ui.education}</h3>
            <div className="tl mt-6 space-y-4">
              {education.map((e) => (
                <div key={e.dates + e.detail} className="tl-item">
                  <div data-build="pop" data-label="card" className="card px-5 py-4">
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-accent">
                      {e.dates}
                      {e.note && <span className="text-zinc-500"> · {e.note}</span>}
                    </p>
                    <p className="mt-1.5 font-display text-2xl uppercase leading-tight text-white">{e.title}</p>
                    <p className="text-sm text-zinc-400">{e.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 data-build="type" className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">{c.ui.certifications}</h3>
          <div data-build="pop" data-label="card" className="card mt-6 overflow-hidden">
            <div className="flex items-center gap-4 border-b border-white/5 p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-bg">
                <Award size={24} aria-hidden />
              </span>
              <div>
                <div className="font-display text-5xl leading-none text-white">28</div>
                <div className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-400">{c.ui.certLabel}</div>
              </div>
            </div>
            <ul className="divide-y divide-white/5">
              {certifications.map((c) => (
                <li key={c.name} className="px-6 py-3.5">
                  <p className="text-[0.92rem] font-medium leading-snug text-zinc-100">{c.name}</p>
                  <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-zinc-500">
                    {c.issuer} <span className="text-accent">· {c.date}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
