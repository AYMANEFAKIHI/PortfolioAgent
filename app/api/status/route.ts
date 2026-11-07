import { NextResponse } from "next/server";
import { projects } from "@/lib/data";

export const runtime = "nodejs";
export const revalidate = 3600;

async function up(url: string): Promise<boolean | null> {
  const opts = { redirect: "follow" as const, signal: AbortSignal.timeout(6000), next: { revalidate: 3600 }, headers: { "User-Agent": "portfolio-status-check" } };
  try {
    let res = await fetch(url, { ...opts, method: "HEAD" });
    if (res.status === 405 || res.status === 403 || res.status >= 500) res = await fetch(url, { ...opts, method: "GET" });
    if (res.status < 400) return true;
    if (res.status === 404 || res.status === 410 || res.status >= 500) return false;
    return null; // 401/403/429…: can't tell, so show nothing
  } catch {
    return null; // network error from this server: unknown, show nothing
  }
}

/** Checks the live-demo URLs from lib/data.ts only (never a user-supplied URL). Cached for an hour. */
export async function GET() {
  const entries = await Promise.all(projects.filter((p) => p.live).map(async (p) => [p.slug, await up(p.live!)] as const));
  return NextResponse.json(Object.fromEntries(entries.filter(([, v]) => v !== null)), {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
