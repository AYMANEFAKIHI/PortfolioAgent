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
