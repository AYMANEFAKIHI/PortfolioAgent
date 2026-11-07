import { getContent, getLang } from "@/lib/content";

export default async function NotFound() {
  const c = getContent(await getLang());
  return (
    <main id="main" className="mx-auto flex min-h-svh max-w-[980px] flex-col justify-center px-5 py-24 md:px-10">
      <p data-build="type" className="label">404</p>
      <h1 data-build="wipe" data-label="h1" className="metal mt-4 w-fit font-display text-[clamp(6rem,26vw,22rem)] uppercase leading-[0.86]">404</h1>
      <h2 data-build="type" className="mt-6 font-display text-4xl uppercase text-white">{c.ui.notFoundTitle}</h2>
      <p data-build="type" className="mt-3 max-w-md text-zinc-400">{c.ui.notFoundText}</p>
      <a href="/" data-build="pop" className="btn btn-primary mt-8 w-fit">{c.ui.notFoundBack}</a>
    </main>
  );
}
