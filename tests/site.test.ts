import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { projects, profile, certifications } from "../lib/data";
import { cases } from "../lib/cases";
import { getCertificateFiles } from "../lib/certificates";

const root = path.join(__dirname, "..");
const pub = (p: string) => path.join(root, "public", p);

test("11 projects with unique slugs and a case study each (EN + FR)", () => {
  assert.equal(projects.length, 11);
  assert.equal(new Set(projects.map((p) => p.slug)).size, projects.length);
  for (const p of projects) {
    const c = cases[p.n];
    assert.ok(c, `missing case for ${p.slug}`);
    for (const l of ["en", "fr"] as const) {
      assert.ok(c[l].intro && c[l].problem && c[l].results && c[l].solution, `${p.slug} ${l} incomplete`);
    }
  }
});

test("every certificate has an image and a PDF on disk", () => {
  const files = getCertificateFiles("en");
  assert.ok(files.length > 0);
  for (const f of files) {
    assert.ok(fs.existsSync(pub(f.image.replace(/^\//, ""))), `missing ${f.image}`);
    assert.ok(fs.existsSync(pub(f.pdf.replace(/^\//, ""))), `missing ${f.pdf}`);
  }
  assert.ok(certifications.length > 0);
});

test("no phone number appears in the site source", () => {
  const phone = /\+?\d{2}[\s.-]?\d{9,10}|\b0?6\d{8}\b/;
  for (const dir of ["lib", "components", "app"]) {
    const walk = (d: string): string[] =>
      fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
    for (const f of walk(path.join(root, dir)).filter((f) => /\.(ts|tsx)$/.test(f))) {
      assert.ok(!phone.test(fs.readFileSync(f, "utf8")), `phone-like number in ${f}`);
    }
  }
});

test("EN and FR UI dictionaries have the same keys", () => {
  const src = fs.readFileSync(path.join(root, "lib/content.ts"), "utf8");
  const grab = (name: string) => {
    const m = src.match(new RegExp(`const ${name}\\b[^=]*=\\s*\\{([\\s\\S]*?)\\n\\};`));
    assert.ok(m, `${name} not found`);
    return new Set([...m![1].matchAll(/^\s{2}(\w+):/gm)].map((x) => x[1]));
  };
  const en = grab("uiEn");
  const fr = grab("uiFr");
  assert.deepEqual([...en].filter((k) => !fr.has(k)), [], "keys missing in FR");
  assert.deepEqual([...fr].filter((k) => !en.has(k)), [], "keys missing in EN");
});

test("profile basics", () => {
  assert.match(profile.email, /@/);
  assert.ok(profile.github.startsWith("https://"));
  assert.ok(profile.linkedin.startsWith("https://"));
  assert.equal(profile.instagram, null);
});

test("instant build restores the final content state", async () => {
  class FakeClassList {
    private set = new Set<string>();
    add(...names: string[]) { for (const name of names) this.set.add(name); }
    remove(...names: string[]) { for (const name of names) this.set.delete(name); }
    contains(name: string) { return this.set.has(name); }
  }

  class FakeElement {
    tagName: string;
    dataset: Record<string, string> = {};
    children: FakeElement[] = [];
    style: Record<string, string> & { setProperty: (name: string, value: string) => void };
    classList = new FakeClassList();
    attributes: Record<string, string> = {};
    textContent = "";
    className = "";
    innerHTML = "";

    constructor(tag = "div") {
      this.tagName = tag.toUpperCase();
      this.style = {
        setProperty: (name: string, value: string) => {
          this.style[name] = value;
        },
      } as Record<string, string> & { setProperty: (name: string, value: string) => void };
    }

    getBoundingClientRect() {
      return { left: 0, top: 0, width: 200, height: 32, right: 200, bottom: 32 };
    }

    hasAttribute(name: string) { return Object.prototype.hasOwnProperty.call(this.attributes, name); }
    setAttribute(name: string, value: string) { this.attributes[name] = value; }
    appendChild(child: FakeElement) {
      this.children.push(child);
      return child;
    }
    remove() {}
    querySelector(selector: string) {
      if (selector === "b") {
        const existing = this.children.find((child) => child.tagName === "B");
        if (existing) return existing;
        const b = new FakeElement("b");
        this.children.push(b);
        return b;
      }
      return null;
    }
    closest() { return null; }
  }

  const oldWindow = (globalThis as any).window;
  const oldDocument = (globalThis as any).document;
  const oldIntersectionObserver = (globalThis as any).IntersectionObserver;
  const oldRequestAnimationFrame = (globalThis as any).requestAnimationFrame;
  const oldCancelAnimationFrame = (globalThis as any).cancelAnimationFrame;

  try {
    const root = new FakeElement("html");
    root.classList.add("build-mode");
    const body = new FakeElement("body");
    const item = new FakeElement("div");
    item.dataset.build = "type";
    item.textContent = "Hello world";

    const documentStub = {
      documentElement: root,
      body,
      querySelectorAll: () => [item],
      createElement: () => new FakeElement("div"),
      getElementById: () => null,
    };

    (globalThis as any).window = {
      innerWidth: 1200,
      innerHeight: 800,
      scrollX: 0,
      scrollY: 0,
      matchMedia: () => ({ matches: false, addListener() {}, removeListener() {} }),
      getComputedStyle: () => ({ position: "static" }),
      addEventListener() {},
      removeEventListener() {},
      setTimeout: (fn: () => void) => {
        fn();
        return 0;
      },
      clearTimeout() {},
      requestAnimationFrame: () => 0,
      cancelAnimationFrame() {},
      history: { replaceState() {} },
      location: { href: "http://localhost/", pathname: "/", search: "", hash: "" },
      sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
      localStorage: { getItem: () => null, setItem() {} },
      navigator: { userAgent: "node" },
      AudioContext: undefined,
      webkitAudioContext: undefined,
      document: documentStub,
      __af: false,
    };

    (globalThis as any).requestAnimationFrame = () => 0;
    (globalThis as any).cancelAnimationFrame = () => {};
    (globalThis as any).document = documentStub;
    (globalThis as any).IntersectionObserver = class {
      constructor(private cb: (entries: Array<{ target: FakeElement; isIntersecting: boolean; boundingClientRect: { bottom: number } }>) => void) {}
      observe(target: FakeElement) {
        this.cb([{ target, isIntersecting: false, boundingClientRect: { bottom: -1 } }]);
      }
      disconnect() {}
    };

    const { createEngine } = await import("../lib/engine");
    const engine = createEngine();

    assert.equal(item.textContent, "Hello world");
    assert.ok(item.classList.contains("is-built"));
    assert.equal(item.style.minHeight, "");

    engine.destroy();
  } finally {
    (globalThis as any).window = oldWindow;
    (globalThis as any).document = oldDocument;
    (globalThis as any).IntersectionObserver = oldIntersectionObserver;
    (globalThis as any).requestAnimationFrame = oldRequestAnimationFrame;
    (globalThis as any).cancelAnimationFrame = oldCancelAnimationFrame;
  }
});
