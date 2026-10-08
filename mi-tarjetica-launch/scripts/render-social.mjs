// Exporta historias (PNG + MP4) y publicaciones (PNG; MP4 con --mp4) a ../historias-y-publicaciones
// Uso: npm run render:social           (todo)
//      node scripts/render-social.mjs --mp4   (publicaciones también en video)
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, renderStill } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("../historias-y-publicaciones");
const postsAsVideo = process.argv.includes("--mp4");
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const envVariables = { REMOTION_LOCAL_FONTS: process.env.REMOTION_LOCAL_FONTS ?? "" };

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comps = await getCompositions(serveUrl, { browserExecutable, envVariables });

for (const composition of comps) {
  const isStory = composition.id.startsWith("Historia");
  const isPost = composition.id.startsWith("Post");
  if (!isStory && !isPost) continue;
  if (only && !composition.id.includes(only)) continue;
  const dir = path.join(OUT, isStory ? "historias" : "publicaciones");
  fs.mkdirSync(dir, { recursive: true });
  const base = path.join(dir, composition.id);
  await renderStill({
    composition,
    serveUrl,
    output: `${base}.png`,
    frame: composition.durationInFrames - 1,
    imageFormat: "png",
    browserExecutable,
    envVariables,
  });
  console.log(`✓ ${base}.png`);
  if (isStory || postsAsVideo) {
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      crf: 20,
      muted: true,
      outputLocation: `${base}.mp4`,
      browserExecutable,
      envVariables,
    });
    console.log(`✓ ${base}.mp4`);
  }
}
