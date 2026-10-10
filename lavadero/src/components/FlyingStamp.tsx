import React from "react";
import { card } from "../brand";
import { Drop } from "./Drop";

/**
 * Gota luminosa que sale del túnel y viaja en arco hasta su lugar en la tarjeta.
 * `p` 0–1 (ya con easing). Deja una estela corta y se encoge al tamaño del sello.
 */
export const FlyingStamp: React.FC<{ from: { x: number; y: number }; to: { x: number; y: number }; p: number; size: number; endSize: number; lift?: number }> = ({
  from,
  to,
  p,
  size,
  endSize,
  lift = 180,
}) => {
  if (p <= 0 || p >= 1) return null;
  const ctrl = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - lift };
  const at = (q: number) => {
    const u = Math.max(0, Math.min(1, q));
    return {
      x: (1 - u) ** 2 * from.x + 2 * (1 - u) * u * ctrl.x + u * u * to.x,
      y: (1 - u) ** 2 * from.y + 2 * (1 - u) * u * ctrl.y + u * u * to.y,
    };
  };
  const sz = size + (endSize - size) * p;
  const appear = Math.min(1, p / 0.12);
  return (
    <>
      {[0.09, 0.06, 0.03].map((dq, i) => {
        const q = at(p - dq);
        const r = sz * (0.16 + i * 0.06);
        return <div key={i} style={{ position: "absolute", left: q.x - r, top: q.y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: card.dropGlow, opacity: 0.35 * appear * (i + 1) / 3 }} />;
      })}
      {(() => {
        const q = at(p);
        return (
          <div style={{ position: "absolute", left: q.x - sz / 2, top: q.y - sz / 2, width: sz, height: sz, opacity: appear, filter: `drop-shadow(0 0 ${sz * 0.35}px ${card.dropGlow}) drop-shadow(0 0 ${sz * 0.15}px #FFFFFF)` }}>
            <Drop size={sz} fill="#FFFFFF" highlight={card.dropGlow} />
          </div>
        );
      })()}
    </>
  );
};
