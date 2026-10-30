import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import localFonts from "./local-fonts.json";

/**
 * Inter (400/600/800) desde Google Fonts. Fraunces solo para el wordmark del logo.
 * Con REMOTION_LOCAL_FONTS=1 se usan las copias de /public/fonts (render sin internet).
 * El emoji del gancho usa la fuente de emoji del sistema.
 */
const useLocal = typeof process !== "undefined" && Boolean(process.env.REMOTION_LOCAL_FONTS);

if (useLocal) {
  const handle = delayRender("Fuentes locales");
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
    .catch(() => continueRender(handle));
} else {
  loadInter("normal", { weights: ["400", "600", "800"], subsets: ["latin", "latin-ext"] });
  loadFraunces("normal", { weights: ["700"], subsets: ["latin"] });
  loadFraunces("italic", { weights: ["600"], subsets: ["latin"] });
}

export const font =
  "Inter, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
export const logoFont = "Fraunces, serif";
export const tracking = { headline: "-0.03em", title: "-0.02em", body: "-0.01em", caps: "0.08em" };
