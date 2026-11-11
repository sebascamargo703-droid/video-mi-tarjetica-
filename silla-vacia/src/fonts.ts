import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import localFonts from "./local-fonts.json";

/**
 * Tipografías de Google Fonts cargadas con @remotion/google-fonts:
 *  - Inter (400/600/800): textos y titulares.
 *  - Fraunces (700 y 600 itálica): wordmark "mitarjetica.com" y letrero de neón.
 *
 * Opcional: con la variable REMOTION_LOCAL_FONTS=1 se usan las copias de
 * /public/fonts (sirve para renderizar sin internet, p. ej. en un servidor).
 */
const useLocal = typeof process !== "undefined" && Boolean(process.env.REMOTION_LOCAL_FONTS);

let ready: Promise<unknown>;
if (useLocal) {
  const handle = delayRender("Fuentes locales");
  ready = Promise.all(
    localFonts.map((f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format('woff2')`, {
        weight: f.weight,
        style: f.style,
        unicodeRange: f.unicodeRange,
      });
      document.fonts.add(face);
      return face.load();
    }),
  ).finally(() => continueRender(handle));
} else {
  const inter = loadInter("normal", { weights: ["400", "600", "800"], subsets: ["latin", "latin-ext"] });
  const fraunces = loadFraunces("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
  const frauncesItalic = loadFraunces("italic", { weights: ["600"], subsets: ["latin", "latin-ext"] });
  ready = Promise.all([inter.waitUntilDone(), fraunces.waitUntilDone(), frauncesItalic.waitUntilDone()]);
}

/** Se resuelve cuando las fuentes están listas (lo usan las texturas de letreros 3D). */
export const fontsReady: Promise<unknown> = ready.catch(() => undefined);

export const FONT = {
  text: "Inter, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
  brand: "Fraunces, Georgia, serif",
} as const;
