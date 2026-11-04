import React from "react";
import { useVideoConfig } from "remotion";
import { fade } from "../brand";
import { ease, mix, pop } from "../motion";

/**
 * Sellos de la tarjeta. Al cambiar de nicho:
 * - los círculos se reacomodan (1 o 2 filas) con un pequeño pop,
 * - los que sobran se encogen y los nuevos aparecen,
 * - los sellos llenos se vacían y se vuelven a llenar de izquierda a derecha.
 */
export const StampRow: React.FC<{
  w: number;
  h: number;
  frame: number;
  /** Frame del cambio. */
  at: number;
  total: number;
  prevTotal: number;
  filled: number;
  prevFilled: number;
  ink: string;
  bg: string;
  emptyAlpha?: number;
  /** Frames entre un sello y el siguiente en el barrido de llenado. */
  sweep?: number;
}> = ({ w, h, frame, at, total, prevTotal, filled, prevFilled, ink, bg, emptyAlpha = 0.6, sweep = 1.1 }) => {
  const { fps } = useVideoConfig();
  const d = Math.min(w * 0.125, h * 0.4);
  const step = d * 1.3;
  const rowStep = d * 1.22;
  const place = (n: number, k: number) => {
    const rows = n > 6 ? 2 : 1;
    const per = Math.ceil(n / rows);
    const r = Math.floor(k / per);
    const c = k % per;
    const inRow = r === rows - 1 ? n - per * (rows - 1) : per;
    return { x: w / 2 + (c - (inRow - 1) / 2) * step, y: h / 2 + (r - (rows - 1) / 2) * rowStep };
  };
  const lp = ease(frame, at, 10);
  const bump = Math.sin(Math.PI * lp) * 0.12;
  const clear = ease(frame, at, 4);
  const slots = Math.max(total, prevTotal);

  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {Array.from({ length: slots }).map((_, k) => {
        const a = place(k < prevTotal ? prevTotal : total, k);
        const b = place(k < total ? total : prevTotal, k);
        const x = mix(a.x, b.x, lp);
        const y = mix(a.y, b.y, lp);
        const scale =
          k >= total ? 1 - ease(frame, at, 6) : k >= prevTotal ? pop(frame, fps, at + 2 + Math.round(k * 0.8)) : 1 + (prevTotal === total ? 0 : bump);
        if (scale <= 0.001) return null;
        const fillNew = k < filled ? pop(frame, fps, at + 3 + Math.round(k * sweep)) : 0;
        const fillOld = k < prevFilled ? 1 - clear : 0;
        const fill = Math.max(fillNew, fillOld);
        return (
          <div key={k} style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, transform: `scale(${scale})` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `${d * 0.055}px solid ${fade(ink, emptyAlpha)}` }} />
            {fill > 0.001 ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: ink,
                  transform: `scale(${fill})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width={d * 0.56} height={d * 0.56} viewBox="0 0 24 24">
                  <path d="M5.5 12.5 L10 17 L18.5 7.5" fill="none" stroke={bg} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
