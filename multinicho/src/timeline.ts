/**
 * Coreografía en BEATS (no en frames). A 120 BPM, 1 beat = 0.5 s.
 * `card` es la lista de estados de la tarjeta: en el beat `beat` pasa al nicho `niche`
 * (índice en niches.ts) o a "final" ("Tu negocio").
 */
export const DURATION_SEC = 18;
export const FPS = 60;

export const B = {
  hookExit: 3.45,
  cardIn: 4,
  /** Pre-ruido del riser y ventana del motion blur (repaso ultrarrápido). */
  riserFrom: 17,
  blurFrom: 20.3,
  blurTo: 22.3,
  /** Silencio de un beat en la música (el "drop") entre `drop` y `land`. */
  drop: 22,
  land: 23,
  logo: 24,
  colors: 26,
  reward: 28,
  cardOut: 29.75,
  cta: 30,
};

export const card: { beat: number; niche: number | "final" }[] = [
  { beat: B.cardIn, niche: 0 }, // Barberías
  // Primera ronda: un cambio cada 2 beats (1 s)
  { beat: 6, niche: 1 },
  { beat: 8, niche: 2 },
  { beat: 10, niche: 3 },
  { beat: 12, niche: 4 },
  { beat: 14, niche: 5 },
  { beat: 16, niche: 6 },
  // Aceleración: un cambio por beat (0.5 s)
  { beat: 18, niche: 7 },
  { beat: 19, niche: 8 },
  { beat: 20, niche: 9 },
  // Repaso ultrarrápido: cada medio beat
  { beat: 20.5, niche: 0 },
  { beat: 21, niche: 1 },
  { beat: 21.5, niche: 3 },
  { beat: 22, niche: 4 },
  // Aterrizaje después del silencio
  { beat: B.land, niche: "final" },
];

/** "Tus colores": la tarjeta pasa rápido por estos nichos y vuelve a blanco. */
export const colorCycle = { from: B.colors, step: 0.25, niches: [3, 1, 4, 9] };
