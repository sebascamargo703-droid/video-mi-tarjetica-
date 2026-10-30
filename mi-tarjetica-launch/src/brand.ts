/**
 * Tokens de marca de Mi Tarjetica.
 *
 * Verde e tinta salen pixel a pixel de los archivos oficiales del logo
 * (mi-tarjetica-logo-verde.png / mi-tarjetica-logo-tinta.png). El resto son
 * derivados del mismo tono (hue ≈ 168°) para que el acento funcione sobre negro
 * y sobre blanco sin salirse de la marca.
 */
export const brand = {
  name: "Mi Tarjetica",
  url: "mitarjetica.com",
  colors: {
    /** Verde oficial del logo. Acento principal. */
    green: "#0E5244",
    /** Verde más profundo para degradados y sombras. */
    greenDeep: "#083A30",
    /** Verde medio para estados activos sobre verde. */
    greenMid: "#16705D",
    /** Tinte claro del verde — acento legible sobre negro. */
    mint: "#69D3BE",
    /** Verde casi blanco para fondos suaves. */
    greenTint: "#E7F2EE",
    /** Tinta oficial del logo (negro cálido). */
    ink: "#1B1613",
    /** Papel cálido que acompaña la tinta. */
    cream: "#F6F2EA",

    black: "#0A0A0A",
    white: "#FFFFFF",
    gray: "#86868B",
    grayLight: "#F5F5F7",
    graySoft: "#D2D2D7",
    hairlineDark: "rgba(255,255,255,0.10)",
    hairlineLight: "rgba(0,0,0,0.08)",
  },
  radius: {
    card: 0.06, // fracción del ancho de la tarjeta
    pill: 999,
  },
} as const;

export type Tone = "dark" | "light" | "brand" | "cream";

/** Fondo + colores de texto para cada tono de escena. */
export const tones: Record<
  Tone,
  { bg: string; glow: string; fg: string; sub: string; accent: string }
> = {
  dark: {
    bg: brand.colors.black,
    glow: "rgba(14, 82, 68, 0.38)",
    fg: brand.colors.white,
    sub: brand.colors.gray,
    accent: brand.colors.mint,
  },
  light: {
    bg: brand.colors.white,
    glow: "rgba(14, 82, 68, 0.06)",
    fg: brand.colors.black,
    sub: brand.colors.gray,
    accent: brand.colors.green,
  },
  brand: {
    bg: brand.colors.green,
    glow: "rgba(105, 211, 190, 0.22)",
    fg: brand.colors.white,
    sub: "rgba(255,255,255,0.62)",
    accent: brand.colors.mint,
  },
  cream: {
    bg: brand.colors.cream,
    glow: "rgba(14, 82, 68, 0.08)",
    fg: brand.colors.ink,
    sub: "#857B72",
    accent: brand.colors.green,
  },
};

/**
 * Audio.
 *  - Voz: frases en src/voiceover.json → scripts/make-voice.py → public/voz/
 *  - Efectos: scripts/make-sfx.py → public/sfx/
 *  - Música: cama sintetizada con scripts/make-music.py. Para usar una canción
 *    con licencia, ponla en /public y cambia `music` (o `null` para quitarla).
 */
export const audio = {
  voice: true,
  voiceVolume: 1,
  music: "music/cama.mp3" as string | null,
  musicVolume: 0.22,
  /** Cuánto baja la música mientras habla la voz (0–1). */
  musicDuck: 0.55,
  sfxVolume: 0.6,
};
