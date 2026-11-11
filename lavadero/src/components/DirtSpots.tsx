import React from "react";
import { art } from "../brand";

/** Manchas de barro sobre la carrocería (coordenadas del SVG del carro, 300×150). */
const SPOTS: { x: number; y: number; r: number }[] = [
  { x: 52, y: 96, r: 13 },
  { x: 112, y: 104, r: 10 },
  { x: 168, y: 92, r: 15 },
  { x: 232, y: 100, r: 11 },
  { x: 268, y: 90, r: 8 },
  { x: 138, y: 56, r: 8 },
  { x: 196, y: 110, r: 8 },
  { x: 30, y: 108, r: 8 },
];

/** Cada mancha es un manchón de 3 círculos; `levels[j]` = 1 sucia, 0 limpia (escala → 0 + opacidad). */
export const DirtSpots: React.FC<{ levels: number[] }> = ({ levels }) => (
  <g fill={art.dirt.color}>
    {SPOTS.map((sp, j) => {
      const k = levels[j] ?? 0;
      if (k <= 0.01) return null;
      return (
        <g key={j} transform={`translate(${sp.x} ${sp.y}) scale(${k})`} opacity={art.dirt.opacity * Math.min(1, k * 1.4)}>
          <circle r={sp.r} />
          <circle cx={sp.r * 0.8} cy={-sp.r * 0.35} r={sp.r * 0.55} />
          <circle cx={-sp.r * 0.7} cy={sp.r * 0.45} r={sp.r * 0.45} />
          <circle cx={sp.r * 1.25} cy={sp.r * 0.55} r={sp.r * 0.22} />
        </g>
      );
    })}
  </g>
);
