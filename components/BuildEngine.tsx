"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Pause, Play, Route, Square, Volume2, VolumeX } from "lucide-react";
import { createEngine, type Engine, type EngineState } from "@/lib/engine";

const TXT = {
  en: {
    pause: "Pause", resume: "Resume", agents: "Agents", on: "on", off: "off", tour: "Tour", stop: "Stop tour", sound: "Sound",
    tPause: "Pause / resume (P)", tAgents: "Agents on / off (A)", tTour: "Auto-scroll tour (T). Esc or scrolling stops it.", tSound: "Sound on / off (S)",
    caps: {
      top: "Hero — Full Stack Developer & Designer",
      work: "Work — 11 shipped projects",
      stack: "Stack — the tools I ship with",
      record: "Record — experience, certifications, education",
      about: "About — skills and principles",
      contact: "Contact — let's build something",
    },
  },
  fr: {
    pause: "Pause", resume: "Reprendre", agents: "Agents", on: "oui", off: "non", tour: "Visite", stop: "Arrêter", sound: "Son",
    tPause: "Pause / reprise (P)", tAgents: "Agents oui / non (A)", tTour: "Visite automatique (T). Échap ou le défilement l'arrête.", tSound: "Son oui / non (S)",
    caps: {
      top: "Accueil — Développeur Full Stack & Designer",
      work: "Projets — 11 projets livrés",
      stack: "Stack — les outils que j'utilise",
      record: "Parcours — expérience, certifications, formation",
      about: "À propos — compétences et principes",
      contact: "Contact — construisons quelque chose",
    },
  },
} as const;

const SECTIONS: [string, keyof (typeof TXT)["en"]["caps"]][] = [
  ["top", "top"], ["work", "work"], ["stack", "stack"], ["record", "record"], ["about", "about"], ["contact", "contact"],
];

function stripAgentsParam() {
  try {
    const u = new URL(window.location.href);
    if (u.searchParams.has("agents")) {
      u.searchParams.delete("agents");
      window.history.replaceState(null, "", u.pathname + (u.search ? u.search : "") + u.hash);
    }
  } catch {
    /* ignore */
  }
}

/** Mounts the robot-cursor engine and renders the bottom dock (Pause / Agents / Sound / Tour). */
export default function BuildEngine() {
  const engine = useRef<Engine | null>(null);
  const [st, setSt] = useState<EngineState>({ agents: true, paused: false, tour: false, sound: false });
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [cap, setCap] = useState<keyof (typeof TXT)["en"]["caps"]>("top");
  const t = TXT[lang];

  const togglePause = useCallback(() => engine.current?.togglePause(), []);
  const toggleSound = useCallback(() => engine.current?.toggleSound(), []);

  const toggleAgents = useCallback(() => {
    const on = document.documentElement.classList.contains("build-mode");
    try {
      localStorage.setItem("agents", on ? "off" : "on");
    } catch {
      /* storage unavailable */
    }
    stripAgentsParam(); // otherwise ?agents=… would override the click after reload
    window.location.reload();
  }, []);

  const toggleTour = useCallback(() => {
    if (engine.current?.state().tour) {
      engine.current.stopTour();
      return;
    }
    try {
      sessionStorage.setItem("tour", "1");
    } catch {
      /* storage unavailable */
    }
    window.location.reload();
  }, []);

  useEffect(() => {
    setLang(document.documentElement.lang === "fr" ? "fr" : "en");
    const eng = createEngine();
    engine.current = eng;
    setSt(eng.state());
    const unsub = eng.subscribe(setSt);
    return () => {
      unsub();
      eng.destroy();
      engine.current = null;
    };
  }, []);

  // Tour captions: which section is on screen
  useEffect(() => {
    if (!st.tour) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      let cur: keyof (typeof TXT)["en"]["caps"] = "top";
      for (const [id, key] of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) cur = key;
      }
      setCap(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [st.tour]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      const k = e.key.toLowerCase();
      if (k === "t") toggleTour();
      else if (k === "a") toggleAgents();
      else if (k === "p") togglePause();
      else if (k === "s") toggleSound();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleTour, toggleAgents, togglePause, toggleSound]);

  return (
    <>
      {st.tour && (
        <div className="tour-caption" role="status" aria-live="polite">
          <span className="tour-dot" aria-hidden /> {t.caps[cap]}
        </div>
      )}
      <div className="dock" role="toolbar" aria-label="Build controls">
        <button type="button" className="dock-btn" onClick={togglePause} disabled={!st.agents && !st.tour} aria-pressed={st.paused} title={t.tPause}>
          {st.paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
          <span>{st.paused ? t.resume : t.pause}</span>
          <kbd>P</kbd>
        </button>
        <span className="dock-sep" aria-hidden />
        <button type="button" className="dock-btn" onClick={toggleAgents} aria-pressed={st.agents} title={t.tAgents}>
          <Bot size={14} aria-hidden />
          <span>{t.agents} {st.agents ? t.on : t.off}</span>
          <kbd>A</kbd>
        </button>
        <span className="dock-sep" aria-hidden />
        <button type="button" className="dock-btn" onClick={toggleSound} aria-pressed={st.sound} title={t.tSound}>
          {st.sound ? <Volume2 size={14} aria-hidden /> : <VolumeX size={14} aria-hidden />}
          <span className="dock-label-sm">{t.sound}</span>
          <kbd>S</kbd>
        </button>
        <span className="dock-sep" aria-hidden />
        <button type="button" className="dock-btn" onClick={toggleTour} data-active={st.tour} title={t.tTour}>
          {st.tour ? <Square size={13} aria-hidden /> : <Route size={14} aria-hidden />}
          <span>{st.tour ? t.stop : t.tour}</span>
          <kbd>T</kbd>
        </button>
      </div>
    </>
  );
}
