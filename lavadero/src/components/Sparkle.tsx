import React from "react";
import { palette } from "../brand";

/** Destello de 4 puntas: aparece con pop, gira y se apaga. `k` 0–1 = vida del destello. */
export const Sparkle: React.FC<{ x: number; y: number; size: number; k: number; color?: string }> = ({ x, y, size, k, color = palette.accent }) => {
  if (k <= 0 || k >= 1) return null;
  const sc = k < 0.35 ? (k / 0.35) * 1.15 : 1.15 - (k - 0.35) * 1.4;
  const r = size / 2;
  return (
    <svg style={{ position: "absolute", left: x - r, top: y - r, overflow: "visible" }} width={size} height={size}>
      <g transform={`translate(${r} ${r}) rotate(${k * 90}) scale(${Math.max(0, sc)})`} opacity={k > 0.7 ? (1 - k) / 0.3 : 1}>
        <path d={`M0 ${-r} Q${r * 0.14} ${-r * 0.14} ${r} 0 Q${r * 0.14} ${r * 0.14} 0 ${r} Q${-r * 0.14} ${r * 0.14} ${-r} 0 Q${-r * 0.14} ${-r * 0.14} 0 ${-r} Z`} fill={color} />
        <circle r={r * 0.16} fill="#FFFFFF" />
      </g>
    </svg>
  );
};
