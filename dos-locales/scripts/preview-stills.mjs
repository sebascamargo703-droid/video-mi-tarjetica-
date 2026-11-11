// Renderiza varias vistas de una <Still> con props distintas (para ajustar cámaras).
// Uso: node scripts/preview-stills.mjs <compId> <outDir> '<json [{name, props}]>' [escala]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [id, outDir, json, scale = "0.5"] = process.argv.slice(2);
const views = JSON.parse(json);
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const envVariables = { REMOTION_LOCAL_FONTS: process.env.REMOTION_LOCAL_FONTS ?? "" };
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
fs.mkdirSync(outDir, { recursive: true });
for (const v of views) {
  const composition = await selectComposition({ serveUrl, id, inputProps: v.props, browserExecutable, envVariables, chromiumOptions: { gl: "angle" } });
  const output = path.join(outDir, `${v.name}.jpg`);
  await renderStill({ composition, serveUrl, output, inputProps: v.props, imageFormat: "jpeg", jpegQuality: 85, scale: Number(scale), browserExecutable, envVariables, chromiumOptions: { gl: "angle" } });
  console.log(output);
}
