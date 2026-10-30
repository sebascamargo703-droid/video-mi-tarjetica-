import React from "react";

/** Check dentro de un círculo. */
export const Check: React.FC<{ size: number; circle: string; mark: string }> = ({ size, circle, mark }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: "block", flexShrink: 0 }}>
    <circle cx={24} cy={24} r={24} fill={circle} />
    <path d="M14 24.5 L21 31.5 L34.5 17.5" fill="none" stroke={mark} strokeWidth={4.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Etiqueta de precio en línea gruesa (portada de la destacada). */
export const PriceTag: React.FC<{ size: number; color: string; strokeWidth?: number; style?: React.CSSProperties }> = ({ size, color, strokeWidth = 7, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", ...style }}>
    <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M48 12 H80 Q88 12 88 20 V52 Q88 56 85 59 L57 87 Q51 93 45 87 L13 55 Q7 49 13 43 L41 15 Q44 12 48 12 Z" />
      <circle cx={70} cy={30} r={6.5} />
    </g>
  </svg>
);

/** Flecha → para botones. */
export const Arrow: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    <path d="M4 12 H19 M13 6 L19 12 L13 18" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
