/* Robot-cursor build engine.
 *
 * One requestAnimationFrame loop + one IntersectionObserver.
 * Every element marked data-build="type" | "pop" | "wipe" is hidden (CSS, via the
 * `build-mode` class set by the inline <head> script) until a robot cursor
 * glides to it, drags a blue wireframe box around it, and builds it.
 */

type Kind = "type" | "pop" | "wipe";
type ItemState = "wait" | "queued" | "building" | "done";
type Phase = "idle" | "move" | "drag" | "build" | "finish";

interface Item {
  el: HTMLElement;
  kind: Kind;
  state: ItemState;
  key: number;
  text: string;
  doneAt: number;
}

interface Agent {
  name: string;
  color: string;
  el: HTMLElement;
  box: HTMLElement;
  label: HTMLElement;
  x: number;
  y: number;
  visible: boolean;
  phase: Phase;
  t0: number;
  dur: number;
  fromX: number;
  fromY: number;
  idleSince: number;
  item: Item | null;
  rect: { x: number; y: number; w: number; h: number };
  fixed: boolean;
}

export interface EngineState {
  agents: boolean;
  paused: boolean;
  tour: boolean;
  sound: boolean;
}

export interface Engine {
  state(): EngineState;
  subscribe(fn: (s: EngineState) => void): () => void;
  togglePause(): void;
  toggleSound(): void;
  stopTour(): void;
  party(): void;
  destroy(): void;
}

