// Exporta todas las piezas del pack a out/<id>.png. Uso: node scripts/render-all.mjs [filtro]
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const filter = process.argv[2] ?? "";
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const envVariables = { REMOTION_LOCAL_FONTS: process.env.REMOTION_LOCAL_FONTS ?? "" };
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comps = (await getCompositions(serveUrl, { browserExecutable, envVariables })).filter((c) => c.id.includes(filter));
fs.mkdirSync("out", { recursive: true });
for (const composition of comps) {
  const output = `out/${composition.id}.png`;
  await renderStill({ composition, serveUrl, output, imageFormat: "png", browserExecutable, envVariables });
  console.log(output);
}
