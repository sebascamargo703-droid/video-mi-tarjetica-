import { Easing, interpolate, spring, useVideoConfig } from "remotion";

/** Ease-out expo: la curva principal de todo el video. */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
/** Para salidas: arranca rápido y se va. */
export const EASE_OUT_FAST = Easing.bezier(0.55, 0, 0.75, 0.2);
/** Movimiento de cámara continuo. */
export const EASE_INOUT = Easing.bezier(0.45, 0, 0.55, 1);

/** Entradas suaves de objetos físicos (teléfono, tarjeta). */
export const SPRING_SOFT = { damping: 200, mass: 0.8 } as const;
/** El "pop" de cada sello. */
export const SPRING_POP = { damping: 12, stiffness: 180 } as const;

/** Las salidas duran ≈60% de la entrada. */
export const EXIT_RATIO = 0.6;

/** Helper de tiempo en segundos → frames. */
export const useS = () => {
  const { fps } = useVideoConfig();
  const s = (sec: number) => Math.round(sec * fps);
  return s;
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 0→1 con ease-out expo entre `start` y `start + dur`. */
export const ease = (
  frame: number,
  start: number,
  dur: number,
  easing = EASE,
) => interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing });

/** Entrada (0→1) y salida (1→0) en una sola curva de presencia. */
export const presence = (
  frame: number,
  enterAt: number,
  enterDur: number,
  exitAt = Infinity,
  exitDur = Math.round(enterDur * EXIT_RATIO),
) => {
  const inn = ease(frame, enterAt, enterDur);
  const out =
    exitAt === Infinity ? 0 : ease(frame, exitAt, exitDur, EASE_OUT_FAST);
  return inn * (1 - out);
};

export const softSpring = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: SPRING_SOFT });

export const popSpring = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: SPRING_POP });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
