import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import localFonts from "./lib/local-fonts.json";

/**
 * Por defecto las fuentes llegan de Google Fonts (@remotion/google-fonts).
 * Con la variable REMOTION_LOCAL_FONTS=1 se usan las copias de /public/fonts
 * (mismas fuentes, mismos pesos) para renderizar sin conexión.
 */
const useLocal =
  typeof process !== "undefined" && Boolean(process.env.REMOTION_LOCAL_FONTS);

if (useLocal) {
  const handle = delayRender("Cargando fuentes locales");
  Promise.all(
    localFonts.map((f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format('woff2')`, {
        weight: f.weight,
        style: f.style,
        unicodeRange: f.unicodeRange,
      });
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
} else {
  loadInter("normal", { weights: ["400", "600", "800"], subsets: ["latin", "latin-ext"] });
  loadInterTight("normal", { weights: ["600", "800"], subsets: ["latin", "latin-ext"] });
  // Solo para el wordmark del logo (serif como en el logo oficial).
  loadFraunces("normal", { weights: ["700"], subsets: ["latin"] });
  loadFraunces("italic", { weights: ["600"], subsets: ["latin"] });
}

export const fonts = {
  body: "Inter, sans-serif",
  display: "'Inter Tight', Inter, sans-serif",
  logo: "Fraunces, serif",
};

export const tracking = {
  display: "-0.03em",
  title: "-0.02em",
  body: "-0.01em",
  caps: "0.08em",
};
