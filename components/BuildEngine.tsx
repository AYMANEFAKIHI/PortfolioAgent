"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Pause, Play, Route, Square } from "lucide-react";
import { createEngine, type Engine, type EngineState } from "@/lib/engine";

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

/** Mounts the robot-cursor engine and renders the bottom dock (Pause / Agents / Tour). */
export default function BuildEngine() {
  const engine = useRef<Engine | null>(null);
  const [st, setSt] = useState<EngineState>({ agents: true, paused: false, tour: false });

  const togglePause = useCallback(() => engine.current?.togglePause(), []);

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const k = e.key.toLowerCase();
      if (k === "t") toggleTour();
      else if (k === "a") toggleAgents();
      else if (k === "p") togglePause();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleTour, toggleAgents, togglePause]);

  return (
    <div className="dock" role="toolbar" aria-label="Build controls">
      <button
        type="button"
        className="dock-btn"
        onClick={togglePause}
        disabled={!st.agents && !st.tour}
        aria-pressed={st.paused}
        title="Pause / resume (P)"
      >
        {st.paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
        <span>{st.paused ? "Resume" : "Pause"}</span>
        <kbd>P</kbd>
      </button>
      <span className="dock-sep" aria-hidden />
      <button
        type="button"
        className="dock-btn"
        onClick={toggleAgents}
        aria-pressed={st.agents}
        title="Agents on / off (A)"
      >
        <Bot size={14} aria-hidden />
        <span>Agents {st.agents ? "on" : "off"}</span>
        <kbd>A</kbd>
      </button>
      <span className="dock-sep" aria-hidden />
      <button
        type="button"
        className="dock-btn"
        onClick={toggleTour}
        data-active={st.tour}
        title="Auto-scroll tour (T). Esc or scrolling stops it."
      >
        {st.tour ? <Square size={13} aria-hidden /> : <Route size={14} aria-hidden />}
        <span>{st.tour ? "Stop tour" : "Tour"}</span>
        <kbd>T</kbd>
      </button>
    </div>
  );
}
