import React from "react";
import { art } from "../brand";

/**
 * Cepillos del túnel. `angle` = rotación acumulada (grados), `bend` = deformación (-1…1)
 * cuando el carro los empuja.
 * - "roller": rodillo superior visto de frente (círculo con cerdas que giran).
 * - "side": cepillo vertical; el giro se ve como franjas que corren.
 */
export const SpinningBrush: React.FC<{ kind: "roller" | "side"; angle: number; bend?: number; size: number; height?: number; scale?: number }> = ({
  kind,
  angle,
  bend = 0,
  size,
  height = 0,
  scale = 1,
}) => {
  if (kind === "roller") {
    const r = size / 2;
    const pts = Array.from({ length: 48 }, (_, i) => {
      const a = (i / 48) * Math.PI * 2;
      const rr = r * (0.9 + 0.08 * Math.sin(a * 8 + (angle * Math.PI) / 90) + 0.04 * bend * Math.cos(a));
      return `${r + rr * Math.cos(a)},${r + rr * Math.sin(a)}`;
    }).join(" ");
    return (
      <svg width={size} height={size} style={{ display: "block", overflow: "visible", transform: `scale(${scale})` }}>
        <polygon points={pts} fill={art.tunnel.brush} />
        <g transform={`rotate(${angle} ${r} ${r})`} stroke={art.tunnel.brushLight} strokeWidth={4} strokeLinecap="round">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={r} y1={r - r * 0.28} x2={r} y2={r - r * 0.82} transform={`rotate(${i * 30} ${r} ${r})`} />
          ))}
        </g>
        <circle cx={r} cy={r} r={r * 0.22} fill="#FFFFFF" />
        <circle cx={r} cy={r} r={r * 0.09} fill={art.tunnel.brush} />
      </svg>
    );
  }
  const shift = (angle / 360) * 60;
  return (
    <div
      style={{
        width: size,
        height,
        borderRadius: size / 2,
        transform: `scale(${scale}) skewX(${bend * 9}deg)`,
        transformOrigin: "50% 0%",
        background: `repeating-linear-gradient(90deg, ${art.tunnel.brush} 0px, ${art.tunnel.brush} 14px, ${art.tunnel.brushLight} 14px, ${art.tunnel.brushLight} 22px)`,
        backgroundPosition: `${shift}px 0`,
        boxShadow: "inset -10px 0 14px rgba(3, 105, 161, 0.35), inset 8px 0 10px rgba(255, 255, 255, 0.25)",
        opacity: 0.92,
      }}
    />
  );
};
