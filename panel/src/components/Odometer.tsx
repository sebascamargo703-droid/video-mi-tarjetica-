import React from "react";
import { font } from "../fonts";
import { ease } from "../motion";

/**
 * Número tipo odómetro: cada dígito rueda en vertical por su cuenta (arrancan de izquierda a
 * derecha y las unidades dan más vueltas) y termina con un rebote leve. Usa cifras tabulares.
 */
export const Odometer: React.FC<{
  value: number;
  frame: number;
  fps: number;
  /** Frame en que empieza a rodar. */
  at: number;
  size: number;
  color: string;
  /** Duración del giro (frames). */
  dur?: number;
}> = ({ value, frame, fps, at, size, color, dur = 80 }) => {
  const digits = String(value).split("").map(Number);
  const n = digits.length;
  const lineH = size * 1.08;
  return (
    <div
      style={{
        display: "flex",
        fontFamily: font,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "-0.03em",
        color,
        fontVariantNumeric: "tabular-nums",
        lineHeight: `${lineH}px`,
      }}
    >
      {digits.map((d, i) => {
        const fromRight = n - 1 - i;
        const start = at + i * 5; // izquierda → derecha, 5 frames entre dígitos
        const myDur = dur - i * 4;
        const roll = d + 10 * fromRight; // las unidades dan más vueltas
        const posAt = (f: number) => {
          let p = roll * ease(f, start, myDur);
          const land = start + myDur * 0.62;
          if (f > land) {
            const t = (f - land) / fps;
            p += 0.2 * Math.sin(t * Math.PI * 2 * 2.2) * Math.exp(-t * 7);
          }
          return p;
        };
        const pos = posAt(frame);
        const speed = Math.abs(posAt(frame + 1) - pos);
        const base = Math.floor(pos);
        const frac = pos - base;
        const a = ((base % 10) + 10) % 10;
        const b = (a + 1) % 10;
        const blur = Math.min(5, speed * 6);
        return (
          <div key={i} style={{ position: "relative", width: "0.62em", height: lineH, overflow: "hidden", textAlign: "center" }}>
            <div style={{ position: "absolute", inset: 0, transform: `translateY(${-frac * lineH}px)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
              <div style={{ height: lineH }}>{a}</div>
              <div style={{ height: lineH }}>{b}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
