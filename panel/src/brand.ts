/**
 * Marca, paleta y contraste. Todos los pares texto/fondo usados en el video cumplen AA (≥ 4.5:1):
 *   sobre el verde #145B44 → blanco 8.05 · textSecondary 5.05 · accent 5.33
 *   dentro del panel blanco → panelText 14.6 · panelTextSecondary 5.18 (4.84 sobre panelSurface)
 *                             brand 8.05 · alerta #B42318/#FDE2DE 5.36 · éxito #145B44/#DCF2E9 6.87
 */
export const palette = {
  /** Verde Mi Tarjetica: único color de marca. Sobre el fondo verde nunca va directo. */
  brand: "#145B44",
  bg: "#145B44",
  bgDeep: "#0E4433",
  textPrimary: "#FFFFFF",
  textSecondary: "#A7D7C5",
  accent: "#8FE3C0",

  /* Panel (fondo blanco): aquí el verde de marca sí se usa en números, gráficos y barras. */
  panelBg: "#FFFFFF",
  panelSurface: "#F4F8F6",
  panelBorder: "#E2ECE7",
  panelText: "#0A2E22",
  panelTextSecondary: "#5B7268",

  alertBg: "#FDE2DE",
  alertText: "#B42318",
  successBg: "#DCF2E9",
  successText: "#145B44",

  /** #0A2E22 al 50 %: sombra amplia y suave del panel. */
  shadow: "rgba(10, 46, 34, 0.5)",
} as const;

/** "#RRGGBB" + alfa → "rgba(...)". */
export const withAlpha = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/** Música placeholder (~104 BPM) y volúmenes de efectos. */
export const music = { file: "music.mp3", volume: 0.5, fadeIn: 0.3, fadeOut: 1 };
export const sfxVolume = { whoosh: 0.5, tickRoll: 0.28, draw: 0.35, row: 0.18, alert: 0.42, pop: 0.4 };
