import React from "react";
import { brand } from "../brand";
import { MAP, STORE, STREETS } from "../layout";

/**
 * Ciudad vista desde arriba con inclinación 3D (perspective + rotateX). Las manzanas tienen
 * "volumen": una cara frontal más oscura debajo de cada techo. `store` resalta el local en menta.
 * `children` se dibuja sobre el plano (geocerca, estelas…).
 */
export const StreetMap: React.FC<{ children?: React.ReactNode; opacity?: number; lift?: number; store?: number }> = ({ children, opacity = 1, lift = 0, store = 0 }) => {
  const { vertical: vs, horizontal: hs, width: sw } = STREETS;
  const xs = [0, ...vs, MAP.w];
  const ys = [0, ...hs, MAP.h];
  const blocks: { x: number; y: number; w: number; h: number }[] = [];
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      const x0 = xs[i] + (i === 0 ? 0 : sw / 2) + 16;
      const x1 = xs[i + 1] - (i + 1 === xs.length - 1 ? 0 : sw / 2) - 16;
      const y0 = ys[j] + (j === 0 ? 0 : sw / 2) + 16;
      const y1 = ys[j + 1] - (j + 1 === ys.length - 1 ? 0 : sw / 2) - 16;
      // cada manzana se parte en 2–3 edificios de distinta altura
      const cols = (i + j) % 2 === 0 ? 2 : 3;
      const bw = (x1 - x0 - (cols - 1) * 14) / cols;
      for (let c = 0; c < cols; c++) {
        const bx = x0 + c * (bw + 14);
        const half = (y1 - y0 - 14) / 2;
        blocks.push({ x: bx, y: y0, w: bw, h: half });
        blocks.push({ x: bx, y: y0 + half + 14, w: bw, h: half });
      }
    }
  }
  const depth = (b: { x: number; y: number }) => 26 + ((b.x * 7 + b.y * 13) % 5) * 9;
  const isStore = (b: { x: number; y: number; w: number; h: number }) =>
    b.x < STORE.x + STORE.w && b.x + b.w > STORE.x && b.y < STORE.y + STORE.h && b.y + b.h > STORE.y;
  return (
    <div style={{ position: "absolute", inset: 0, perspective: MAP.perspective, perspectiveOrigin: `${MAP.cx}px ${MAP.cy}px`, opacity }}>
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
          {blocks
            .filter((b) => !isStore(b))
            .map((b, i) => (
              <g key={i}>
                <rect x={b.x} y={b.y + depth(b)} width={b.w} height={b.h} rx={10} fill={brand.map.blockSide} />
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={10} fill={brand.map.blockTop} />
                <rect x={b.x + 1} y={b.y + 1} width={b.w - 2} height={8} rx={4} fill="rgba(255,255,255,0.05)" />
              </g>
            ))}
          {/* el local */}
          <g>
            <rect x={STORE.x} y={STORE.y + 64} width={STORE.w} height={STORE.h} rx={12} fill={brand.map.storeSide} opacity={0.35 + 0.65 * store} />
            <rect x={STORE.x} y={STORE.y} width={STORE.w} height={STORE.h} rx={12} fill={store > 0 ? brand.map.storeTop : brand.map.blockTop} opacity={store > 0 ? 0.35 + 0.65 * store : 1} />
          </g>
        </svg>
        {store > 0 ? (
          <div style={{ position: "absolute", left: STORE.x - 60, top: STORE.y - 60, width: STORE.w + 120, height: STORE.h + 120, borderRadius: 40, background: "radial-gradient(closest-side, rgba(105,211,190,0.35), transparent)", opacity: store }} />
        ) : null}
        {children}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${brand.colors.bg} 0%, rgba(6,18,14,0) 34%)`, pointerEvents: "none" }} />
      </div>
    </div>
  );
};
