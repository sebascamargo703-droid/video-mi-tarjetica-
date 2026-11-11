import type React from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import localFonts from "./local-fonts.json";

/**
 * Fraunces (400 y 600) para titulares e Inter (400 y 600) para textos, desde Google Fonts
 * (Inter 800 solo para el wordmark provisional del logo).
 * Con REMOTION_LOCAL_FONTS=1 se usan las copias de /public/fonts (render sin internet); la de
 * Fraunces es la versión variable con eje óptico (opsz), así los titulares usan opsz alto.
 * Los emoji usan la fuente de emoji del sistema.
 */
const useLocal = typeof process !== "undefined" && Boolean(process.env.REMOTION_LOCAL_FONTS);

if (useLocal) {
  const handle = delayRender("Fuentes locales");
  Promise.all(
    localFonts.map((f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format('woff2')`, { weight: f.weight, style: f.style, unicodeRange: f.unicodeRange });
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
} else {
  loadInter("normal", { weights: ["400", "600", "800"], subsets: ["latin", "latin-ext"] });
  loadFraunces("normal", { weights: ["400", "600"], subsets: ["latin", "latin-ext"] });
}

const emoji = "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji'";
export const sans = `Inter, ${emoji}, sans-serif`;
export const serif = `Fraunces, ${emoji}, Georgia, serif`;
/** Titulares: Fraunces con eje óptico alto. */
export const display: React.CSSProperties = { fontFamily: serif, fontVariationSettings: '"opsz" 144', fontOpticalSizing: "auto" };
