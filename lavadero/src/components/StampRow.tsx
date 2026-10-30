import React from "react";
import { card } from "../brand";
import { Drop } from "./Drop";

/**
 * Fila de 10 gotas (sellos). `fill[k]` 0–1(+rebote) = gota llena con pop; `ring[k]` 0–1 = anillo
 * expansivo al llenarse. Las posiciones las da `cardGeom` (también las usa la gota voladora).
 */
export const StampRow: React.FC<{ centers: { x: number; y: number }[]; size: number; fill: number[]; ring: number[] }> = ({ centers, size, fill, ring }) => (
  <>
    {centers.map((c, k) => (
      <div key={k} style={{ position: "absolute", left: c.x - size / 2, top: c.y - size / 2, width: size, height: size }}>
        {ring[k] > 0 && ring[k] < 1 ? (
          <div
            style={{
              position: "absolute",
              left: size / 2 - size * 0.6,
              top: size / 2 - size * 0.6,
              width: size * 1.2,
              height: size * 1.2,
              borderRadius: "50%",
              border: `3px solid ${card.dropGlow}`,
              transform: `scale(${0.6 + ring[k] * 1.4})`,
              opacity: 1 - ring[k],
            }}
          />
        ) : null}
        <Drop size={size} fill={card.drop} stroke="rgba(255, 255, 255, 0.6)" strokeWidth={1.8} highlight={card.dropGlow} fillScale={fill[k]} />
      </div>
    ))}
  </>
);
