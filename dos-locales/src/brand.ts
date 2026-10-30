/**
 * Tokens de marca de Mi Tarjetica para "Dos locales".
 * Verde oficial (#0E5244) y menta para la marca; ámbar para el café lleno y azul frío
 * para el que está casi vacío. Texto AA sobre `bg`.
 */
export const brand = {
  colors: {
    bg: "#05080B",
    bgMid: "#0B1A15",
    white: "#FFFFFF",
    soft: "#A7C9BD",
    green: "#0E5244",
    greenMid: "#16705D",
    greenDeep: "#083A30",
    mint: "#69D3BE",
    highlight: "#8FE3C0",
    ink: "#06231B",
    cream: "#F6F2EA",
    red: "#FF5A52",
    warm: "#FFB866",
    cold: "#8DB4FF",
  },
} as const;

export const audio = {
  music: { file: "music.mp3", bpm: 92, volume: 0.3, duckTo: 0.12 },
  voice: { volume: 1 },
  sfx: { whoosh: 0.32, notification: 0.5, haptic: 0.45, tap: 0.45, pop: 0.4, ringPulse: 0.4 },
};
