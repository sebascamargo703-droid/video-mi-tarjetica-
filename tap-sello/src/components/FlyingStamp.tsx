import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { EASE_INOUT, clamp } from "../motion";
import { Check } from "./Stamp";

type P = { x: number; y: number };
const bezier = (a: P, c: P, b: P, t: number): P => ({
  x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t ** 2 * b.x,
  y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t ** 2 * b.y,
});

/**
 * Sello luminoso que viaja en arco (bezier cuadrática) del botón a la tarjeta,
 * con una estela suave. Llega exactamente en `start + dur`.
 */
export const FlyingStamp: React.FC<{ from: P; to: P; start: number; dur: number; size: number; lift?: number }> = ({
  from,
  to,
  start,
  dur,
  size,
  lift = 320,
}) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  if (local < 0 || local > dur + 1) return null;
  const ctrl = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - lift };
  const tAt = (f: number) => interpolate(f, [0, dur], [0, 1], { ...clamp, easing: EASE_INOUT });
  const t = tAt(local);
  const trail = Array.from({ length: 9 }, (_, k) => k + 1);
  const scaleAt = (tt: number) => 0.7 + 0.5 * Math.sin(Math.PI * tt) + 0.3 * tt;
  return (
    <>
      {trail.map((k) => {
        const tt = tAt(local - k * 0.9);
        if (tt <= 0 || tt >= t) return null;
        const p = bezier(from, ctrl, to, tt);
        const sc = scaleAt(tt) * (1 - k * 0.07);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: p.x - size / 2,
              top: p.y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: brand.colors.mint,
              opacity: 0.32 * (1 - k / 10),
              transform: `scale(${sc})`,
              filter: `blur(${2 + k * 0.8}px)`,
            }}
          />
        );
      })}
      {(() => {
        const p = bezier(from, ctrl, to, t);
        const sc = scaleAt(t);
        return (
          <div
            style={{
              position: "absolute",
              left: p.x - size / 2,
              top: p.y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: brand.colors.mint,
              transform: `scale(${sc}) rotate(${t * 220}deg)`,
              boxShadow: `0 0 ${size * 0.6}px ${brand.colors.mint}, 0 0 ${size * 1.4}px rgba(105,211,190,0.55)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: local > dur ? 0 : 1,
            }}
          >
            <Check size={size * 0.55} color={brand.colors.greenDeep} />
          </div>
        );
      })()}
    </>
  );
};
