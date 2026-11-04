import React from "react";
import { art } from "../brand";
import { TUNNEL } from "../track";

/**
 * Túnel de lavado (coordenadas del escenario). Capa de fondo: arco blanco al 90 % con
 * detalles menta, interior translúcido y letrero con gota y burbujas (sin texto).
 * `build` 0–1 = aparición con pop desde el piso.
 */
export const WashTunnel: React.FC<{ ground: number; build: number }> = ({ ground, build }) => {
  if (build <= 0) return null;
  const L = TUNNEL.x - TUNNEL.half;
  const R = TUNNEL.x + TUNNEL.half;
  const top = TUNNEL.top;
  const roofH = 44;
  const pillar = 28;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", transformOrigin: `${TUNNEL.x}px ${ground}px`, transform: `scale(${0.85 + 0.15 * build})`, opacity: Math.min(1, build * 1.6) }}
      width={1}
      height={1}
    >
      {/* interior */}
      <rect x={L + pillar} y={top + roofH} width={R - L - 2 * pillar} height={ground - top - roofH} fill="rgba(255, 255, 255, 0.1)" />
      {[0.25, 0.5, 0.75].map((k) => (
        <line key={k} x1={L + pillar} x2={R - pillar} y1={top + roofH + (ground - top - roofH) * k} y2={top + roofH + (ground - top - roofH) * k} stroke="rgba(255, 255, 255, 0.08)" strokeWidth={3} />
      ))}
      {/* pilares */}
      <rect x={L} y={top + 10} width={pillar} height={ground - top - 10} rx={10} fill={art.tunnel.frame} />
      <rect x={R - pillar} y={top + 10} width={pillar} height={ground - top - 10} rx={10} fill={art.tunnel.frame} />
      <rect x={L} y={ground - 46} width={pillar} height={18} fill={art.tunnel.detail} />
      <rect x={R - pillar} y={ground - 46} width={pillar} height={18} fill={art.tunnel.detail} />
      {/* techo */}
      <rect x={L - 22} y={top} width={R - L + 44} height={roofH} rx={22} fill={art.tunnel.frame} />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={L + 8 + i * ((R - L - 16) / 9)} y={top + 14} width={(R - L - 16) / 18} height={16} rx={5} fill={art.tunnel.detail} />
      ))}
      {/* letrero: gota + burbujas */}
      <g transform={`translate(${TUNNEL.x} ${top - 34})`}>
        <rect x={-74} y={-26} width={148} height={56} rx={28} fill={art.tunnel.frame} />
        <path d="M-22 -14 C-22 -14 -36 3 -36 11 A14 14 0 0 0 -8 11 C-8 3 -22 -14 -22 -14 Z" fill={art.tunnel.brush} />
        <circle cx={14} cy={8} r={11} fill="none" stroke={art.tunnel.brush} strokeWidth={4} />
        <circle cx={38} cy={-4} r={7} fill="none" stroke={art.tunnel.detail} strokeWidth={4} />
        <circle cx={36} cy={14} r={4} fill={art.tunnel.detail} />
      </g>
    </svg>
  );
};
