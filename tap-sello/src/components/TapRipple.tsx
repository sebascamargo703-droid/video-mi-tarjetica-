import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, clamp } from "../motion";

/** Onda que sale del punto de toque. Se dibuja dentro de un contenedor con overflow hidden. */
export const TapRipple: React.FC<{ at: number; x: number; y: number; size: number; color?: string }> = ({
  at,
  x,
  y,
  size,
  color = "rgba(255,255,255,0.45)",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - at;
  if (local < 0 || local > fps * 0.8) return null;
  const p = interpolate(local, [0, fps * 0.8], [0, 1], { ...clamp, easing: EASE });
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        transform: `scale(${0.1 + p * 1.9})`,
        opacity: 1 - p,
        pointerEvents: "none",
      }}
    />
  );
};
