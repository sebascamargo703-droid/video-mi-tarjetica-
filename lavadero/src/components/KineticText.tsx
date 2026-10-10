import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { font, tracking } from "../fonts";
import { EASE_IN, ease } from "../motion";

/**
 * Texto palabra por palabra: translateY 30 px + opacidad + blur 8 px → 0,
 * 3 frames entre palabras. Salida ≈60% más rápida. `*palabra*` = acento.
 */
export const KineticText: React.FC<{
  text: string;
  size: number;
  color: string;
  accent?: string;
  weight?: 400 | 600 | 800;
  delay?: number;
  exitAt?: number;
  stagger?: number;
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({ text, size, color, accent, weight = 800, delay = 0, exitAt = Infinity, stagger = 3, lineHeight = 1.04, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = Math.round(fps * 0.5);
  const exit = Math.round(enter * 0.6);
  let i = 0;
  let on = false;
  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: size >= 60 ? tracking.headline : tracking.body,
        color,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...style,
      }}
    >
      {text.split("\n").map((line, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.24em" }}>
          {line.split(" ").map((raw, wi) => {
            let w = raw;
            if (w.startsWith("*")) {
              on = true;
              w = w.slice(1);
            }
            const isAccent = on;
            if (w.endsWith("*")) {
              on = false;
              w = w.slice(0, -1);
            }
            const k = i++;
            const t = ease(frame, delay + k * stagger, enter);
            const o = exitAt === Infinity ? 0 : ease(frame, exitAt + Math.round(k * 0.8), exit, EASE_IN);
            const blur = (1 - t) * 8 + o * 6;
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  transform: `translateY(${(1 - t) * 30 - o * 18}px)`,
                  opacity: t * (1 - o),
                  filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                  color: isAccent && accent ? accent : undefined,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
