import { Easing, interpolate, spring, useVideoConfig } from "remotion";

/** Ease-out expo: la curva principal. */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
/** Para salidas y caídas (arranca suave, termina rápido). */
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
/** Para la cámara y movimientos largos. */
export const EASE_INOUT = Easing.bezier(0.65, 0, 0.35, 1);

export const SPRING_IN = { damping: 200 } as const;
/** Pop de sellos: 0 → ~1.15 → 1. */
export const SPRING_POP = { damping: 11, stiffness: 200 } as const;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const useS = () => {
  const { fps } = useVideoConfig();
  const s = (sec: number) => Math.round(sec * fps);
  return s;
};

/** 0 → 1 con ease-out expo entre `start` y `start + dur` (frames). */
export const ease = (frame: number, start: number, dur: number, easing = EASE) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing });

export const springIn = (frame: number, fps: number, at: number) =>
  spring({ frame: frame - at, fps, config: SPRING_IN });

export const pop = (frame: number, fps: number, at: number) =>
  frame < at ? 0 : spring({ frame: frame - at, fps, config: SPRING_POP });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

