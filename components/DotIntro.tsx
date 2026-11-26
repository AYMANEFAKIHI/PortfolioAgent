"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Portrait-in-dots intro.
 *
 * Plays before the robot agents build the page. ~78k dots (public/intro/dots.bin, made from
 * public/headshot.png with a depth model) fly out of the loading ring into a 3D bust that turns
 * toward the cursor. "Reveal" dissolves the dots into the real photo; "Enter" hands over to the agents.
 *
 * Shown when <html> has the `intro` class (set by the <head> script in app/layout.tsx).
 * Finishing removes that class and fires the `intro-done` window event the engine waits for.
 */

const T = {
  en: { reveal: "Reveal", back: "Back to dots", enter: "Enter portfolio", skip: "Esc to skip", loading: "Loading portrait" },
  fr: { reveal: "Révéler", back: "Revenir aux points", enter: "Entrer", skip: "Échap pour passer", loading: "Chargement du portrait" },
} as const;

const DOTS_URL = "/intro/dots.bin";
const PHOTO_URL = "/intro/photo.webp";
const REVEAL_MS = 3600;
const AUTO_ENTER_MS = 2500; // photo stays this long after the reveal, then the portfolio opens
const BAND_TOP = 1.15;
const BAND_BOTTOM = -1.3;

const DOT_VS = `#version 300 es
precision highp float;
in vec3 aPos; in vec3 aNor; in vec4 aAtt;
uniform vec2 uRes; uniform float uS; uniform vec2 uC; uniform float uPS;
uniform float uYaw, uPitch, uFly, uSweep, uBand, uMouseOn, uRingR, uGain, uTime;
uniform vec3 uMouse; uniform vec2 uMousePx; uniform float uRepelR;
uniform sampler2D uPhoto;
out vec3 vCol; out float vA;
mat3 rotY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s, 0.,1.,0., s,0.,c);}
mat3 rotX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0., 0.,c,s, 0.,-s,c);}
void main(){
  float rnd=aAtt.x, bri=aAtt.y, hw=aAtt.z, back=aAtt.w;
  vec3 rest=aPos*uPS;
  float k=smoothstep(uBand, uBand+0.3, rest.y);           // 1 = above the reveal band
  float w=hw+0.16*(1.0-hw);                                 // shoulders follow a little
  vec3 piv=vec3(0.03,-0.3,0.0);                             // turn around the neck
  mat3 R=rotY(uYaw*w)*rotX(uPitch*w);
  vec3 p=R*(rest-piv)+piv; vec3 n=normalize(R*aNor);
  p.z*=1.0-smoothstep(0.0,0.6,k);                            // press flat onto the photo
  vec2 px=p.xy*uS+uC;
  // cursor: dots part around it like a ripple and glow, then settle back (no head turn)
  vec2 cv=px-uMousePx; float cd=length(cv);
  float f=uMouseOn*(1.0-k)*exp(-(cd*cd)/(uRepelR*uRepelR));
  px+=(cv/max(cd,1.0))*f*uRepelR*(0.14+0.24*rnd);
  px+=vec2(sin(uTime*1.3+rnd*40.0),cos(uTime*1.1+rnd*31.0))*uS*0.0012*(1.0-k);   // faint shimmer
  // fly-in from the loading ring
  float t=clamp((uFly-rnd*0.45)/0.55,0.0,1.0);
  float e=t<0.5?4.0*t*t*t:1.0-pow(-2.0*t+2.0,3.0)/2.0;
  float ang=fract(rnd*7.123)*6.2831853+uTime*0.0;
  vec2 ring=uRes*0.5+uRingR*vec2(cos(ang),sin(ang));
  vec2 d=px-ring;
  vec2 mid=ring+d*0.5+vec2(-d.y,d.x)*(0.35*(rnd-0.5));
  vec2 q=mix(mix(ring,mid,e),mix(mid,px,e),e);
  gl_Position=vec4(q/uRes*2.0-1.0,0.0,1.0);
  // shading: even base + key light + rim + cursor light + one sweep band
  vec3 L=normalize(vec3(-0.45,0.55,0.75));
  float lam=max(dot(n,L),0.0);
  float rim=pow(1.0-clamp(n.z,0.0,1.0),3.0);
  float facing=back>0.5?clamp((n.z-0.12)/0.35,0.0,1.0):clamp(n.z*3.0+0.35,0.0,1.0);
  vec3 toM=uMouse-p; float dm=max(length(toM),1e-3);
  float ml=uMouseOn*max(dot(n,toM/dm),0.0)*exp(-dm*dm*1.4);
  float sw=exp(-pow((rest.y-uSweep)/0.07,2.0));
  float inten=bri*(0.55+0.45*lam)+0.25*rim+1.1*f*(0.35+bri)+0.95*ml*(0.35+bri)+1.3*sw*(0.3+bri);
  inten*=mix(facing,1.0,k*(1.0-back));
  inten*=mix(0.55,1.0,e);
  vec3 crimson=vec3(0.64,0.035,0.055);
  vec3 pc=texture(uPhoto,vec2(rest.x*0.5+0.5,0.5-rest.y*0.5)).rgb;
  vCol=mix(crimson*inten*uGain, pc*0.55, smoothstep(0.0,0.6,k));
  vA=(1.0-smoothstep(0.45,1.0,k))*(1.0-back*smoothstep(0.0,0.2,k));
  float sz=(1.05+1.25*rnd*rnd)*uS*0.0062;
  gl_PointSize=max(sz,1.0)*mix(1.7,1.0,e);
}`;

