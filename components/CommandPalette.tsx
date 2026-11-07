"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CornerDownLeft, Search } from "lucide-react";
import type { PaletteItem } from "@/lib/palette";

type Labels = { placeholder: string; none: string; sections: string; projects: string; certs: string; actions: string; hint: string };

function norm(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export default function CommandPalette({ items, labels, lang }: { items: PaletteItem[]; labels: Labels; lang: "en" | "fr" }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  useEffect(() => setMounted(true), []);

  const show = useCallback(() => {
    returnTo.current = document.activeElement as HTMLElement | null;
    setQ("");
    setIdx(0);
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    setOpen(false);
    returnTo.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open ? hide() : show();
      } else if (e.key === "/" && !typing && !open && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        show();
      }
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, [open, show, hide]);

  const results = useMemo(() => {
    const n = norm(q.trim());
    const f = n ? items.filter((i) => norm(`${i.label} ${i.hint ?? ""}`).includes(n)) : items.filter((i) => i.group !== "certs");
    return f.slice(0, 40);
  }, [items, q]);

  useEffect(() => setIdx(0), [q]);

  const run = useCallback(
    (it: PaletteItem) => {
      setOpen(false);
      if (it.action === "lang") {
        document.cookie = `lang=${lang === "fr" ? "en" : "fr"}; path=/; max-age=31536000; samesite=lax`;
        window.location.reload();
      } else if (it.action === "tour") {
        try {
          sessionStorage.setItem("tour", "1");
        } catch {
          /* ignore */
        }
        if (window.location.pathname === "/") window.location.reload();
        else window.location.assign("/");
      } else if (it.action === "agents") {
        try {
          localStorage.setItem("agents", document.documentElement.classList.contains("build-mode") ? "off" : "on");
        } catch {
          /* ignore */
        }
        window.location.reload();
      } else if (it.href) {
        if (it.external) {
          if (it.href.startsWith("mailto:")) window.location.href = it.href;
          else window.open(it.href, "_blank", "noopener,noreferrer");
        } else if (it.href.startsWith("/#") && window.location.pathname === "/") {
          document.getElementById(it.href.slice(2))?.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", it.href);
        } else {
          window.location.assign(it.href);
        }
      }
    },
    [lang]
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    input.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") return; // handled above
      if (e.key === "Escape") {
        e.preventDefault();
        hide();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIdx((i) => Math.min(results.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIdx((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const it = results[idx];
        if (it) run(it);
      } else if (e.key === "Tab") {
        e.preventDefault();
      }
      e.stopPropagation();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, results, idx, run, hide]);

  useEffect(() => {
    list.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [idx, results]);

  if (!mounted || !open) return null;

  const groupName = (g: PaletteItem["group"]) => labels[g];
  let lastGroup = "";

  return createPortal(
    <div className="fixed inset-0 z-[160] flex items-start justify-center bg-black/75 px-3 pt-[12vh]" onMouseDown={(e) => e.target === e.currentTarget && hide()}>
      <div role="dialog" aria-modal="true" aria-label={labels.hint} className="w-full max-w-[640px] overflow-hidden rounded-2xl border border-zinc-800 bg-[#0b0b0d] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-zinc-800 px-4">
          <Search size={16} className="shrink-0 text-zinc-500" aria-hidden />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={labels.placeholder}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[idx] ? `pal-${results[idx].id}` : undefined}
            aria-label={labels.hint}
            className="h-14 w-full bg-transparent text-base text-white outline-none placeholder:text-zinc-500"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden shrink-0 rounded border border-zinc-700 px-1.5 py-0.5 font-mono text-[11px] text-zinc-400 sm:block">Esc</kbd>
        </div>
        <ul id="palette-list" ref={list} role="listbox" className="max-h-[52vh] overflow-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-zinc-400">{labels.none}</li>}
          {results.map((it, i) => {
            const head = it.group !== lastGroup;
            lastGroup = it.group;
            return (
              <li key={it.id} role="presentation">
                {head && <div className="px-3 pb-1 pt-3 font-mono text-[11px] uppercase tracking-widest text-zinc-400">{groupName(it.group)}</div>}
                <div
                  id={`pal-${it.id}`}
                  role="option"
                  aria-selected={i === idx}
                  onMouseMove={() => setIdx(i)}
                  onClick={() => run(it)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm ${i === idx ? "bg-white/10 text-white" : "text-zinc-300"}`}
                >
                  <span className="truncate">{it.label}</span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-zinc-400">
                    {it.hint && it.group === "certs" && <span className="hidden max-w-[200px] truncate sm:inline">{it.hint}</span>}
                    {i === idx && <CornerDownLeft size={13} aria-hidden />}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body
  );
}
