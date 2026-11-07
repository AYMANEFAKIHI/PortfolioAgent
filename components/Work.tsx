import type { Content } from "@/lib/content";
import ProjectGrid from "./ProjectGrid";

export default function Work({ c }: { c: Content }) {
  return (
    <section id="work" className="relative mx-auto max-w-[1280px] px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p data-build="type" className="label">{c.ui.workLabel}</p>
          <h2 data-build="wipe" data-label="h2" className="mt-4 w-fit font-display text-[clamp(3.2rem,9.5vw,9rem)] uppercase leading-[0.88] tracking-tight text-white">
            {c.ui.workTitle}
          </h2>
        </div>
        <div className="max-w-md lg:text-right">
          <p data-build="type" className="text-zinc-400">{c.ui.workShort}</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {c.stats.map((s, i) => (
              <div key={i} data-build="pop" data-label="stat" className="rounded-xl border border-white/10 bg-[#0c0c0e] p-3 text-left lg:text-right">
                <div className="font-display text-3xl leading-none text-white">{s.value}</div>
                <div className="mt-1.5 font-mono text-[0.6rem] uppercase leading-snug tracking-wider text-zinc-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ProjectGrid projects={c.projects} labels={c.ui} />
    </section>
  );
}