const NAMES = ["Scout", "Layout", "Typeset", "Motion", "QA", "Deploy", "Copy", "Lint", "Index", "Render", "Palette", "Review"];
const COLORS = ["#22d3ee", "#a3e635", "#facc15", "#f472b6", "#fb923c", "#34d399", "#7dd3fc", "#fde047", "#5eead4", "#fda4af", "#86efac", "#fdba74"];
const MAX_BUILDING = 6;
const BOOT_MS = 1000;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const BOT_SVG = `<svg class="af-bot" viewBox="0 0 24 24" fill="none" aria-hidden="true"><line x1="12" y1="2.6" x2="12" y2="6.4" stroke="#09090b" stroke-width="1.6" stroke-linecap="round"/><circle class="af-ant" cx="12" cy="2.6" r="1.7" fill="#ff3b2f"/><rect x="3.5" y="6.4" width="17" height="14" rx="4" fill="#09090b"/><rect class="af-led" x="7.2" y="11" width="3.4" height="4.2" rx="1.2" fill="#67e8f9"/><rect class="af-led" x="13.4" y="11" width="3.4" height="4.2" rx="1.2" fill="#67e8f9"/><rect x="9.2" y="17.2" width="5.6" height="1.2" rx="0.6" fill="#71717a"/></svg>`;
const ARROW_SVG = (c: string) =>
  `<svg class="af-arrow" width="22" height="26" viewBox="0 0 22 26" aria-hidden="true"><path d="M2 2 L2 21 L7.2 16.4 L10.6 24 L14 22.5 L10.7 15 L18 14.6 Z" fill="${c}" stroke="#09090b" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

export function createEngine(): Engine {
  const root = document.documentElement;
  const agentsOn = root.classList.contains("build-mode");
  const listeners = new Set<(s: EngineState) => void>();
  let soundSaved = false;
  try {
    soundSaved = localStorage.getItem("sound") === "on";
  } catch {
    /* storage unavailable */
  }
  const S: EngineState = { agents: agentsOn, paused: false, tour: false, sound: soundSaved };
  const emit = () => listeners.forEach((fn) => fn({ ...S }));

  (window as unknown as { __af?: boolean }).__af = true;

  let rafId = 0;
  let looping = false;
  let last = 0;
  let T = 0; // virtual clock (frozen while paused)
  let destroyed = false;
  let started = false;
  let roamUntil = 0;
  const roamTarget = new Map<Agent, { x: number; y: number }>();
  const timers: number[] = [];
  const after = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.push(id);
  };

  /* ───────── Sound (off by default; needs a click to start) ───────── */
  let actx: AudioContext | null = null;
  let lastBlip = 0;
  function ensureAudio() {
    if (actx) {
      if (actx.state === "suspended") void actx.resume();
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) actx = new AC();
  }
  function blip(freq: number, ms: number, vol = 0.025, type: OscillatorType = "square") {
    if (!S.sound || S.paused || !actx || actx.state !== "running") return;
    const now = performance.now();
    if (now - lastBlip < 28) return;
    lastBlip = now;
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = type;
    o.frequency.value = freq;
    const t = actx.currentTime;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
    o.connect(g).connect(actx.destination);
    o.start(t);
    o.stop(t + ms / 1000 + 0.02);
  }
  const unlock = () => {
    if (S.sound) ensureAudio();
  };
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);

  /* ───────── Pointer (idle cursors politely dodge the real mouse) ───────── */
  let mx = -9999;
  let my = -9999;
  const onMove = (e: PointerEvent) => {
    mx = e.clientX;
    my = e.clientY;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  /* ───────── Items ───────── */
  const items: Item[] = [];
  const itemOf = new Map<Element, Item>();
  let queue: Item[] = [];
  const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-build]"));

  if (agentsOn) {
    for (const el of nodes) {
      let kind = (el.dataset.build as Kind) || "pop";
      if (kind === "type" && el.children.length > 0) kind = "wipe"; // only plain text can be typed
      const it: Item = { el, kind, state: el.classList.contains("is-built") ? "done" : "wait", key: 0, text: "", doneAt: 0 };
      items.push(it);
      itemOf.set(el, it);
    }
  }

  const heroItems = items.filter((i) => i.el.hasAttribute("data-hero"));

  const keyOf = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const order = el.dataset.order;
    if (order !== undefined && order !== "") return Number(order);
    return r.top + window.scrollY + (r.left + window.scrollX) / 10000 + 1000;
  };

  function prepare(it: Item) {
    if (it.kind === "type") {
      it.text = it.el.textContent ?? "";
      const h = it.el.getBoundingClientRect().height;
      it.el.style.minHeight = `${h}px`; // keep layout steady while typing
    }
  }

  function begin(it: Item) {
    const el = it.el;
    el.classList.add("is-built");
    blip(it.kind === "pop" ? 440 : it.kind === "wipe" ? 330 : 660, 70);
    if (it.kind === "type") {
      el.classList.add("is-typing");
      el.textContent = "";
    } else if (it.kind === "pop") {
      el.style.transition = "none";
      el.style.opacity = "0";
      el.style.transform = "translateY(16px) scale(0.9)";
    } else {
      el.style.clipPath = "inset(-6% 100% -6% -6%)";
    }
  }

  function progress(it: Item, p: number) {
    const el = it.el;
    if (it.kind === "type") {
      const n = Math.floor(p * it.text.length);
      if (n !== el.textContent?.length && n % 3 === 0) blip(1300 + (n % 9) * 40, 14, 0.012);
      el.textContent = it.text.slice(0, n);
    } else if (it.kind === "pop") {
      const e = easeBack(clamp(p, 0, 1));
      el.style.opacity = String(Math.min(1, p * 2.4));
      el.style.transform = `translateY(${(1 - e) * 16}px) scale(${0.9 + 0.1 * e})`;
    } else {
      el.style.clipPath = `inset(-6% ${(1 - easeOut(clamp(p, 0, 1))) * 100}% -6% -6%)`;
    }
  }

  function finish(it: Item) {
    const el = it.el;
    el.classList.add("is-built");
    el.classList.remove("is-typing");
    if (it.kind === "type" && it.text) el.textContent = it.text;
    el.style.minHeight = "";
    el.style.opacity = "";
    el.style.transform = "";
    el.style.transition = "";
    el.style.clipPath = "";
    it.state = "done";
    it.doneAt = T;
  }

  function instant(it: Item) {
    if (it.state === "done") return;
    queue = queue.filter((q) => q !== it);
    prepare(it);
    finish(it);
  }

  /* ───────── Agents ───────── */
  const phone = window.matchMedia("(max-width: 640px)").matches;
  const agentCount = phone ? 6 : 12;
  const agents: Agent[] = [];
  let layer: HTMLElement | null = null;
  let rr = 0;

  if (agentsOn) {
    layer = document.createElement("div");
    layer.className = "af-layer";
    layer.setAttribute("aria-hidden", "true");
    for (let i = 0; i < agentCount; i++) {
      const color = COLORS[i % COLORS.length];
      const el = document.createElement("div");
      el.className = "af-agent";
      el.style.setProperty("--c", color);
      el.innerHTML = `${ARROW_SVG(color)}<div class="af-tag">${BOT_SVG}<span>${NAMES[i % NAMES.length]}</span></div>`;
      const box = document.createElement("div");
      box.className = "af-box";
      box.innerHTML = `<i></i><i></i><i></i><i></i><b></b>`;
      layer.appendChild(box);
      layer.appendChild(el);
      agents.push({
        name: NAMES[i % NAMES.length], color, el, box, label: box.querySelector("b") as HTMLElement,
        x: 0, y: 0, visible: false, phase: "idle", t0: 0, dur: 0, fromX: 0, fromY: 0, idleSince: 0,
        item: null, rect: { x: 0, y: 0, w: 0, h: 0 }, fixed: false,
      });
    }
    document.body.appendChild(layer);
  }

  const busyCount = () => agents.filter((a) => a.phase !== "idle").length;

  function assign(a: Agent, it: Item) {
    it.state = "building";
    a.item = it;
    prepare(it);
    const r = it.el.getBoundingClientRect();
    a.fixed = getComputedStyle(it.el).position === "fixed";
    a.rect = { x: r.left + (a.fixed ? 0 : window.scrollX), y: r.top + (a.fixed ? 0 : window.scrollY), w: r.width, h: r.height };
    a.label.textContent = `${it.el.dataset.label || it.el.tagName.toLowerCase()} · ${it.kind}`;
    if (!a.visible) {
      // spawn from the nearest side edge of the screen
      const vr = viewRect(a);
      const fromLeft = vr.x < window.innerWidth / 2;
      a.x = fromLeft ? -30 : window.innerWidth + 30;
      a.y = clamp(vr.y + (Math.random() - 0.5) * 160, 30, window.innerHeight - 60);
      a.visible = true;
      a.el.style.opacity = "1";
    }
    a.phase = "move";
    a.t0 = T;
    a.fromX = a.x;
    a.fromY = a.y;
    const tl = tlPoint(a);
    const dist = Math.hypot(tl.x - a.x, tl.y - a.y);
    a.dur = clamp(380 + dist * 0.55, 520, 1250);
  }

  function viewRect(a: Agent) {
    const sx = a.fixed ? 0 : window.scrollX;
    const sy = a.fixed ? 0 : window.scrollY;
    return { x: a.rect.x - sx, y: a.rect.y - sy, w: a.rect.w, h: a.rect.h };
  }
  function tlPoint(a: Agent) {
    const v = viewRect(a);
    return { x: clamp(v.x, 6, window.innerWidth - 150), y: clamp(v.y, 6, window.innerHeight - 70) };
  }
  function place(a: Agent, x: number, y: number) {
    a.x = x;
    a.y = y;
    a.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
  }
  function drawBox(a: Agent, x: number, y: number, w: number, h: number, o: number) {
    const b = a.box.style;
    b.opacity = String(o);
    b.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    b.width = `${Math.max(0, w).toFixed(1)}px`;
    b.height = `${Math.max(0, h).toFixed(1)}px`;
  }

  function stepAgent(a: Agent) {
    const it = a.item;
    if (a.phase === "idle" || !it) return;
    const v = viewRect(a);
    const elapsed = T - a.t0;

    if (a.phase === "move") {
      const p = clamp(elapsed / a.dur, 0, 1);
      const e = easeInOut(p);
      const tl = tlPoint(a);
      const dx = tl.x - a.fromX;
      const dy = tl.y - a.fromY;
      const dist = Math.hypot(dx, dy) || 1;
      const bend = Math.sin(p * Math.PI) * dist * 0.09; // gentle arc so it feels hand-driven
      place(a, lerp(a.fromX, tl.x, e) + (-dy / dist) * bend, lerp(a.fromY, tl.y, e) + (dx / dist) * bend);
      if (p >= 1) {
        a.phase = "drag";
        a.t0 = T;
        a.dur = clamp(320 + (v.w + v.h) * 0.22, 400, 760);
      }
    } else if (a.phase === "drag") {
      const p = clamp(elapsed / a.dur, 0, 1);
      const e = easeOut(p);
      drawBox(a, v.x, v.y, v.w * e, v.h * e, 1);
      place(a, clamp(v.x + v.w * e, 6, window.innerWidth - 150), clamp(v.y + v.h * e, 6, window.innerHeight - 70));
      if (p >= 1) {
        begin(it);
        a.phase = "build";
        a.t0 = T;
        a.dur =
          it.kind === "type" ? clamp(it.text.length * 15, 360, 1700) : it.kind === "wipe" ? 820 : 560;
      }
    } else if (a.phase === "build") {
      const p = clamp(elapsed / a.dur, 0, 1);
      progress(it, p);
      drawBox(a, v.x, v.y, v.w, v.h, 1);
      const wobble = Math.sin(T / 140) * 2;
      if (it.kind === "wipe") {
        place(a, clamp(v.x + v.w * easeOut(p), 6, window.innerWidth - 150), clamp(v.y + v.h, 6, window.innerHeight - 70) + wobble);
      } else if (it.kind === "type") {
        place(a, clamp(v.x + v.w * 0.35 + v.w * 0.55 * p, 6, window.innerWidth - 150), clamp(v.y + v.h, 6, window.innerHeight - 70) + wobble);
      } else {
        place(a, clamp(v.x + v.w, 6, window.innerWidth - 150) + wobble, clamp(v.y + v.h, 6, window.innerHeight - 70));
      }
      if (p >= 1) {
        finish(it);
        a.phase = "finish";
        a.t0 = T;
      }
    } else if (a.phase === "finish") {
      const p = clamp(elapsed / 240, 0, 1);
      drawBox(a, v.x, v.y, v.w, v.h, 1 - p);
      if (p >= 1) {
        a.box.style.opacity = "0";
        a.item = null;
        a.phase = "idle";
        a.idleSince = T;
      }
    }
  }

  function pickAgent(): Agent | null {
    for (let k = 0; k < agents.length; k++) {
      const a = agents[(rr + k) % agents.length];
      if (a.phase === "idle") {
        rr = (rr + k + 1) % agents.length;
        return a;
      }
    }
    return null;
  }

  /* ───────── Observer ───────── */
  let io: IntersectionObserver | null = null;
  if (agentsOn) {
    io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          const it = itemOf.get(en.target);
          if (!it || it.state !== "wait") continue;
          if (en.isIntersecting) {
            it.state = "queued";
            it.key = keyOf(it.el);
            queue.push(it);
          } else if (en.boundingClientRect.bottom < 0) {
            instant(it); // already scrolled past → appears instantly
          }
        }
        ensureLoop();
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0 }
    );
  }

  /* ───────── Tour ───────── */
  type TourState = { t0: number; y0: number; dist: number; v: number; ta: number; total: number };
  let tour: TourState | null = null;
  let tourPending = false;
  let tourReadyAt = 0;

  // The flag survives a React StrictMode remount (dev) through a window property.
  const w = window as unknown as { __afTour?: boolean };
  try {
    if (sessionStorage.getItem("tour") === "1") {
      sessionStorage.removeItem("tour");
      w.__afTour = true;
    }
  } catch {
    /* storage unavailable */
  }
  if (w.__afTour) {
    tourPending = true;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }

  function beginTour() {
    const dist = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    if (dist < 50) return;
    const v = 120; // px per second, steady cruise
    const ta = 1.5; // seconds of ease-in and of ease-out
    const total = (dist - v * ta) / v + 2 * ta;
    if (dist <= v * ta) return;
    tour = { t0: T, y0: window.scrollY, dist, v, ta, total: total * 1000 };
    w.__afTour = false;
    S.tour = true;
    emit();
    ensureLoop();
  }

  function tourY(t: TourState, ms: number) {
    const s = ms / 1000;
    const { v, ta, dist } = t;
    const T_ = t.total / 1000;
    if (s <= 0) return 0;
    if (s >= T_) return dist;
    if (s < ta) return (v * s * s) / (2 * ta);
    if (s <= T_ - ta) return (v * ta) / 2 + v * (s - ta);
    const r = T_ - s;
    return dist - (v * r * r) / (2 * ta);
  }

  function stopTour() {
    if (!tour && !tourPending) return;
    tour = null;
    tourPending = false;
    w.__afTour = false;
    S.tour = false;
    emit();
  }

  const stopKeys = new Set(["Escape", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);
  const onWheel = () => stopTour();
  const onTouch = () => stopTour();
  const onPointer = (e: PointerEvent) => {
    if ((e.target as HTMLElement | null)?.closest?.(".dock")) return;
    stopTour();
  };
  const onKey = (e: KeyboardEvent) => {
    if (stopKeys.has(e.key)) stopTour();
  };
  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchstart", onTouch, { passive: true });
  window.addEventListener("pointerdown", onPointer);
  window.addEventListener("keydown", onKey);

  // Elements that were jumped over in one frame never trigger the observer; sweep them.
  let sweepTimer = 0;
  function sweep() {
    sweepTimer = 0;
    if (destroyed || !started) return;
    for (const it of items) {
      if (it.state === "wait" && it.el.getBoundingClientRect().bottom < 0) instant(it);
    }
  }
  const onScroll = () => {
    if (!sweepTimer) sweepTimer = window.setTimeout(sweep, 120);
  };
  if (agentsOn) window.addEventListener("scroll", onScroll, { passive: true });

  /* ───────── Loop ───────── */
  function ensureLoop() {
    if (looping || destroyed || !started) return;
    looping = true;
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function frame(now: number) {
    if (destroyed) return;
    const dt = S.paused ? 0 : Math.min(now - last, 50);
    last = now;
    T += dt;

    // anything queued that has been scrolled well past appears instantly
    if (queue.length) {
      for (const it of queue.slice()) {
        if (it.el.getBoundingClientRect().bottom < -40) instant(it);
      }
    }

    // reading order, at most 6 building at once
    const limit = Math.min(MAX_BUILDING, agents.length);
    while (queue.length && busyCount() < limit) {
      const a = pickAgent();
      if (!a) break;
      let bi = 0;
      for (let i = 1; i < queue.length; i++) if (queue[i].key < queue[bi].key) bi = i;
      const it = queue.splice(bi, 1)[0];
      assign(a, it);
    }

    for (const a of agents) {
      stepAgent(a);
      if (a.phase === "idle" && a.visible && mx > -9000) {
        const dx = a.x + 8 - mx;
        const dy = a.y + 10 - my;
        const d = Math.hypot(dx, dy);
        if (d < 120) {
          const push = (120 - d) * 0.22;
          place(a, clamp(a.x + (dx / (d || 1)) * push, 6, window.innerWidth - 150), clamp(a.y + (dy / (d || 1)) * push, 6, window.innerHeight - 70));
        }
      }
      // easter egg: roam the screen
      if (a.phase === "idle" && T < roamUntil) {
        if (!a.visible) {
          a.visible = true;
          a.el.style.opacity = "1";
          place(a, Math.random() * (window.innerWidth - 160), Math.random() * (window.innerHeight - 80));
        }
        let tg = roamTarget.get(a);
        if (!tg || Math.hypot(tg.x - a.x, tg.y - a.y) < 14) {
          tg = { x: 10 + Math.random() * (window.innerWidth - 170), y: 10 + Math.random() * (window.innerHeight - 90) };
          roamTarget.set(a, tg);
        }
        place(a, a.x + (tg.x - a.x) * 0.045, a.y + (tg.y - a.y) * 0.045);
        a.idleSince = T;
      }
      // park idle cursors after a moment
      if (a.phase === "idle" && a.visible && T - a.idleSince > 1000 && !queue.length) {
        a.visible = false;
        a.el.style.opacity = "0";
      }
    }

    // tour
    if (tourPending && !tour) {
      const heroDone = heroItems.every((h) => h.state === "done");
      // Start once the hero is built, or after 4s at the latest so the tour never waits forever.
      if (!agentsOn || heroDone || T > 4000) {
        if (!tourReadyAt) tourReadyAt = T;
        if (T - tourReadyAt > 900) {
          tourPending = false;
          beginTour();
        }
      }
    }
    if (tour) {
      const el = T - tour.t0;
      window.scrollTo({ top: tour.y0 + tourY(tour, el), behavior: "instant" as ScrollBehavior });
      if (el >= tour.total) {
        tour = null;
        S.tour = false;
        emit();
      }
    }

    const active = queue.length > 0 || agents.some((a) => a.phase !== "idle" || a.visible) || !!tour || tourPending;
    if (active) {
      rafId = requestAnimationFrame(frame);
    } else {
      looping = false;
    }
  }

  /* ───────── Start ───────── */
  const boot = document.getElementById("boot");
  function start() {
    if (destroyed || started) return;
    started = true;
    if (io) for (const it of items) if (it.state === "wait") io.observe(it.el);
    ensureLoop();
    boot?.classList.add("boot--out");
    after(() => boot?.remove(), 600);
  }

  if (agentsOn) {
    after(start, BOOT_MS);
  } else {
    started = true;
    boot?.remove();
    if (tourPending) ensureLoop();
  }

  return {
    state: () => ({ ...S }),
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    togglePause() {
      if (!agentsOn && !tour) return;
      S.paused = !S.paused;
      emit();
    },
    toggleSound() {
      S.sound = !S.sound;
      try {
        localStorage.setItem("sound", S.sound ? "on" : "off");
      } catch {
        /* storage unavailable */
      }
      if (S.sound) {
        ensureAudio();
        blip(880, 90);
      }
      emit();
    },
    stopTour,
    party() {
      if (!agentsOn || !layer) return;
      roamUntil = T + 7000;
      blip(660, 120);
      ensureLoop();
    },
    destroy() {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("pointermove", onMove);
      void actx?.close();
      destroyed = true;
      cancelAnimationFrame(rafId);
      timers.forEach((id) => clearTimeout(id));
      io?.disconnect();
      for (const a of agents) if (a.item && a.item.state === "building") finish(a.item);
      layer?.remove();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(sweepTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
      listeners.clear();
    },
  };
}
