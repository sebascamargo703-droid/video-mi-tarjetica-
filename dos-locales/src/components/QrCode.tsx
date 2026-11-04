import React from "react";
import { QR_MODULES } from "../qr";

/** Dibuja el QR real como SVG nítido (sirve para imprimir a cualquier tamaño). */
export const QrCode: React.FC<{ size: number; color: string; background: string; quiet?: number }> = ({ size, color, background, quiet = 2 }) => {
  const n = QR_MODULES.length;
  const total = n + quiet * 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${total} ${total}`} shapeRendering="crispEdges" style={{ display: "block" }}>
      <rect width={total} height={total} fill={background} />
      <g fill={color}>
        {QR_MODULES.flatMap((row, r) => [...row].map((v, c) => (v === "1" ? <rect key={`${r}-${c}`} x={c + quiet} y={r + quiet} width={1.02} height={1.02} /> : null)))}
      </g>
    </svg>
  );
};
