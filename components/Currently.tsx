import type { Content } from "@/lib/content";

export default function Currently({ c }: { c: Content }) {
  return (
    <section aria-label={c.ui.currentlyLabel} className="border-y border-white/5 bg-[#0b0b0d]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:gap-8 md:px-10">
        <p data-build="type" className="label flex shrink-0 items-center gap-2.5">
          {c.ui.currentlyLabel}
        </p>
        <ul data-build="pop" data-label="now" className="flex flex-wrap gap-2">
          {c.currently.map((t) => (
            <li key={t} className="chip !px-3.5 !py-2 !text-xs !text-zinc-200">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
