import Image from "next/image";
import { ArrowDown } from "lucide-react";
import type { Content } from "@/lib/content";
import { profile } from "@/lib/data";
import { hasHeadshot } from "@/lib/files";
import LangToggle from "./LangToggle";
import HeroParallax from "./HeroParallax";

export default function Hero({ c }: { c: Content }) {
  const shot = hasHeadshot();
  const links: [string, string][] = [
    [c.ui.nav.work, "#work"],
    [c.ui.nav.stack, "#stack"],
    [c.ui.nav.record, "#record"],
    [c.ui.nav.about, "#about"],
  ];
  return (
    <section id="top" className="relative overflow-hidden">
      <HeroParallax />
      {/* top bar */}
      <header
        data-build="pop"
        data-order="-1"
        data-hero
        data-label="nav"
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-[linear-gradient(to_bottom,#09090b_55%,rgba(9,9,11,0))] px-5 pb-6 pt-4 md:px-10"
      >
        <a href="#top" className="flex items-center gap-2.5 rounded-lg font-mono text-sm font-semibold tracking-wide text-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-white">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-accent font-display text-base leading-none text-bg">AF</span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="hidden rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-widest text-zinc-400 transition-colors hover:bg-white/5 hover:text-white active:bg-white/10 focus-visible:outline-2 focus-visible:outline-white md:inline-block">
              {l}
            </a>
          ))}
          <LangToggle />
          <a href="#contact" className="btn btn-primary btn-sm">{c.ui.nav.contact}</a>
        </nav>
      </header>

      <div className="relative lg:min-h-svh">
        {/* stage: giant word, red glow, headshot */}
        <div className="relative h-[112vw] max-h-[660px] lg:absolute lg:inset-0 lg:h-auto lg:max-h-none">
          <div className="par par-1 absolute inset-x-0 top-[12%] flex justify-center lg:top-[10svh]">
            <span
              data-build="wipe"
              data-order="0"
              data-hero
              data-label="PORTFOLIO"
              aria-hidden="true"
              className="metal select-none whitespace-nowrap px-2 font-display text-[clamp(3.6rem,22.5vw,27rem)] uppercase leading-[0.86] tracking-tight"
            >
              Portfolio
            </span>
          </div>

          <div className="par par-3 pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
            <div className="glow h-[104vw] w-[104vw] max-h-[760px] max-w-[760px] translate-y-[22%] lg:h-[86svh] lg:w-[86svh] lg:max-h-none lg:max-w-none lg:translate-y-[16%]" />
          </div>

          <div className="par par-2 pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
            <div data-build="pop" data-order="1" data-hero data-label="headshot">
              {shot ? (
                <Image
                  src="/headshot.png"
                  alt={`Portrait of ${profile.name}`}
                  width={1000}
                  height={1000}
                  priority
                  sizes="(min-width: 1024px) 900px, 100vw"
                  className="shot block h-[min(94vw,560px)] w-auto lg:h-[min(88svh,52vw,920px)]"
                />
              ) : (
                <svg viewBox="0 0 400 400" role="img" aria-label="Portrait placeholder" className="shot shot-ph block h-[min(94vw,560px)] w-auto lg:h-[min(88svh,52vw,920px)]">
                  <circle cx="200" cy="150" r="72" fill="currentColor" />
                  <path d="M40 400c0-96 72-150 160-150s160 54 160 150z" fill="currentColor" />
                </svg>
              )}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-bg to-transparent" />
        </div>

        {/* content */}
        <div className="relative z-10 -mt-14 px-5 pb-28 md:px-10 lg:absolute lg:inset-0 lg:mt-0 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-6 lg:pb-16 lg:pt-24">
          <div className="max-w-md">
            <p data-build="type" data-order="2" data-hero className="font-hand text-3xl text-zinc-200 md:text-4xl">
              {c.ui.hello}
            </p>
            <h1
              data-build="wipe"
              data-order="3"
              data-hero
              data-label="h1"
              className="mt-1 w-fit font-display text-[clamp(3.6rem,8.4vw,8.5rem)] uppercase leading-[0.9] tracking-tight text-white"
            >
              <span className="block">Aymane</span>
              <span className="block">Fakihi</span>
            </h1>
            <p data-build="type" data-order="4" data-hero className="mt-4 font-mono text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-accent md:text-sm">
              {c.role}
            </p>
            <div className="mt-5 space-y-1 text-[0.95rem] leading-relaxed text-zinc-400">
              <p data-build="type" data-order="5" data-hero>{c.bio[0]}</p>
              <p data-build="type" data-order="6" data-hero>{c.bio[1]}</p>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href="#work" data-build="pop" data-order="7" data-hero data-label="button" className="btn btn-primary">
                {c.ui.viewWork} <ArrowDown size={16} aria-hidden />
              </a>
              <p data-build="type" data-order="8" data-hero className="based font-mono text-xs text-zinc-400">
                {c.ui.basedIn} {c.city}
              </p>
            </div>
          </div>

          <div className="hidden lg:block" aria-hidden="true" />

          <dl className="mt-10 flex flex-col gap-3 lg:mt-0 lg:items-end">
            {c.stats.map((s, i) => (
              <div
                key={i}
                data-build="pop"
                data-order={9 + i}
                data-hero
                data-label="stat"
                className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-[#0c0c0e] px-5 py-4 lg:max-w-[270px] lg:flex-col lg:items-end lg:gap-1 lg:text-right"
              >
                <dt className="font-display text-5xl leading-none text-white lg:text-6xl">{s.value}</dt>
                <dd className="font-mono text-[0.7rem] uppercase leading-snug tracking-wider text-zinc-400">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
