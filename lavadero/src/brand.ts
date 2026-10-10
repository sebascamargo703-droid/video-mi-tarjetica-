/**
 * Marca, ilustración y contraste. Todo el texto cumple AA (≥ 4.5:1):
 *   sobre el verde #145B44 → blanco 8.05 · textSecondary 5.05 · accent 5.33
 *   tarjeta del lavadero → blanco sobre #0369A1 5.93 (sobre #075985, 7.56)
 *   banner del premio → #0369A1 sobre blanco 5.93 · #0A2E22 sobre blanco 14.7
 *
 * Nota: el celeste #0EA5E9 con texto blanco da 2.77:1 (no pasa AA), así que el fondo de la
 * tarjeta usa el azul de la misma familia #0369A1 y el #0EA5E9 queda en cepillos, la franja
 * superior de la tarjeta y los detalles de agua.
 */
export const palette = {
  /** Verde Mi Tarjetica: único color de marca. Nunca directo sobre el fondo verde. */
  brand: "#145B44",
  bg: "#145B44",
  bgDeep: "#0E4433",
  textPrimary: "#FFFFFF",
  textSecondary: "#A7D7C5",
  accent: "#8FE3C0",
  /** #0A2E22 al 50 %. */
  shadow: "rgba(10, 46, 34, 0.5)",
  dark: "#0A2E22",
} as const;

/** Ilustración (cámbiala aquí para otro carro u otro lavadero). */
export const art = {
  car: { body: "#F26B5B", bodyDark: "#D9503F", glass: "#CFE8F5", tire: "#0A2E22", rim: "#FFFFFF", light: "#FFF4D6" },
  dirt: { color: "#6B4423", opacity: 0.7 },
  tunnel: { frame: "rgba(255, 255, 255, 0.9)", detail: "#A7D7C5", brush: "#0EA5E9", brushLight: "#7DD3FC" },
  water: { tint: "#7DD3FC", foam: "#F0F9FF" },
  floor: "#0E4433",
} as const;

/** Tarjeta del Wallet del lavadero. */
export const card = {
  bg: "#0369A1",
  bgDeep: "#075985",
  /** Franja superior y brillo de las gotas (decorativo, sin texto encima). */
  highlight: "#0EA5E9",
  text: "#FFFFFF",
  /** Texto secundario sobre la tarjeta (#E0F2FE sobre #0369A1 = 5.17). */
  textSoft: "#E0F2FE",
  drop: "#FFFFFF",
  dropGlow: "#7DD3FC",
  prizeBg: "#FFFFFF",
  prizeTitle: "#0369A1",
  prizeText: "#0A2E22",
} as const;

/** "#RRGGBB" + alfa → "rgba(...)". */
export const withAlpha = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/** Música placeholder (pop ~116 BPM) y volúmenes de efectos. */
export const music = { file: "music.mp3", volume: 0.5, fadeIn: 0.2, fadeOut: 1 };
export const sfxVolume = {
  engine: 0.45,
  water: 0.4,
  /** El agua del montaje va más baja para no saturar. */
  waterMontage: 0.18,
  brush: 0.3,
  bubblePop: 0.35,
  sparkle: 0.4,
  drop: 0.5,
  unlock: 0.6,
  reverseBeep: 0.32,
};
