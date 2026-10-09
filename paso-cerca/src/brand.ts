/**
 * Tokens de marca de Mi Tarjetica para el video PasoCerca.
 *
 * Verde y tinta salen pixel a pixel de los archivos oficiales del logo
 * (mitarjetica.com no fue accesible desde el entorno de producción).
 * El resto son derivados del mismo tono para contraste AA sobre negro.
 */
export const brand = {
  colors: {
    /** Fondo del video: el primer y el último frame son exactamente este color (loop). */
    black: "#0A0A0A",
    white: "#FFFFFF",
    /** Texto secundario sobre negro (5.5:1). */
    gray: "#86868B",
    /** Verde oficial del logo. */
    green: "#0E5244",
    greenMid: "#16705D",
    greenDeep: "#083A30",
    /** Acento sobre negro (11:1): pin, anillo, "mitarjetica.com". */
    mint: "#69D3BE",
    ink: "#1B1613",
    cream: "#F6F2EA",
  },
  map: {
    ground: "#0A0A0A",
    block: "rgba(255,255,255,0.045)",
    park: "rgba(20,91,68,0.30)",
    street: "rgba(255,255,255,0.075)",
    streetLine: "rgba(255,255,255,0.12)",
  },
  /** Colores de la michelada (ilustración). */
  drink: {
    beerTop: "#E9A23B",
    beerBottom: "#B5481F",
    rimSalt: "#F4EDE4",
    rimChile: "#C8372D",
    lime: "#8BC34A",
    limeDark: "#4E7D24",
  },
} as const;

/**
 * Música: pon aquí su BPM si la cambias (la caminata y los golpes no dependen del beat,
 * pero sirve de referencia para editar).
 */
export const music = { file: "music.mp3", bpm: 100, volume: 0.42 };

export const sfxVolume = {
  street: 0.3,
  ringPulse: 0.5,
  whoosh: 0.4,
  haptic: 0.5,
  notification: 0.55,
  tap: 0.5,
  pop: 0.5,
};
