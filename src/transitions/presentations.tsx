import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { clamp } from "../lib/anim";
import { easeOutQuint } from "../theme";

/**
 * Push lateral rápido (cubic-bezier 0.22, 1, 0.36, 1). Ambos planos son opacos
 * y se desplazan juntos, así que nunca se ve una capa inferior.
 * Se llama como función porque TransitionSeries necesita el elemento
 * <TransitionSeries.Transition> como hijo directo.
 */
export const renderSlide = (frames: number, key: string) => (
  <TransitionSeries.Transition
    key={key}
    presentation={slide({ direction: "from-right" })}
    timing={linearTiming({ durationInFrames: frames, easing: easeOutQuint })}
  />
);

/**
 * Punch-in: corte seco en el que el plano entrante "aterriza" con un zoom
 * 1.08 → 1.00 en `frames`. No hay solapamiento con el plano anterior.
 */
export const PunchIn: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, frames], [1.08, 1], { ...clamp, easing: easeOutQuint });
  return <AbsoluteFill style={{ transform: `scale(${scale})` }}>{children}</AbsoluteFill>;
};
