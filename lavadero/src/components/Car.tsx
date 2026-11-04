import React from "react";
import { art } from "../brand";
import { DirtSpots } from "./DirtSpots";

/** Contorno de la carrocería (para el brillo y la espuma). */
const BODY =
  "M24 120 Q10 120 10 106 V92 Q10 76 26 74 L72 70 L100 32 Q106 22 118 22 H190 Q201 22 208 31 L240 70 L272 74 Q290 77 290 94 V106 Q290 120 276 120 Z";

const Wheel: React.FC<{ cx: number; angle: number }> = ({ cx, angle }) => (
  <g transform={`translate(${cx} 118)`}>
    <circle r={28} fill={art.car.tire} />
    <circle r={15} fill={art.car.rim} />
    <g transform={`rotate(${angle})`} stroke={art.car.tire} strokeWidth={3.2} strokeLinecap="round">
      {[0, 72, 144, 216, 288].map((a) => (
        <line key={a} x1={0} y1={0} x2={0} y2={-11} transform={`rotate(${a})`} />
      ))}
    </g>
    <circle r={4} fill={art.car.tire} />
  </g>
);

/**
 * Carro de perfil (plano, redondeado, sin marca). Mira a la derecha.
 * El SVG mide 300×150 y su base (llantas en el piso) está en y = 146.
 */
export const Car: React.FC<{
  wheelAngle: number;
  dirt: number[];
  /** 0–1: espuma sobre el carro. */
  foam: number;
  /** 0–1: brillo diagonal que cruza la carrocería (fuera de rango = no se ve). */
  shine: number;
  foamPhase?: number;
  id: string;
}> = ({ wheelAngle, dirt, foam, shine, foamPhase = 0, id }) => (
  <svg width={300} height={150} viewBox="0 0 300 150" style={{ display: "block", overflow: "visible" }}>
    <defs>
      <clipPath id={`${id}-body`}>
        <path d={BODY} />
      </clipPath>
      <linearGradient id={`${id}-shine`} x1={0} y1={0} x2={1} y2={0}>
        <stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
        <stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.75} />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
      </linearGradient>
    </defs>
    {/* carrocería */}
    <path d={BODY} fill={art.car.body} />
    <path d="M14 104 H286 V108 Q286 120 274 120 H26 Q14 120 14 108 Z" fill={art.car.bodyDark} />
    {/* vidrios */}
    <path d="M86 68 L109 36 Q113 30 121 30 H150 V68 Z" fill={art.car.glass} />
    <path d="M160 68 V30 H188 Q195 30 200 36 L226 68 Z" fill={art.car.glass} />
    <path d="M114 36 L100 56" stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={5} strokeLinecap="round" />
    {/* puerta, manija, luces */}
    <path d="M155 72 V104" stroke={art.car.bodyDark} strokeWidth={3} strokeLinecap="round" />
    <rect x={164} y={80} width={18} height={5} rx={2.5} fill={art.car.bodyDark} />
    <rect x={276} y={82} width={12} height={10} rx={4} fill={art.car.light} />
    <rect x={11} y={82} width={9} height={10} rx={3} fill={art.car.bodyDark} />
    {/* reflejo de la carrocería */}
    <path d="M30 80 H150" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={4} strokeLinecap="round" />
    <DirtSpots levels={dirt} />
    {/* brillo diagonal al salir limpio */}
    {shine > 0 && shine < 1 ? (
      <g clipPath={`url(#${id}-body)`}>
        <rect x={-120 + shine * 480} y={-20} width={90} height={190} fill={`url(#${id}-shine)`} transform={`skewX(-22)`} />
      </g>
    ) : null}
    <Wheel cx={75} angle={wheelAngle} />
    <Wheel cx={225} angle={wheelAngle} />
    {/* espuma */}
    {foam > 0.01 ? (
      <g fill={art.water.foam} opacity={Math.min(1, foam * 1.2)}>
        {Array.from({ length: 16 }).map((_, i) => {
          const x = 20 + i * 17;
          const top = i > 4 && i < 13 ? 26 : 72;
          const r = (10 + ((i * 7) % 5) * 2) * foam;
          const wob = Math.sin(foamPhase * 3 + i) * 2;
          return (
            <g key={i}>
              <circle cx={x} cy={top - 2 + wob} r={r} />
              <circle cx={x + 7} cy={top + 14 - wob} r={r * 0.8} />
              <circle cx={x - 4} cy={top + 34 + wob} r={r * 0.65} opacity={0.85} />
            </g>
          );
        })}
      </g>
    ) : null}
  </svg>
);
