/**
 * Tokens de color.
 *
 * - `brand`: Mi Tarjetica (gancho y cierre). Verde y tinta salen pixel a pixel del logo
 *   oficial (mitarjetica.com no fue accesible desde el entorno de producción).
 * - `biz`: paleta del NEGOCIO (solo dentro de la notificación, la tarjeta y la ilustración).
 *   Cámbiala para sacar versiones de spa, barbería, peluquería o cafetería.
 */
export const brand = {
  colors: {
    /** Fondo del gancho y del cierre: primer y último frame son exactamente este color (loop). */
    black: "#0A0A0A",
    white: "#FFFFFF",
    /** Fondo del calendario y del celular. */
    cream: "#FAF7F5",
    /** Texto secundario sobre negro (5.5:1). */
    gray: "#86868B",
    /** Texto secundario sobre crema: #86868B no pasa AA en crema (3.4:1); este sí (4.75:1). */
    grayOnCream: "#6E6E73",
    /** Verde oficial del logo de Mi Tarjetica. */
    green: "#0E5244",
    /** Acento de Mi Tarjetica sobre negro (11:1). */
    mint: "#69D3BE",
  },
} as const;

/** Paleta del negocio (Bella Nails). */
export const biz = {
  /** Rosa empolvado: día del cumpleaños, sellos, esmalte. */
  primary: "#E8B4B8",
  /** Vino: fondo de la tarjeta, badge. Blanco encima = 9.2:1. */
  deep: "#7A2E3A",
  /** Vino más oscuro para el degradado de la tarjeta. */
  deeper: "#5A1F2A",
  /** Dorado suave: banda de regalo, destellos, tapa del esmalte. */
  accent: "#C9A46A",
  /** Texto sobre el dorado (6.2:1). El vino #7A2E3A sobre dorado no pasa AA (3.95:1). */
  onAccent: "#4A1820",
  /** Fondo de pantalla del celular (cálido y oscuro, para que el vidrio se note). */
  wallpaperBase: "#1E0F14",
} as const;

/** Música (si la cambias, anota su BPM: el pulso del calendario es independiente). */
export const music = { file: "music.mp3", bpm: 94, volume: 0.5 };

export const sfxVolume = {
  /** Volumen máximo del tick del calendario; baja automáticamente cuando acelera. */
  tickMax: 0.55,
  tickMin: 0.12,
  whoosh: 0.45,
  haptic: 0.5,
  notification: 0.55,
  sparkle: 0.45,
  tap: 0.5,
  pop: 0.5,
};
