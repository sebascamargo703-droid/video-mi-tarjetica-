import React from "react";
import { brand } from "../brand";
import { MAP, STREETS } from "../layout";

/**
 * Mapa minimalista visto desde arriba con inclinación 3D (perspective 2000px, rotateX 45°).
 * Calles en gris tenue y manzanas como bloques sutiles; sin nombres de calles.
 * `children` se dibuja sobre el plano (geocerca, estela…).
 */
export const StreetMap: React.FC<{ children?: React.ReactNode; opacity?: number; lift?: number }> = ({ children, opacity = 1, lift = 0 }) => {
  const { vertical: vs, horizontal: hs, width: sw } = STREETS;
  const xs = [0, ...vs, MAP.w];
  const ys = [0, ...hs, MAP.h];
  const blocks: { x: number; y: number; w: number; h: number; park: boolean }[] = [];
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      const x0 = xs[i] + (i === 0 ? 0 : sw / 2) + 14;
      const x1 = xs[i + 1] - (i + 1 === xs.length - 1 ? 0 : sw / 2) - 14;
      const y0 = ys[j] + (j === 0 ? 0 : sw / 2) + 14;
      const y1 = ys[j + 1] - (j + 1 === ys.length - 1 ? 0 : sw / 2) - 14;
      blocks.push({ x: x0, y: y0, w: x1 - x0, h: y1 - y0, park: i === 2 && j === 2 });
    }
  }
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: MAP.perspective,
        perspectiveOrigin: `${MAP.cx}px ${MAP.cy}px`,
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: MAP.cx - MAP.w / 2,
          top: MAP.cy - MAP.h / 2,
          width: MAP.w,
          height: MAP.h,
          transform: `translateY(${lift}px) rotateX(${MAP.tiltDeg}deg)`,
          transformOrigin: "center center",
          background: brand.map.ground,
        }}
      >
        <svg width={MAP.w} height={MAP.h} style={{ position: "absolute", inset: 0 }}>
          {blocks.map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={22} fill={b.park ? brand.map.park : brand.map.block} />
          ))}
          {/* Subdivisiones suaves dentro de las manzanas (edificios) */}
          {blocks
            .filter((b) => !b.park)
            .map((b, i) => (
              <line key={`d${i}`} x1={b.x + b.w / 2} y1={b.y + 18} x2={b.x + b.w / 2} y2={b.y + b.h - 18} stroke="rgba(255,255,255,0.03)" strokeWidth={3} />
            ))}
          {vs.map((x) => (
            <g key={`v${x}`}>
              <rect x={x - sw / 2} y={0} width={sw} height={MAP.h} fill={brand.map.street} />
              <line x1={x} y1={0} x2={x} y2={MAP.h} stroke={brand.map.streetLine} strokeWidth={3} strokeDasharray="26 30" />
            </g>
          ))}
          {hs.map((y) => (
            <g key={`h${y}`}>
              <rect x={0} y={y - sw / 2} width={MAP.w} height={sw} fill={brand.map.street} />
              <line x1={0} y1={y} x2={MAP.w} y2={y} stroke={brand.map.streetLine} strokeWidth={3} strokeDasharray="26 30" />
            </g>
          ))}
        </svg>
        {children}
        {/* Niebla hacia el horizonte */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${brand.colors.black} 0%, rgba(10,10,10,0) 30%)`, pointerEvents: "none" }} />
      </div>
    </div>
  );
};
