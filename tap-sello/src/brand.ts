/**
 * Tokens de marca de Mi Tarjetica para el video TapSello.
 *
 * Verde y tinta salen pixel a pixel de los archivos oficiales del logo
 * (mitarjetica.com no fue accesible desde el entorno de producción).
 * Menta y verdes intermedios son derivados del mismo tono (hue ≈ 168°).
 */
export const brand = {
  colors: {
    /** Verde oficial del logo: botón "+1 sello", tarjeta, acentos. */
    green: "#0E5244",
    greenMid: "#16705D",
    greenDeep: "#083A30",
    /** Tinte del verde para acentos sobre negro (contraste AA sobre #0A0A0A). */
    mint: "#69D3BE",
    /** Tinta oficial del logo. */
    ink: "#1B1613",
    cream: "#F6F2EA",
    /** Fondo del video: el primer y el último frame son exactamente este color (loop). */
    black: "#0A0A0A",
    white: "#FFFFFF",
    /** Texto secundario sobre negro (contraste 5.5:1). */
    gray: "#86868B",
    /** Fondo verde para láminas (reemplaza al negro en los carruseles). */
    greenBg: "#145B44",
    /** Acento sobre greenBg (5.1:1 AA). La menta normal queda en 4.47:1. */
    mintOnGreen: "#7FE0C9",
    /** Texto secundario sobre greenBg (6.2:1 AA). El gris #86868B no pasa (2.2:1). */
    subOnGreen: "#C9E9E1",
    /** Texto secundario sobre blanco: #86868B no pasa AA en blanco (3.6:1); este sí (5.1:1). */
    grayOnLight: "#6E6E73",
    appBg: "#F5F5F7",
    hairline: "rgba(0,0,0,0.08)",
  },
  /** Confeti: piezas en colores de marca. */
  confetti: ["#69D3BE", "#0E5244", "#FFFFFF", "#F6F2EA", "#16705D"],
} as const;

/**
 * Ritmo de la música. Los tres taps y los sellos caen sobre el beat:
 * si cambias la canción, pon aquí su BPM y todo se re-sincroniza.
 */
export const music = {
  file: "music.mp3",
  bpm: 104,
  volume: 0.55,
  /** Beat (desde el inicio de la música) en que ocurre cada tap. Cada sello aterriza 1 beat después. */
  tapBeats: [8, 12, 16],
};

export const sfxVolume = {
  tap: 0.7,
  whoosh: 0.45,
  pop: 0.8,
  unlock: 0.7,
  notification: 0.7,
};
