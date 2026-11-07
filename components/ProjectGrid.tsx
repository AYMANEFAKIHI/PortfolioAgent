"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/lib/data";

type Labels = { statusOnline: string; statusOffline: string; caseStudy: string; filterLabel: string; filterAll: string; filterAi: string; noMatch: string; live: string; code: string };

const FILTERS: { id: string; label?: string; test: (t: string[]) => boolean }[] = [
  { id: "all", test: () => true },
  { id: "Next.js", label: "Next.js", test: (t) => t.includes("Next.js") },
  { id: "React", label: "React", test: (t) => t.includes("React") },
  { id: "TypeScript", label: "TypeScript", test: (t) => t.includes("TypeScript") },
  { id: "Node.js", label: "Node.js", test: (t) => t.includes("Node.js") },
  { id: "JS", label: "Vanilla JS", test: (t) => t.includes("Vanilla JavaScript") },
  { id: "AI", test: (t) => t.some((x) => /AI$/.test(x)) },
];

export default function ProjectGrid({ projects, labels }: { projects: Project[]; labels: Labels }) {
  const [active, setActive] = useState("all");
  const [status, setStatus] = useState<Record<string, boolean>>({});
  useEffect(() => {
    let off = false;
    fetch("/api/status")
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => !off && setStatus(d))
      .catch(() => {});
    return () => {
      off = true;
    };
  }, []);
  const f = FILTERS.find((x) => x.id === active) ?? FILTERS[0];
  const shown = useMemo(() => new Set(projects.filter((p) => f.test(p.tech)).map((p) => p.n)), [projects, f]);

  return (
    <>
      <div data-build="pop" data-label="filters" className="mt-14 flex flex-wrap items-center gap-2" role="group" aria-label={labels.filterLabel}>
        {FILTERS.map((x) => {
          const label = x.id === "all" ? labels.filterAll : x.id === "AI" ? labels.filterAi : x.label;
          const count = projects.filter((p) => x.test(p.tech)).length;
          return (
            <button
              key={x.id}
              type="button"
              onClick={() => setActive(x.id)}
              aria-pressed={active === x.id}
              disabled={count === 0}
              className="rounded-full border border-zinc-800 bg-[#0e0e10] px-3.5 py-1.5 font-mono text-xs text-zinc-300 transition-all hover:border-zinc-500 hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40 aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-bg"
            >
              {label} <span className="opacity-80">{count}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.n} className="flex" hidden={!shown.has(p.n)}>
            <article data-build="pop" data-label="card" className="card flex w-full flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <span className="font-display text-5xl leading-none text-zinc-500">{p.n}</span>
                <span className="max-w-[60%] pt-1 text-right font-mono text-[0.65rem] uppercase leading-snug tracking-[0.14em] text-accent">
                  {p.category}
                </span>
              </div>
              {status[p.slug] !== undefined && (
                <p className="mt-4 inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-wider text-zinc-400">
                  <span className={`h-2 w-2 rounded-full ${status[p.slug] ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" : "bg-zinc-600"}`} aria-hidden />
                  {status[p.slug] ? labels.statusOnline : labels.statusOffline}
                </p>
              )}
              <h3 className="mt-3 font-display text-[1.9rem] uppercase leading-[1.02] tracking-tight text-white">{p.title}</h3>
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
                <a href={`/projects/${p.slug}`} className="btn btn-ghost btn-sm" aria-label={`${p.title}: ${labels.caseStudy}`}>
                  {labels.caseStudy} <ArrowUpRight size={14} aria-hidden />
                </a>
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" aria-label={`${p.title}: ${labels.live}`}>
                    {labels.live} <ArrowUpRight size={14} aria-hidden />
                  </a>
                )}
                {p.code && (
                  <a href={p.code} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" aria-label={`${p.title}: ${labels.code}`}>
                    <Github size={14} aria-hidden /> {labels.code}
                  </a>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
