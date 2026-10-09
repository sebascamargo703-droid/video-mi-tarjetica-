import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, ease } from "../motion";

/**
 * Reloj tipo odómetro: cada dígito que cambia rueda hacia arriba (el nuevo entra desde abajo).
 * `from` y `to` deben tener el mismo largo (ej. "8:59" → "9:00").
 */
export const RollingClock: React.FC<{ from: string; to: string; at: number; size: number; color: string }> = ({ from, to, at, size, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = size * 1.05;
  return (
    <div style={{ display: "flex", justifyContent: "center", fontSize: size, lineHeight: `${h}px`, height: h, color, fontVariantNumeric: "tabular-nums" }}>
      {to.split("").map((ch, i) => {
        const a = from[i] ?? ch;
        if (a === ch) return <span key={i}>{ch}</span>;
        // Los dígitos de la derecha ruedan primero, como un reloj real.
        const p = ease(frame, at + (to.length - 1 - i) * 3, Math.round(fps * 0.55), EASE);
        return (
          <span key={i} style={{ display: "inline-block", height: h, overflow: "hidden" }}>
            <span style={{ display: "block", transform: `translateY(${-p * h}px)` }}>
              <span style={{ display: "block", height: h }}>{a}</span>
              <span style={{ display: "block", height: h }}>{ch}</span>
            </span>
          </span>
        );
      })}
    </div>
  );
};
