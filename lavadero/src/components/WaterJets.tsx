import React from "react";
import { art, withAlpha } from "../brand";

/** Chorros que caen del techo del túnel: líneas discontinuas en loop. `on` 0–1 = intensidad. */
export const WaterJets: React.FC<{ x: number; y: number; w: number; h: number; time: number; on: number; nozzles?: number }> = ({ x, y, w, h, time, on, nozzles = 7 }) => {
  if (on <= 0.01) return null;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={w} height={h}>
      {Array.from({ length: nozzles }).map((_, i) => {
        const nx = (w / (nozzles - 1)) * i;
        const len = h * (0.35 + 0.65 * on);
        return (
          <g key={i}>
            <rect x={nx - 7} y={-8} width={14} height={10} rx={4} fill="#FFFFFF" opacity={0.9} />
            {[-6, 0, 6].map((dx, k) => (
              <line
                key={k}
                x1={nx + dx * 0.3}
                y1={4}
                x2={nx + dx * (1 + on)}
                y2={len}
                stroke={k === 1 ? "#FFFFFF" : art.water.tint}
                strokeOpacity={(k === 1 ? 0.85 : 0.6) * on}
                strokeWidth={k === 1 ? 4 : 3}
                strokeLinecap="round"
                strokeDasharray="18 16"
                strokeDashoffset={-(time * 420 + i * 11 + k * 7)}
              />
            ))}
          </g>
        );
      })}
      {/* bruma */}
      <rect x={-20} y={h * 0.45} width={w + 40} height={h * 0.6} rx={40} fill={withAlpha(art.water.tint, 0.12 * on)} />
    </svg>
  );
};
