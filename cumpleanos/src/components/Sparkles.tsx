import React from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { biz } from "../brand";
import { EASE, clamp } from "../motion";

/**
 * Destellos dorados sutiles (estrellas de 4 puntas) alrededor de un rectángulo.
 * Cada uno aparece, brilla y se apaga; escalonados, nada recargado.
 */
export const Sparkles: React.FC<{ at: number; rect: { x: number; y: number; w: number; h: number }; count?: number }> = ({ at, rect, count = 10 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const r = (k: string) => random(`spark-${i}-${k}`);
        const start = at + Math.round(r("t") * fps * 1.1);
        const life = Math.round(fps * (0.7 + r("l") * 0.4));
        const local = frame - start;
        if (local < 0 || local > life) return null;
        const p = local / life;
        const s = interpolate(p, [0, 0.35, 1], [0, 1, 0], { ...clamp, easing: EASE });
        // Posición en el borde del rectángulo (con un poco de margen hacia afuera).
        const side = Math.floor(r("side") * 4);
        const along = r("a");
        const out = 18 + r("o") * 26;
        const x = side === 0 ? rect.x + along * rect.w : side === 1 ? rect.x + rect.w + out : side === 2 ? rect.x + along * rect.w : rect.x - out;
        const y = side === 0 ? rect.y - out : side === 1 ? rect.y + along * rect.h : side === 2 ? rect.y + rect.h + out : rect.y + along * rect.h;
        const size = 22 + r("s") * 22;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="-10 -10 20 20"
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2 - p * 14,
              transform: `scale(${s}) rotate(${p * 45}deg)`,
              filter: `drop-shadow(0 0 6px ${biz.accent})`,
            }}
          >
            <path d="M0 -10 Q1.6 -1.6 10 0 Q1.6 1.6 0 10 Q-1.6 1.6 -10 0 Q-1.6 -1.6 0 -10z" fill="#F3DFB0" />
          </svg>
        );
      })}
    </>
  );
};
