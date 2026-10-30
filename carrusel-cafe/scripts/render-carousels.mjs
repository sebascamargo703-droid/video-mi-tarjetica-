// Exporta los carruseles definidos en src/carousels.ts como PNG.
//
//   node scripts/render-carousels.mjs                    → todos
//   node scripts/render-carousels.mjs cafe-no-pagaste    → solo ese carrusel
//
// Por cada lámina ejecuta `npx remotion still <id>-<n>` y guarda
// out/carousels/<id>/01.png, 02.png… y out/carousels/<id>/caption.txt.
// Antes de renderizar avisa si alguna lámina pasa de 30 palabras (sin contar los textos
// dentro de los mockups: tarjeta, notificación, panel).
//
// Opcional: REMOTION_BROWSER=/ruta/a/chrome para usar un navegador específico.
import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MAX_WORDS = 30;

// Lee carousels.ts (solo datos) sin duplicarlo.
const bundled = await build({ entryPoints: [path.join(ROOT, "src/carousels.ts")], bundle: true, write: false, format: "esm", platform: "node" });
const { carousels } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);

const only = process.argv[2];
const list = only ? carousels.filter((c) => c.id === only) : carousels;
if (list.length === 0) {
  console.error(`No existe el carrusel "${only}". Disponibles: ${carousels.map((c) => c.id).join(", ")}`);
  process.exit(1);
}

const countWords = (...texts) =>
  texts
    .flat()
    .filter(Boolean)
    .join(" ")
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

const slideWords = (s, header) => {
  switch (s.type) {
    case "wanted":
      return countWords(s.title, s.business, s.text, s.swipe);
    case "card":
    case "wallet":
      return countWords(header, s.number, s.title, s.note, s.text);
    case "notification":
      return countWords(header, s.number, s.title, s.note);
    case "nearby":
      return countWords(header, s.number, s.title, s.text, s.note);
    case "clients":
      return countWords(header, s.number, s.title);
    case "math":
      return countWords(header, s.number, s.title, s.lines.map((l) => `${l.value} ${l.label}`), s.total.value, s.total.label, s.per, s.note);
    case "chat":
      return countWords(s.title, s.messages.map((m) => `${m.text} ${m.day}`), s.seen);
    case "reveal":
      return countWords(s.title, s.text, s.cta, s.url, s.sub);
    default:
      return 0;
  }
};

const browser = process.env.REMOTION_BROWSER ? ["--browser-executable", process.env.REMOTION_BROWSER] : [];

for (const c of list) {
  const dir = path.join(ROOT, "out", "carousels", c.id);
  fs.mkdirSync(dir, { recursive: true });
  c.slides.forEach((s, i) => {
    const words = slideWords(s, c.chargeHeader);
    if (words > MAX_WORDS) console.warn(`⚠ ${c.id}-${i + 1} (${s.type}) tiene ${words} palabras (máximo ${MAX_WORDS}).`);
  });
  for (let i = 0; i < c.slides.length; i++) {
    const id = `${c.id}-${i + 1}`;
    const out = path.join(dir, `${String(i + 1).padStart(2, "0")}.png`);
    const r = spawnSync("npx", ["remotion", "still", "src/index.ts", id, out, "--image-format=png", "--log=error", ...browser], { cwd: ROOT, stdio: "inherit" });
    if (r.status !== 0) process.exit(r.status ?? 1);
    console.log(`✓ ${path.relative(ROOT, out)}`);
  }
  fs.writeFileSync(path.join(dir, "caption.txt"), `${c.caption}\n`);
  console.log(`✓ ${path.relative(ROOT, path.join(dir, "caption.txt"))}`);
}
