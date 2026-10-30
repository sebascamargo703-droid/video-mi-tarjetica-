/**
 * Paleta de las historias de "Precios". No hay #FFFFFF en ninguna parte: el color más claro es
 * `light` #F6F4EB. Las tarjetas de plan (light) van sobre verde o latte, nunca light sobre light.
 *
 * Contraste AA verificado (texto):
 *   brand #145B44 sobre light 7.3 · sobre latte 5.96
 *   ink #2B1D14 sobre light 14.8 · sobre latte 12.1 · sobre caramel 6.12 (etiqueta "Te ahorras")
 *   inkSecondary #6E5B4E sobre light 5.83 · sobre latte 4.76
 *   sobre verde: light 7.3 · #A7D7C5 5.05 · #8FE3C0 5.33 · #0E4433 sobre #8FE3C0 7.35
 *
 * El caramelo #C8963E solo va en líneas finas y como fondo de etiquetas (con texto ink): como
 * texto sobre fondos claros no alcanza AA.
 */
export const palette = {
  brand: "#145B44",
  light: "#F6F4EB",
  latte: "#E9DCCB",
  caramel: "#C8963E",
  ink: "#2B1D14",
  inkSecondary: "#6E5B4E",
  green: "#145B44",
  greenDeep: "#0E4433",
  onGreen: "#F6F4EB",
  onGreenSecondary: "#A7D7C5",
  onGreenAccent: "#8FE3C0",
  /** #0A2E22 al 35 %: sombra amplia de las tarjetas. */
  shadow: "rgba(10, 46, 34, 0.35)",
} as const;

export type Bg = "green" | "latte" | "light";

export const onBg = (bg: Bg) =>
  bg === "green"
    ? { title: palette.onGreen, text: palette.onGreen, secondary: palette.onGreenSecondary, accent: palette.onGreenAccent, logo: palette.onGreen }
    : { title: palette.brand, text: palette.ink, secondary: palette.inkSecondary, accent: palette.brand, logo: palette.brand };

export const lightA = (a: number) => `rgba(246, 244, 235, ${a})`;

/** Grilla de historia 1080×1920 con zonas seguras de Instagram. */
export const story = {
  w: 1080,
  h: 1920,
  m: 96,
  /** Barra de perfil arriba y barra de respuesta abajo: nada importante ahí. */
  safeTop: 250,
  safeBottom: 1920 - 340,
  /** Fila del logo y el indicador "Precios · n/8". */
  headerY: 282,
} as const;
