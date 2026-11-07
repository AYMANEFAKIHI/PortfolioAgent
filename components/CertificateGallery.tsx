"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Award, Download, ExternalLink, Search, X } from "lucide-react";
import type { CertFile } from "@/lib/certificates";

type Labels = {
  certAll: string; certTitle: string; certSearch: string; certOpen: string; certDownload: string;
  certClose: string; certBack: string; certPrev: string; certNext: string; certNone: string;
};

/** "View all certificates" button + full-screen gallery (list on the left, the certificate on the right). */
export default function CertificateGallery({ files, labels }: { files: CertFile[]; labels: Labels }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState("");
  const [slug, setSlug] = useState(files[0]?.slug ?? "");
  const [pane, setPane] = useState<"list" | "view">("list"); // phones show one pane at a time
  const [loaded, setLoaded] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? files.filter((f) => `${f.title} ${f.issuer} ${f.dateLabel}`.toLowerCase().includes(n)) : files;
  }, [files, q]);
  const idx = shown.findIndex((f) => f.slug === slug);
  const current = idx >= 0 ? shown[idx] : shown[0];

  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  const select = useCallback((s: string) => {
    setSlug(s);
    setLoaded(false);
    setPane("view");
  }, []);

  const step = useCallback(
    (d: number) => {
      if (!shown.length) return;
      const i = (Math.max(idx, 0) + d + shown.length) % shown.length;
      setSlug(shown[i].slug);
      setLoaded(false);
    },
    [shown, idx]
  );

  // lock page scroll, focus the dialog, keyboard handling
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && !(e.target instanceof HTMLInputElement)) {
        step(e.key === "ArrowRight" ? 1 : -1);
      } else if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input');
        const visible = Array.from(f).filter((el) => el.offsetParent !== null);
        if (!visible.length) return;
        const first = visible[0];
        const last = visible[visible.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      e.stopPropagation(); // keep the page's T / A / P / S shortcuts quiet while the gallery is open
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open, close, step]);

  const btn =
    "inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-700 px-3.5 text-sm font-semibold text-zinc-100 transition-all hover:border-zinc-400 hover:bg-white/5 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-40";

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => {
          setOpen(true);
          setPane("list");
        }}
        className="btn btn-primary btn-sm w-full"
        aria-haspopup="dialog"
      >
        <Award size={15} aria-hidden /> {labels.certAll}
      </button>

      {mounted && open &&
        createPortal(
          <div className="fixed inset-0 z-[150] flex bg-black/85 p-0 lg:p-6" onMouseDown={(e) => e.target === e.currentTarget && close()}>
            <div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label={labels.certTitle}
              className="mx-auto flex h-full w-full max-w-[1360px] flex-col overflow-hidden border border-zinc-800 bg-[#0b0b0d] lg:rounded-2xl"
            >
              <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3 md:px-6">
                <h3 className="font-display text-2xl uppercase leading-none text-white">{labels.certTitle}</h3>
                <button ref={closeBtn} type="button" onClick={close} className={btn} aria-label={labels.certClose}>
                  <X size={16} aria-hidden /> <span className="hidden sm:inline">{labels.certClose}</span>
                </button>
              </div>

              <div className="grid min-h-0 flex-1 lg:grid-cols-[360px_1fr]">
                {/* list */}
                <div className={`min-h-0 flex-col border-zinc-800 lg:flex lg:border-r ${pane === "view" ? "hidden" : "flex"}`}>
                  <label className="relative block border-b border-zinc-800 p-3">
                    <span className="sr-only">{labels.certSearch}</span>
                    <Search size={15} className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder={labels.certSearch}
                      className="h-10 w-full rounded-lg border border-zinc-800 bg-[#101012] pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 hover:border-zinc-600 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-accent"
                    />
                  </label>
                  <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
                    {shown.map((f) => (
                      <li key={f.slug}>
                        <button
                          type="button"
                          onClick={() => select(f.slug)}
                          aria-current={current?.slug === f.slug}
                          className="w-full rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors hover:bg-white/5 active:bg-white/10 focus-visible:outline-2 focus-visible:outline-white aria-[current=true]:border-accent/60 aria-[current=true]:bg-accent/10"
                        >
                          <span className="block text-[0.9rem] font-medium leading-snug text-zinc-100">{f.title}</span>
                          <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-wider text-zinc-400">
                            {f.issuer} <span className="text-accent">· {f.dateLabel}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                    {!shown.length && <li className="p-4 text-sm text-zinc-400">{labels.certNone}</li>}
                  </ul>
                </div>

                {/* viewer */}
                <div className={`min-h-0 flex-col lg:flex ${pane === "list" ? "hidden" : "flex"}`}>
                  {current ? (
                    <>
                      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 px-4 py-3 md:px-6">
                        <button type="button" onClick={() => setPane("list")} className={`${btn} lg:hidden`}>
                          <ArrowLeft size={15} aria-hidden /> {labels.certBack}
                        </button>
                        <div className="min-w-0 flex-1 basis-60">
                          <p className="truncate text-[0.95rem] font-semibold text-white">{current.title}</p>
                          <p className="truncate font-mono text-[0.65rem] uppercase tracking-wider text-zinc-400">
                            {current.issuer} <span className="text-accent">· {current.dateLabel}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => step(-1)} className={btn} aria-label={labels.certPrev}>
                            <ArrowLeft size={15} aria-hidden />
                          </button>
                          <button type="button" onClick={() => step(1)} className={btn} aria-label={labels.certNext}>
                            <ArrowRight size={15} aria-hidden />
                          </button>
                          <a href={current.pdf} target="_blank" rel="noopener noreferrer" className={btn}>
                            <ExternalLink size={15} aria-hidden /> <span className="hidden md:inline">{labels.certOpen}</span>
                          </a>
                          <a href={current.pdf} download className={btn} aria-label={labels.certDownload}>
                            <Download size={15} aria-hidden /> <span className="hidden md:inline">{labels.certDownload}</span>
                          </a>
                        </div>
                      </div>
                      <div className="grid min-h-0 flex-1 place-items-center overflow-auto bg-[#070708] p-3 md:p-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          key={current.slug}
                          src={current.image}
                          alt={`${current.title} — ${current.issuer}`}
                          onLoad={() => setLoaded(true)}
                          className={`max-h-full max-w-full rounded-md object-contain shadow-2xl transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="p-6 text-sm text-zinc-400">{labels.certNone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
