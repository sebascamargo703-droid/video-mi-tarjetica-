// Exporta las pantallas 2D (src/screens.tsx) a public/screens/<id>.png para usarlas como textura en 3D.
// Uso: node scripts/render-screens.mjs [id1 id2 …]
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const only = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const envVariables = { REMOTION_LOCAL_FONTS: process.env.REMOTION_LOCAL_FONTS ?? "" };
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comps = (await getCompositions(serveUrl, { browserExecutable, envVariables })).filter((c) => c.id.startsWith("scr-"));
fs.mkdirSync("public/screens", { recursive: true });
for (const composition of comps) {
  const id = composition.id.slice(4);
  if (only.length && !only.includes(id)) continue;
  const output = `public/screens/${id}.png`;
  const scale = composition.width <= 700 && composition.height > 1000 ? 1.5 : 1;
  await renderStill({ composition, serveUrl, output, imageFormat: "png", scale, browserExecutable, envVariables, inputProps: composition.defaultProps });
  console.log(output);
}
