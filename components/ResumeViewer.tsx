"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Eye, X } from "lucide-react";

/** In-page resume viewer. The preview image has the phone number redacted. */
export default function ResumeViewer({ label, title, close: closeLabel, download, pdf, image, name }: {
  label: string; title: string; close: string; download: string; pdf: string; image: string; name: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      e.stopPropagation();
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open, close]);

  const btn =
    "inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-700 px-3.5 text-sm font-semibold text-zinc-100 transition-all hover:border-zinc-400 hover:bg-white/5 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <>
      <button ref={trigger} type="button" onClick={() => setOpen(true)} className="btn btn-ghost" aria-haspopup="dialog">
        <Eye size={16} aria-hidden /> {label}
      </button>
      {mounted && open &&
        createPortal(
          <div className="fixed inset-0 z-[150] flex bg-black/85 lg:p-6" onMouseDown={(e) => e.target === e.currentTarget && close()}>
            <div role="dialog" aria-modal="true" aria-label={title} className="mx-auto flex h-full w-full max-w-[980px] flex-col overflow-hidden border border-zinc-800 bg-[#0b0b0d] lg:rounded-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3 md:px-6">
                <h3 className="font-display text-2xl uppercase leading-none text-white">{title}</h3>
                <div className="flex items-center gap-2">
                  <a href={pdf} download className={btn}><Download size={15} aria-hidden /> {download}</a>
                  <button ref={closeBtn} type="button" onClick={close} className={btn} aria-label={closeLabel}>
                    <X size={16} aria-hidden /> <span className="hidden sm:inline">{closeLabel}</span>
                  </button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-auto bg-[#070708] p-3 md:p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={`${name} — resume`} className="mx-auto w-full max-w-[860px] rounded-md bg-white shadow-2xl" />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
