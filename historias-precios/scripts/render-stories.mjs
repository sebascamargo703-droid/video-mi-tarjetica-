// Exporta las historias "Precios" como PNG 1080×1920.
//
//   node scripts/render-stories.mjs
//
// Ejecuta `npx remotion still` para precios-1 … precios-8 y precios-portada, y guarda
// out/stories/precios/01.png … 08.png y out/stories/precios/portada.png.
// Opcional: REMOTION_BROWSER=/ruta/a/chrome para usar un navegador específico.
import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const bundled = await build({ entryPoints: [path.join(ROOT, "src/pricing.ts")], bundle: true, write: false, format: "esm", platform: "node" });
const { stories } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);

const dir = path.join(ROOT, "out", "stories", "precios");
fs.mkdirSync(dir, { recursive: true });
const browser = process.env.REMOTION_BROWSER ? ["--browser-executable", process.env.REMOTION_BROWSER] : [];
const jobs = [...stories.map((_, i) => [`precios-${i + 1}`, `${String(i + 1).padStart(2, "0")}.png`]), ["precios-portada", "portada.png"]];

for (const [id, file] of jobs) {
  const out = path.join(dir, file);
  const r = spawnSync("npx", ["remotion", "still", "src/index.ts", id, out, "--image-format=png", "--log=error", ...browser], { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
  console.log(`✓ ${path.relative(ROOT, out)}`);
}
