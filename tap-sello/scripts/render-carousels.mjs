// Exporta todos los carruseles definidos en src/carousels.ts.
//
//   node scripts/render-carousels.mjs                 → todos
//   node scripts/render-carousels.mjs como-funciona   → solo ese carrusel
//
// Por cada lámina ejecuta `npx remotion still <id>-<n>` y guarda
// out/carousels/<id>/01.png, 02.png… y out/carousels/<id>/caption.txt.
// Antes de renderizar avisa si alguna lámina pasa de 25 palabras.
//
// Opcional: REMOTION_BROWSER=/ruta/a/chrome para usar un navegador específico.
import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MAX_WORDS = 25;

// Lee carousels.ts (solo datos) sin duplicarlo.
const bundled = await build({
  entryPoints: [path.join(ROOT, "src/carousels.ts")],
  bundle: true,
  write: false,
  format: "esm",
  platform: "node",
});
const mod = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);
const { carousels, ctaCopy, cardCopy } = mod;

const only = process.argv[2];
const list = only ? carousels.filter((c) => c.id === only) : carousels;
if (list.length === 0) {
  console.error(`No existe el carrusel "${only}". Disponibles: ${carousels.map((c) => c.id).join(", ")}`);
  process.exit(1);
}

const countWords = (...texts) =>
  texts
    .filter(Boolean)
    .join(" ")
    .replace(/[*\n]/g, " ")
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

const slideWords = (s) => {
  switch (s.type) {
    case "cover":
      return countWords(s.title, s.subtitle);
    case "point":
      return countWords(s.number, s.title, s.text);
    case "stat":
      return countWords(s.value, s.context, s.note);
    case "compare":
      return countWords("Antes", s.before, "Con Mi Tarjetica", s.after);
    case "card":
      return countWords(s.title, cardCopy.business, cardCopy.customer, cardCopy.reward);
    case "cta":
      return countWords(ctaCopy.title, ctaCopy.sub);
    default:
      return 0;
  }
};

let tooLong = 0;
for (const c of list) {
  c.slides.forEach((s, i) => {
    const n = slideWords(s);
    if (n > MAX_WORDS) {
      tooLong++;
      console.warn(`⚠ ${c.id} lámina ${i + 1} (${s.type}) tiene ${n} palabras (máximo ${MAX_WORDS}).`);
    }
  });
}
if (tooLong) console.warn(`⚠ ${tooLong} lámina(s) superan las ${MAX_WORDS} palabras.\n`);

const browserFlag = process.env.REMOTION_BROWSER ? [`--browser-executable=${process.env.REMOTION_BROWSER}`] : [];

for (const c of list) {
  const dir = path.join(ROOT, "out", "carousels", c.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "caption.txt"), c.caption + "\n");
  for (let i = 0; i < c.slides.length; i++) {
    const id = `${c.id}-${i + 1}`;
    const out = path.join(dir, `${String(i + 1).padStart(2, "0")}.png`);
    const r = spawnSync("npx", ["remotion", "still", id, out, "--image-format=png", "--log=error", ...browserFlag], {
      cwd: ROOT,
      stdio: ["ignore", "ignore", "inherit"],
    });
    if (r.status !== 0) {
      console.error(`✗ ${id}`);
      process.exit(r.status ?? 1);
    }
    console.log(`✓ ${path.relative(ROOT, out)}`);
  }
  console.log(`✓ ${path.relative(ROOT, path.join(dir, "caption.txt"))}`);
}
