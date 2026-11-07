import { about, principles, skillGroups } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="relative border-t border-white/5 bg-[#0b0b0d]">
      <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-10 md:py-32">
        <p data-build="type" className="label">04 — About</p>
        <h2 data-build="wipe" data-label="h2" className="mt-4 w-fit font-display text-[clamp(3.2rem,9.5vw,9rem)] uppercase leading-[0.88] tracking-tight text-white">
          About me
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="space-y-5 text-[1.02rem] leading-relaxed text-zinc-300">
            {about.map((p) => (
              <p key={p.slice(0, 24)} data-build="type">{p}</p>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {skillGroups.map((g) => (
              <div key={g.title} data-build="pop" data-label="skills" className="card p-5">
                <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent">{g.title}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.items.map((i) => (
                    <span key={i} className="chip">{i}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3 data-build="type" className="mt-20 font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Principles</h3>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <li key={p} className="flex">
              <div data-build="pop" data-label="principle" className="card flex w-full flex-col justify-between gap-8 p-6">
                <span className="font-display text-5xl leading-none text-zinc-700">0{i + 1}</span>
                <p className="font-display text-2xl uppercase leading-[1.08] text-white">{p}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
