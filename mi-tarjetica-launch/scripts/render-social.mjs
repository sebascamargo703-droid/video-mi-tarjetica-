// Exporta historias (PNG + MP4), la serie de Instagram con voz (MP4 + portada PNG)
// y publicaciones (PNG; MP4 con --mp4) a ../historias-y-publicaciones
// Uso: npm run render:social           (todo)
//      node scripts/render-social.mjs --mp4   (publicaciones también en video)
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, renderStill } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const OUT = path.resolve("../historias-y-publicaciones");
const postsAsVideo = process.argv.includes("--mp4");
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const envVariables = { REMOTION_LOCAL_FONTS: process.env.REMOTION_LOCAL_FONTS ?? "" };

// Nombres de carpeta de cada día (deben coincidir con src/social/carousel/data.ts)
const carouselFolders = {
  1: "dia-1-lunes-la-cuenta",
  2: "dia-2-martes-tarjeta-de-papel",
  3: "dia-3-miercoles-como-funciona",
  4: "dia-4-jueves-ideas-de-premios",
  5: "dia-5-viernes-empieza-gratis",
};
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comps = await getCompositions(serveUrl, { browserExecutable, envVariables });

for (const composition of comps) {
  const isStory = composition.id.startsWith("Historia");
  const isPost = composition.id.startsWith("Post");
  const isIG = composition.id.startsWith("IG");
  const isCarousel = composition.id.startsWith("Carrusel");
  if (!isStory && !isPost && !isIG && !isCarousel) continue;
  if (only && !composition.id.includes(only)) continue;
  if (isCarousel) {
    // Carrusel-D1-03 → carruseles/dia-1-<slug>/03.png
    const [, d, n] = composition.id.match(/Carrusel-D(\d+)-(\d+)/);
    const folder = path.join(OUT, "carruseles", carouselFolders[d] ?? `dia-${d}`);
    fs.mkdirSync(folder, { recursive: true });
    await renderStill({
      composition,
      serveUrl,
      output: path.join(folder, `${n}.png`),
      frame: 0,
      imageFormat: "png",
      browserExecutable,
      envVariables,
    });
    console.log(`✓ ${folder}/${n}.png`);
    continue;
  }
  const dir = path.join(OUT, isIG ? "historias-instagram" : isStory ? "historias" : "publicaciones");
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
  if (isIG) {
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      crf: 18,
      audioBitrate: "192k",
      outputLocation: `${base}.mp4`,
      browserExecutable,
      envVariables,
    });
    execFileSync("bash", ["scripts/master-audio.sh", `${base}.mp4`], { stdio: "inherit" });
    console.log(`✓ ${base}.mp4`);
  } else if (isStory || postsAsVideo) {
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
