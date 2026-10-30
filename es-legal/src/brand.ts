/**
 * Tokens de marca de Mi Tarjetica para "¿Es legal?".
 * Verde oficial del logo (#0E5244) y derivados; fondos verde-noche para que el mapa 3D
 * y los celulares resalten. Contraste AA de todo el texto sobre `bg`.
 */
export const brand = {
  colors: {
    /** Fondo general (primer y último frame). */
    bg: "#06120E",
    bgMid: "#0B2019",
    white: "#FFFFFF",
    /** Texto secundario sobre bg (8.9:1). */
    soft: "#A7C9BD",
    green: "#0E5244",
    greenMid: "#16705D",
    greenDeep: "#083A30",
    /** Acento sobre oscuro (10:1). */
    mint: "#69D3BE",
    /** Resaltador de los subtítulos (texto `ink` encima: 12:1). */
    highlight: "#8FE3C0",
    ink: "#06231B",
    cream: "#F6F2EA",
    red: "#FF5A52",
    warm: "#F2B35A",
  },
  map: {
    ground: "#040D0A",
    blockTop: "#113A2F",
    blockSide: "#082119",
    street: "#07160F",
    streetLine: "rgba(255,255,255,0.10)",
    storeTop: "#2FA37F",
    storeSide: "#17654F",
  },
} as const;

export const audio = {
  music: { file: "music.mp3", bpm: 96, volume: 0.32, duckTo: 0.14 },
  voice: { volume: 1 },
  sfx: { whoosh: 0.35, notification: 0.5, haptic: 0.45, tap: 0.45, pop: 0.4, ringPulse: 0.4, alarm: 0.25, scan: 0.4 },
};
