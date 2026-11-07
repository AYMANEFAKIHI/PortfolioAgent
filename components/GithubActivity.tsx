import { ArrowUpRight, Star } from "lucide-react";
import type { Content } from "@/lib/content";
import { profile } from "@/lib/data";

type Repo = { name: string; html_url: string; description: string | null; language: string | null; stargazers_count: number; pushed_at: string; fork: boolean };

async function latestRepos(user: string): Promise<Repo[] | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=12`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "portfolio-site" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const all = (await res.json()) as Repo[];
    return all.filter((r) => !r.fork).slice(0, 6);
  } catch {
    return null; // GitHub unreachable or rate-limited: the block simply stays hidden
  }
}

/** Live data from your public GitHub profile (cached for an hour). Hidden if GitHub can't be reached. */
export default async function GithubActivity({ c }: { c: Content }) {
  const user = profile.github.split("/").filter(Boolean).pop()!;
  const repos = await latestRepos(user);
  if (!repos?.length) return null;
  const fmt = new Intl.DateTimeFormat(c.lang === "fr" ? "fr-FR" : "en-US", { month: "short", year: "numeric" });
  return (
    <div className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 data-build="type" className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">{c.ui.githubTitle}</h3>
        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
          {c.ui.githubAll} <ArrowUpRight size={14} aria-hidden />
        </a>
      </div>
      <ul className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {repos.map((r) => (
          <li key={r.name} className="flex">
            <a
              href={r.html_url}
              target="_blank"
              rel="noopener noreferrer"
              data-build="pop"
              data-label="repo"
              className="card group flex w-full flex-col gap-3 p-5 outline-offset-4 focus-visible:outline-2 focus-visible:outline-white active:scale-[0.99]"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="break-all font-mono text-[0.95rem] font-medium text-white group-hover:text-accent">{r.name}</span>
                <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-zinc-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
              </span>
              {r.description && <span className="text-[0.85rem] leading-relaxed text-zinc-400">{r.description}</span>}
              <span className="mt-auto flex flex-wrap items-center gap-2 pt-1 font-mono text-[0.68rem] text-zinc-400">
                {r.language && <span className="chip">{r.language}</span>}
                {r.stargazers_count > 0 && (
                  <span className="inline-flex items-center gap-1"><Star size={12} aria-hidden /> {r.stargazers_count}</span>
                )}
                <span className="ml-auto">{fmt.format(new Date(r.pushed_at))}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
