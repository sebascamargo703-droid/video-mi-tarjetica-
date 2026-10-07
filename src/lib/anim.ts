import type React from "react";
import { interpolate, spring } from "remotion";
import { springs } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Progreso 0→1 de una entrada con spring suave (damping alto). */
export const enterProgress = (
  frame: number,
  fps: number,
  delay = 0,
  config: { damping: number; stiffness: number; mass: number } = springs.smooth,
) => spring({ frame: frame - delay, fps, config });

/**
 * Entrada estándar del sistema: fade + translateY 40u + blur 12u → 0.
 * Devuelve un objeto de estilo listo para aplicar.
 */
export const enterStyle = (p: number, u: number, distance = 40): React.CSSProperties => ({
  opacity: interpolate(p, [0, 0.6], [0, 1], clamp),
  transform: `translate3d(0, ${(1 - p) * distance * u}px, 0)`,
  filter: `blur(${Math.max(0, (1 - p) * 12 * u)}px)`,
});

/** Salida simétrica (para cuando un elemento se va antes de que acabe la escena). */
export const exitStyle = (p: number, u: number, distance = 24): React.CSSProperties => ({
  opacity: 1 - p,
  transform: `translate3d(0, ${-p * distance * u}px, 0)`,
  filter: `blur(${p * 10 * u}px)`,
});

/** Desvanecido de salida al final de una secuencia de `duration` frames. */
export const outro = (frame: number, duration: number, length = 10) =>
  interpolate(frame, [duration - length, duration], [1, 0], clamp);

export { clamp };