const DOT_FS = `#version 300 es
precision mediump float;
in vec3 vCol; in float vA; out vec4 o;
void main(){
  float d=length(gl_PointCoord-0.5);
  float a=smoothstep(0.5,0.12,d)*vA;
  if(a<=0.003) discard;
  o=vec4(vCol*a,a);
}`;

const PHOTO_VS = `#version 300 es
precision highp float;
in vec2 aQ; uniform float uS; uniform vec2 uC; uniform vec2 uRes;
out vec2 vUv; out float vY;
void main(){ vec2 px=aQ*uS+uC; vUv=vec2(aQ.x*0.5+0.5,0.5-aQ.y*0.5); vY=aQ.y; gl_Position=vec4(px/uRes*2.0-1.0,0.0,1.0);}`;

const PHOTO_FS = `#version 300 es
precision mediump float;
in vec2 vUv; in float vY; uniform sampler2D uPhoto; uniform float uBand, uCell; out vec4 o;
void main(){
  float k=smoothstep(uBand+0.08,uBand+0.6,vY);
  vec2 cell=mod(gl_FragCoord.xy,uCell)-uCell*0.5;
  float r=k*uCell*0.76;
  float m=clamp(r-length(cell)+0.5,0.0,1.0);
  if(m<=0.0) discard;
  o=texture(uPhoto,vUv)*m;
}`;

const DUST_VS = `#version 300 es
precision highp float;
in vec4 aD; uniform vec2 uRes; uniform float uTime, uDpr, uAlpha; out float vA;
void main(){
  vec2 p=fract(aD.xy+vec2(sin(uTime*0.05+aD.z*20.0)*0.02, uTime*(0.004+aD.w*0.01)));
  gl_Position=vec4(p*2.0-1.0,0.0,1.0);
  gl_PointSize=(1.0+aD.z*2.2)*uDpr;
  vA=uAlpha*(0.25+0.75*aD.w)*(0.5+0.5*sin(uTime*(0.4+aD.z)+aD.w*30.0));
}`;
const DUST_FS = `#version 300 es
precision mediump float;
in float vA; out vec4 o;
void main(){ float d=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.0,d)*vA; o=vec4(vec3(0.55,0.12,0.13)*a,a);}`;

