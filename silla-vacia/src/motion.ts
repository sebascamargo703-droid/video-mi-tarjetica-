import { Easing, interpolate, spring } from "remotion";
import type { V3 } from "./constants";
import { VIDEO } from "./constants";

/** Curvas de easing del proyecto (nada lineal). */
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // salida suave tipo "expo"
  inOut: Easing.bezier(0.65, 0, 0.35, 1), // cámara y movimientos largos
  soft: Easing.bezier(0.4, 0, 0.2, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
} as const;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 entre los segundos `a` y `b`, con easing. */
export const seg = (t: number, a: number, b: number, easing: (x: number) => number = EASE.inOut) =>
  interpolate(t, [a, b], [0, 1], { ...clamp, easing });

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const lerp3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

/** Spring 0 → 1 que arranca en el segundo `at` (con rebote si `bouncy`). */
export const pop = (t: number, at: number, bouncy = true) =>
  t < at
    ? 0
    : spring({
        frame: (t - at) * VIDEO.fps,
        fps: VIDEO.fps,
        config: bouncy ? { damping: 11, stiffness: 190, mass: 0.9 } : { damping: 200 },
      });

/** Pseudoaleatorio determinista (0..1) a partir de un índice. */
export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
