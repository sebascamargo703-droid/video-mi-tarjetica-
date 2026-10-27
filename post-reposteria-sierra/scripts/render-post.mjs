// Exporta el carrusel "Repostería Sierra ya usa Mi Tarjetica":
// out/post/reposteria-sierra/01.png … 05.png + caption.txt
// Opcional: REMOTION_BROWSER=/ruta/a/chrome
import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const bundled = await build({ entryPoints: [path.join(ROOT, "src/post.ts")], bundle: true, write: false, format: "esm", platform: "node" });
const { TOTAL, caption } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);
const dir = path.join(ROOT, "out", "post", "reposteria-sierra");
fs.mkdirSync(dir, { recursive: true });
const browser = process.env.REMOTION_BROWSER ? ["--browser-executable", process.env.REMOTION_BROWSER] : [];
for (let i = 1; i <= TOTAL; i++) {
  const out = path.join(dir, `${String(i).padStart(2, "0")}.png`);
  const r = spawnSync("npx", ["remotion", "still", "src/index.ts", `reposteria-sierra-${i}`, out, "--image-format=png", "--log=error", ...browser], { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
  console.log(`✓ ${path.relative(ROOT, out)}`);
}
fs.writeFileSync(path.join(dir, "caption.txt"), `${caption}\n`);
console.log("✓ caption.txt");
