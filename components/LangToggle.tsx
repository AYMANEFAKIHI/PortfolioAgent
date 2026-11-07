"use client";

import { useEffect, useState } from "react";

/** EN / FR switch. Stores the choice in a cookie and reloads so the server renders the right language. */
export default function LangToggle() {
  const [lang, setLang] = useState<"en" | "fr">("en");
  useEffect(() => {
    setLang(document.documentElement.lang === "fr" ? "fr" : "en");
  }, []);

  const pick = (l: "en" | "fr") => {
    if (l === lang) return;
    document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  return (
    <div className="mr-1 flex items-center rounded-lg border border-white/10 p-0.5 font-mono text-[0.68rem]" role="group" aria-label="Language">
      {(["en", "fr"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => pick(l)}
          aria-pressed={lang === l}
          className="rounded-md px-2 py-1.5 uppercase tracking-widest text-zinc-400 transition-colors hover:bg-white/10 hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-white aria-pressed:bg-accent aria-pressed:text-bg"
        >
          {l}
        </button>
      ))}
    </div>
  );
}
