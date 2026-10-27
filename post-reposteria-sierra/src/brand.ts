/**
 * Paleta del post: Mi Tarjetica (verde + claros) con los colores de la etiqueta de
 * Repostería Sierra (mantequilla #F7DC9E y cacao #160E0A).
 *
 * Contraste AA verificado (texto):
 *   light #F6F4EB sobre verde #145B44 7.3 · #A7D7C5 5.05 · #8FE3C0 5.33
 *   brand #145B44 sobre light 7.3 · sobre latte 5.96 · ink #2B1D14 sobre latte 12.1
 *   cacao #160E0A sobre mantequilla #F7DC9E 15+ (tarjeta de Sierra)
 *   light sobre el degradado oscuro de las fotos (≥ 85 % de #0B231A) > 10
 */
export const palette = {
  brand: "#145B44",
  greenDeep: "#0E4433",
  light: "#F6F4EB",
  latte: "#E9DCCB",
  caramel: "#C8963E",
  ink: "#2B1D14",
  inkSecondary: "#6E5B4E",
  onGreenSecondary: "#A7D7C5",
  onGreenAccent: "#8FE3C0",
  /** Repostería Sierra */
  butter: "#F7DC9E",
  cocoa: "#160E0A",
  shadow: "rgba(10, 46, 34, 0.35)",
} as const;

export const lightA = (a: number) => `rgba(246, 244, 235, ${a})`;
export const M = 96;