type Phase = "load" | "fly" | "sweep" | "live" | "front" | "reveal" | "revealed" | "unreveal" | "exit";

function compile(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const mk = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, mk(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "link");
  return p;
}

async function fetchWithProgress(url: string, guess: number, onBytes: (got: number, total: number) => void) {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`${url}: ${res.status}`);
  const total = Number(res.headers.get("content-length")) || guess;
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    got += value.length;
    onBytes(got, Math.max(total, got));
  }
  const out = new Uint8Array(got);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function DotIntro({ lang = "en", word = "DEVELOPER" }: { lang?: "en" | "fr"; word?: string }) {
  const t = T[lang];
  const [active, setActive] = useState(true);
  const [pct, setPct] = useState(0);
  const [ui, setUi] = useState<"hidden" | "live" | "busy" | "revealed">("hidden");
  const [leaving, setLeaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const wordRedRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const cmd = useRef<{ reveal: () => void; enter: () => void }>({ reveal: () => {}, enter: () => {} });

  const finish = useCallback(() => {
    const d = document.documentElement;
    d.classList.remove("intro");
    try {
      sessionStorage.setItem("intro", "seen");
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event("intro-done"));
    setActive(false);
  }, []);

  useEffect(() => {
    const d = document.documentElement;
    if (!d.classList.contains("intro")) {
      setActive(false);
      return;
    }
    (window as unknown as { __introMounted?: boolean }).__introMounted = true;
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl) {
      finish();
      return;
    }

    let disposed = false;
    let raf = 0;
    let W = 1, H = 1, dpr = 1, S = 1, Cx = 0, Cy = 0, photoPx = 1;
    let phase: Phase = "load";
    let phaseT0 = performance.now();
    let yaw = 0, pitch = 0, tYaw = 0, tPitch = 0, mouseOn = 0, moved = false;
    let mx = -9999, my = -9999, smx = -9999, smy = -9999;
    let band = BAND_TOP;
    let count = 0;

    let autoEnter = 0;
    const setPhase = (p: Phase) => {
      phase = p;
      phaseT0 = performance.now();
      // once the photo is fully revealed, go on to the portfolio by itself after AUTO_ENTER_MS
      window.clearTimeout(autoEnter);
      if (p === "revealed") autoEnter = window.setTimeout(() => !disposed && cmd.current.enter(), AUTO_ENTER_MS);
      setUi(p === "live" ? "live" : p === "revealed" ? "revealed" : p === "load" || p === "fly" || p === "sweep" ? "hidden" : "busy");
    };

    // ---------- programs ----------
    let dotP: WebGLProgram, photoP: WebGLProgram, dustP: WebGLProgram;
    try {
      dotP = compile(gl, DOT_VS, DOT_FS);
      photoP = compile(gl, PHOTO_VS, PHOTO_FS);
      dustP = compile(gl, DUST_VS, DUST_FS);
    } catch (e) {
      console.warn("[intro]", e);
      finish();
      return;
    }
    const U = (p: WebGLProgram, names: string[]) => Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(p, n)]));
    const du = U(dotP, ["uRes", "uS", "uC", "uPS", "uYaw", "uPitch", "uFly", "uSweep", "uBand", "uMouseOn", "uRingR", "uGain", "uTime", "uMouse", "uMousePx", "uRepelR", "uPhoto"]);
    const pu = U(photoP, ["uS", "uC", "uRes", "uPhoto", "uBand", "uCell"]);
    const su = U(dustP, ["uRes", "uTime", "uDpr", "uAlpha"]);

    const dotVao = gl.createVertexArray()!;
    const quadVao = gl.createVertexArray()!;
    const dustVao = gl.createVertexArray()!;
    const tex = gl.createTexture()!;
    let PS = 1 / 8000;

    // quad
    gl.bindVertexArray(quadVao);
    const qb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, qb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const qa = gl.getAttribLocation(photoP, "aQ");
    gl.enableVertexAttribArray(qa);
    gl.vertexAttribPointer(qa, 2, gl.FLOAT, false, 0, 0);

    // dust
    const DUST = 260;
    const dd = new Float32Array(DUST * 4).map(() => Math.random());
    gl.bindVertexArray(dustVao);
    const db = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, db);
    gl.bufferData(gl.ARRAY_BUFFER, dd, gl.STATIC_DRAW);
    const da = gl.getAttribLocation(dustP, "aD");
    gl.enableVertexAttribArray(da);
    gl.vertexAttribPointer(da, 4, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    // ---------- layout ----------
    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = window.innerWidth, ch = window.innerHeight;
      W = Math.round(cw * dpr);
      H = Math.round(ch * dpr);
      canvas.width = W;
      canvas.height = H;
      // bust a little larger than fit-to-height, anchored to the bottom (top of the head stays in view)
      photoPx = Math.min(H * 1.04, W * (W < H ? 1.45 : 1.25));
      S = photoPx / 2;
      Cx = W / 2;
      Cy = photoPx / 2;
      // giant word fitted to the full width
      const wEl = wordRef.current, rEl = wordRedRef.current;
      if (wEl && rEl) {
        wEl.style.fontSize = "100px";
        const s = (cw * 0.98) / wEl.scrollWidth;
        const fs = `${Math.floor(Math.min(100 * s, ch * 0.4 / 0.86))}px`; // full width, at most 40% of the screen height
        wEl.style.fontSize = fs;
        rEl.style.fontSize = fs;
        wEl.parentElement?.classList.add("intro-word-wrap--on");
      }
      const sh = shadeRef.current;
      if (sh) {
        const size = photoPx / dpr;
        sh.style.width = `${size}px`;
        sh.style.height = `${size}px`;
        sh.style.left = `${cw / 2 - size / 2}px`;
        sh.style.top = `${ch - size}px`;
      }
    };
    layout();
    window.addEventListener("resize", layout);

    // ---------- input ----------
    const onMove = (e: PointerEvent) => {
      mx = e.clientX * dpr;
      my = H - e.clientY * dpr;
      if (!moved) {
        smx = mx;
        smy = my;
      }
      moved = true;
    };
    const onLeave = () => {
      moved = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    // ---------- commands ----------
    cmd.current.reveal = () => {
      if (phase === "live") setPhase("front");
      else if (phase === "revealed") setPhase("unreveal");
    };
    cmd.current.enter = () => {
      if (phase === "exit") return;
      setPhase("exit");
      setLeaving(true);
      window.setTimeout(() => !disposed && finish(), 750);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        e.stopImmediatePropagation();
        cmd.current.enter();
      }
    };
    window.addEventListener("keydown", onKey, true);

    // ---------- load ----------
    let gotA = 0, totA = 1_020_000, gotB = 0, totB = 90_000;
    const prog = () => setPct(Math.min(100, Math.floor(((gotA + gotB) / (totA + totB)) * 100)));
    Promise.all([
      fetchWithProgress(DOTS_URL, totA, (g, tt) => {
        gotA = g;
        totA = tt;
        prog();
      }),
      fetchWithProgress(PHOTO_URL, totB, (g, tt) => {
        gotB = g;
        totB = tt;
        prog();
      }).then((buf) => createImageBitmap(new Blob([buf.slice().buffer], { type: "image/webp" }), { premultiplyAlpha: "premultiply" })),
      document.fonts?.ready ?? Promise.resolve(),
    ])
      .then(([bin, bmp]) => {
        if (disposed) return;
        const dv = new DataView(bin.buffer);
        if (String.fromCharCode(bin[0], bin[1], bin[2], bin[3]) !== "DOTS") throw new Error("bad dots file");
        count = dv.getUint32(4, true);
        PS = 1 / dv.getFloat32(8, true);
        let o = 16;
        const pos = new Int16Array(bin.buffer, o, count * 3);
        o += count * 6;
        const nor = new Int8Array(bin.buffer, o, count * 3);
        o += count * 3 + ((4 - ((count * 3) % 4)) % 4); // normals are padded to 4 bytes in the file
        const att = new Uint8Array(bin.buffer, o, count * 4);

        gl.bindVertexArray(dotVao);
        const attr = (name: string, data: ArrayBufferView, size: number, type: number, norm: boolean) => {
          const b = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, b);
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
          const loc = gl.getAttribLocation(dotP, name);
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, size, type, norm, 0, 0);
        };
        attr("aPos", pos, 3, gl.SHORT, false);
        attr("aNor", nor, 3, gl.BYTE, true);
        attr("aAtt", att, 4, gl.UNSIGNED_BYTE, true);
        gl.bindVertexArray(null);

        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp as ImageBitmap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        setPct(100);
        window.setTimeout(() => !disposed && setPhase("fly"), 350);
      })
      .catch((e) => {
        console.warn("[intro]", e);
        if (!disposed) finish();
      });

    // ---------- frame ----------
    let last = performance.now();
    const t0 = last;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = (now - t0) / 1000;
      const pt = now - phaseT0;
      let fly = 0, sweep = 9, dustA = 0;

      if (phase === "fly") {
        fly = clamp01(pt / 2100);
        if (fly >= 1) setPhase("sweep");
      } else if (phase !== "load") fly = 1;
      if (phase === "sweep") {
        sweep = 1.15 - ease(clamp01(pt / 1500)) * 2.5;
        if (pt > 1500) setPhase("live");
      }
      if (phase !== "load") dustA = 0.9 * clamp01((phase === "fly" ? pt : 2000) / 2000);

      // head target
      // the bust stays facing forward; the cursor only parts the dots (see the shader)
      const tracking = phase === "sweep" || phase === "live";
      tYaw = 0;
      tPitch = 0;
      const ke = 1 - Math.exp(-dt * 9);
      smx += (mx - smx) * ke;
      smy += (my - smy) * ke;
      const kf = 1 - Math.exp(-dt * (phase === "front" ? 6 : 3.2));
      yaw += (tYaw - yaw) * kf;
      pitch += (tPitch - pitch) * kf;
      mouseOn += ((tracking && moved ? 1 : 0) - mouseOn) * (1 - Math.exp(-dt * 4));

      if (phase === "front" && pt > 650 && Math.abs(yaw) + Math.abs(pitch) < 0.02) setPhase("reveal");
      if (phase === "reveal") {
        band = BAND_TOP + (BAND_BOTTOM - BAND_TOP) * ease(clamp01(pt / REVEAL_MS));
        if (pt >= REVEAL_MS) setPhase("revealed");
      } else if (phase === "unreveal") {
        band = BAND_BOTTOM + (BAND_TOP - BAND_BOTTOM) * ease(clamp01(pt / REVEAL_MS));
        if (pt >= REVEAL_MS) setPhase("live");
      } else if (phase === "revealed") band = BAND_BOTTOM;
      else if (phase !== "exit") band = BAND_TOP;

      // banner follows the band
      if (wordRedRef.current) {
        const r = wordRedRef.current.getBoundingClientRect();
        const prog = clamp01((BAND_TOP - band) / (BAND_TOP - BAND_BOTTOM));
        const bandCss = (H - (band * S + Cy)) / dpr; // the band's height on screen
        const cut = prog <= 0 ? 0 : Math.max(0, Math.min(r.height, bandCss - r.top, (prog / 0.55) * r.height));
        wordRedRef.current.style.clipPath = `inset(0 0 ${r.height - cut}px 0)`;
      }

      gl.viewport(0, 0, W, H);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      if (dustA > 0) {
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.useProgram(dustP);
        gl.uniform2f(su.uRes, W, H);
        gl.uniform1f(su.uTime, time);
        gl.uniform1f(su.uDpr, dpr);
        gl.uniform1f(su.uAlpha, dustA * (band < BAND_TOP - 0.01 ? 0.4 : 1));
        gl.bindVertexArray(dustVao);
        gl.drawArrays(gl.POINTS, 0, DUST);
      }
      if (count && phase !== "load") {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        if (band < BAND_TOP - 0.01) {
          gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
          gl.useProgram(photoP);
          gl.uniform1f(pu.uS, S);
          gl.uniform2f(pu.uC, Cx, Cy);
          gl.uniform2f(pu.uRes, W, H);
          gl.uniform1i(pu.uPhoto, 0);
          gl.uniform1f(pu.uBand, band);
          gl.uniform1f(pu.uCell, Math.max(6, 7 * dpr));
          gl.bindVertexArray(quadVao);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.useProgram(dotP);
        gl.uniform2f(du.uRes, W, H);
        gl.uniform1f(du.uS, S);
        gl.uniform2f(du.uC, Cx, Cy);
        gl.uniform1f(du.uPS, PS);
        gl.uniform1f(du.uYaw, yaw);
        gl.uniform1f(du.uPitch, pitch);
        gl.uniform1f(du.uFly, fly);
        gl.uniform1f(du.uSweep, sweep);
        gl.uniform1f(du.uBand, band);
        gl.uniform1f(du.uMouseOn, mouseOn);
        gl.uniform1f(du.uRingR, 56 * dpr);
        gl.uniform1f(du.uGain, 1.0);
        gl.uniform1f(du.uTime, time);
        gl.uniform3f(du.uMouse, (smx - Cx) / S, (smy - Cy) / S, 0.9);
        gl.uniform2f(du.uMousePx, smx, smy);
        gl.uniform1f(du.uRepelR, 85 * dpr);
        gl.uniform1i(du.uPhoto, 0);
        gl.bindVertexArray(dotVao);
        gl.drawArrays(gl.POINTS, 0, count);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      window.clearTimeout(autoEnter);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [finish]);

  if (!active) return null;
  const circ = 2 * Math.PI * 56;
  return (
    <div ref={rootRef} className={`intro-root${leaving ? " intro-root--out" : ""}`} aria-label={t.loading} role="dialog" aria-modal="true">
      <div className="intro-word-wrap" aria-hidden="true">
        <div ref={wordRef} className="intro-word">{word}</div>
        <div ref={wordRedRef} className="intro-word intro-word--red">{word}</div>
      </div>
      <div ref={shadeRef} className="intro-shade" aria-hidden="true" />
      <canvas ref={canvasRef} className="intro-canvas" aria-hidden="true" />
      <div className="intro-grain" aria-hidden="true" />

      <div className={`intro-ring${pct >= 100 ? " intro-ring--done" : ""}`} aria-live="polite">
        <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true">
          <circle cx="70" cy="70" r="56" fill="none" stroke="#2a0507" strokeWidth="2" />
          <circle
            cx="70" cy="70" r="56" fill="none" stroke="#a3091a" strokeWidth="2" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} transform="rotate(-90 70 70)"
          />
        </svg>
        <span>{pct}%</span>
      </div>

      <div className={`intro-ui${ui !== "hidden" ? " intro-ui--on" : ""}`}>
        <button type="button" className="btn btn-ghost btn-sm intro-btn" onClick={() => cmd.current.reveal()} disabled={ui === "busy"}>
          {ui === "revealed" ? t.back : t.reveal}
        </button>
        {ui === "revealed" && (
          <button type="button" className="btn btn-primary btn-sm intro-enter" onClick={() => cmd.current.enter()}>
            {t.enter} →
            <i className="intro-enter-bar" aria-hidden="true" style={{ animationDuration: `${AUTO_ENTER_MS}ms` }} />
          </button>
        )}
      </div>
      <div className="intro-skip">{t.skip}</div>
    </div>
  );
}
