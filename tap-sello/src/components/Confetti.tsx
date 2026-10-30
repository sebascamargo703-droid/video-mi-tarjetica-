import React from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { clamp } from "../motion";

/** Confeti mínimo: pocas piezas en colores de marca que suben un poco y caen suave. */
export const Confetti: React.FC<{ at: number; x: number; y: number; count?: number }> = ({ at, x, y, count = 13 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = (frame - at) / fps;
  if (local < 0 || local > 2.1) return null;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const r = (k: string) => random(`confeti-${i}-${k}`);
        const angle = -Math.PI / 2 + (r("a") - 0.5) * 2.0;
        const speed = 520 + r("s") * 380;
        const drag = 2.2;
        const k = (1 - Math.exp(-drag * local)) / drag;
        const px = x + Math.cos(angle) * speed * k + Math.sin(local * 3 + i) * 10;
        const py = y + Math.sin(angle) * speed * k + 0.5 * 520 * local * local * 0.55;
        const rot = (r("r") - 0.5) * 720 * local;
        const flip = Math.cos(local * (4 + r("f") * 4));
        const opacity = interpolate(local, [0, 0.08, 1.2, 2.0], [0, 1, 1, 0], clamp);
        const color = brand.confetti[i % brand.confetti.length];
        const round = i % 3 === 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: round ? 18 : 13,
              height: round ? 18 : 28,
              borderRadius: round ? "50%" : 3,
              background: color,
              opacity,
              transform: `rotate(${rot}deg) scaleX(${round ? 1 : flip})`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            }}
          />
        );
      })}
    </>
  );
};
