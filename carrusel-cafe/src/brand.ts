/**
 * Paleta del carrusel (café de especialidad + verde Mi Tarjetica).
 *
 * Contraste AA verificado (texto):
 *   brand #145B44 sobre bgCream 7.54 · sobre latte 5.96
 *   ink #2B1D14 sobre latte 12.1 · inkSecondary #6E5B4E sobre latte 4.76, sobre crema 6.02, sobre blanco 6.42
 *   sobre verde: blanco 8.05 · #A7D7C5 5.05 · #8FE3C0 5.33
 *   blanco sobre coffee #6B4423 8.48 · latte sobre coffee 6.29
 *   alerta #B42318 sobre #FDE2DE 5.36
 *
 * El caramelo #C8963E no llega a AA como texto sobre fondos claros (2.5 sobre crema, 1.97 sobre
 * latte): se usa tal cual solo en líneas finas y adornos. Para los números "01"–"05" se usa
 * `caramelText` (#7A531A, 5.05 sobre latte) en láminas claras y `caramelOnGreen` (#E4C17E) en verdes.
 */
export const palette = {
  /** Verde Mi Tarjetica: único color de marca. Nunca directo sobre el fondo verde. */
  brand: "#145B44",
  bgCream: "#FAF7F5",
  latte: "#E9DCCB",
  coffee: "#6B4423",
  caramel: "#C8963E",
  caramelText: "#7A531A",
  caramelOnGreen: "#E4C17E",
  ink: "#2B1D14",
  inkSecondary: "#6E5B4E",
  white: "#FFFFFF",

  /* Fondo verde */
  green: "#145B44",
  greenDeep: "#0E4433",
  onGreen: "#FFFFFF",
  onGreenSecondary: "#A7D7C5",
  onGreenAccent: "#8FE3C0",

  alertBg: "#FDE2DE",
  alertText: "#B42318",
  /** Sombras amplias y suaves (espresso). */
  shadow: "rgba(43, 29, 20, 0.18)",
  shadowStrong: "rgba(43, 29, 20, 0.32)",
} as const;

import type { Bg } from "./carousels";
export type { Bg };

/** Colores según el fondo de la lámina. */
export const onBg = (bg: Bg) =>
  bg === "green"
    ? { title: palette.onGreen, text: palette.onGreen, secondary: palette.onGreenSecondary, number: palette.caramelOnGreen, line: palette.caramel, logo: palette.onGreen, ornament: palette.caramel, ornamentOpacity: 0.5 }
    : { title: palette.brand, text: palette.ink, secondary: palette.inkSecondary, number: palette.caramelText, line: palette.caramel, logo: palette.brand, ornament: palette.coffee, ornamentOpacity: 0.25 };

export const withAlpha = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/** Grilla común: 1080×1350, márgenes de 96 px. */
export const grid = {
  w: 1080,
  h: 1350,
  m: 96,
  /** Fila "Lo que usaste: 01". */
  chargeY: 176,
  /** Titular de las láminas de lista. */
  titleY: 252,
  titleSize: 64,
  /** Zona del mockup. */
  visualTop: 500,
  visualBottom: 1150,
  /** Nota al pie. */
  noteY: 1168,
  /** Puntos del indicador. */
  dotsY: 1258,
} as const;
