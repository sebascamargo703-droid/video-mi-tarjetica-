/**
 * Marca, ritmo y contraste.
 *
 * Sincronía: todos los cambios del video se calculan con `beat(n)`. Si cambias la
 * música, ajusta solo BPM y FIRST_BEAT_OFFSET (segundos hasta el primer golpe).
 */
export const BPM = 120;
export const FIRST_BEAT_OFFSET = 0;

/** Frame del beat `n` (n puede ser fraccionario: 20.5 = medio beat). */
export const beatFrame = (n: number, fps: number) => Math.round((FIRST_BEAT_OFFSET + (n * 60) / BPM) * fps);

export const palette = {
  /** Verde Mi Tarjetica: único color de marca. Nunca va directo sobre el fondo verde. */
  brand: "#145B44",
  /** Fondo principal (centro del degradado radial). */
  bg: "#145B44",
  /** Bordes del degradado y viñeta. */
  bgDeep: "#0E4433",
  /** Texto principal sobre verde (8.05:1). */
  textPrimary: "#FFFFFF",
  /** Texto secundario sobre verde (5.05:1). */
  textSecondary: "#A7D7C5",
  /** Palabras clave, "mitarjetica.com", ripples y destellos (5.33:1). */
  accent: "#8FE3C0",
  /** Sombra amplia de la tarjeta. */
  shadow: "rgba(10, 46, 34, 0.5)",
  /** Texto oscuro sobre tarjetas claras. */
  dark: "#0A2E22",
  /** Texto aún más oscuro cuando #0A2E22 no alcanza AA (ej. naranja #EA580C: 4.13 → 5.06). */
  darker: "#061A13",
} as const;

/* ---------- Contraste (WCAG) ---------- */
const lum = (hex: string) => {
  const h = hex.replace("#", "");
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/**
 * Color de texto para una tarjeta de color `bg`: blanco u oscuro según el que dé más
 * contraste; si ninguno llega a AA (4.5:1), usa el oscuro más profundo.
 */
export const textOn = (bg: string) => {
  const white = contrast(palette.textPrimary, bg);
  const dark = contrast(palette.dark, bg);
  if (white >= dark && white >= 4.5) return palette.textPrimary;
  if (dark >= 4.5) return palette.dark;
  return contrast(palette.darker, bg) >= white ? palette.darker : palette.textPrimary;
};

/** "#RRGGBB" + alfa → "rgba(...)". */
export const withAlpha = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const music = { file: "music.mp3", volume: 0.55 };
export const sfxVolume = { swipe: 0.22, riser: 0.45, impact: 0.75, sparkle: 0.45, pop: 0.45 };

/** Cualquier color ("#RRGGBB", "rgb(...)" o "rgba(...)") con otra opacidad. */
export const fade = (color: string, a: number) => {
  if (color.startsWith("#")) return withAlpha(color, a);
  const [r, g, b, a0 = 1] = (color.match(/[\d.]+/g) ?? ["0", "0", "0"]).map(Number);
  return `rgba(${r}, ${g}, ${b}, ${a0 * a})`;
};
