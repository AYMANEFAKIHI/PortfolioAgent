import type { Content } from "@/lib/content";
import { testimonials } from "@/lib/data";

/** Renders only when real testimonials are added to lib/data.ts. */
export default function Testimonials({ c }: { c: Content }) {
  if (!testimonials.length) return null;
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 md:px-10">
      <h3 data-build="type" className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">{c.ui.testimonialsTitle}</h3>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {testimonials.map((t) => (
          <li key={t.name} className="flex">
            <figure data-build="pop" data-label="quote" className="card flex w-full flex-col justify-between gap-6 p-7">
              <blockquote className="font-display text-2xl uppercase leading-[1.15] text-white">“{t.quote}”</blockquote>
              <figcaption className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                {t.name} <span className="text-accent">· {t.role}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
