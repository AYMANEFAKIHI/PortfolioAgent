import { marqueeTools } from "@/lib/data";

export default function Stack() {
  return (
    <section id="stack" className="relative border-y border-white/5 py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <p data-build="type" className="label">02 — Stack</p>
        <h2 data-build="wipe" data-label="h2" className="mt-4 w-fit font-display text-[clamp(3rem,8vw,7rem)] uppercase leading-[0.9] tracking-tight text-white">
          Tools I ship with
        </h2>
      </div>
      <div data-build="wipe" data-label="marquee" className="marquee mt-12" aria-label="Tools and technologies">
        <div className="marquee-track">
          <div className="marquee-group">
            {marqueeTools.map((t) => (
              <span key={t} className="tool">{t}</span>
            ))}
          </div>
          <div className="marquee-group" aria-hidden="true">
            {marqueeTools.map((t) => (
              <span key={t} className="tool">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
