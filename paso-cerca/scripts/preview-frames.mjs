// Renderiza fotogramas sueltos para revisar composición sin renderizar el video entero.
// Uso: node scripts/preview-frames.mjs <compositionId> <outDir> <seg1> <seg2> ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [id, outDir, ...secs] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const chromeMode = process.env.REMOTION_CHROME_MODE ?? "headless-shell";
const envVariables = { REMOTION_LOCAL_FONTS: process.env.REMOTION_LOCAL_FONTS ?? "" };
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable, chromeMode, envVariables });
fs.mkdirSync(outDir, { recursive: true });
for (const sec of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(sec) * composition.fps));
  const output = path.join(outDir, `${id}-${String(sec).padStart(5, "0")}s.jpg`);
  await renderStill({ composition, serveUrl, output, frame, imageFormat: "jpeg", jpegQuality: 80, scale: 0.4, browserExecutable, chromeMode, envVariables });
  console.log(output);
}
