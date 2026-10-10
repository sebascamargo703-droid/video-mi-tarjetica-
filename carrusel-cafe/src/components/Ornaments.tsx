import React from "react";

/**
 * Ilustración de línea fina (café de especialidad): rama con hojas y cerezas, granos sueltos y
 * taza con vapor. Siempre en las esquinas, en coffee al 25 % o en caramelo, sin competir con el texto.
 */
type Common = { color: string; opacity?: number; size: number; style?: React.CSSProperties; strokeWidth?: number };

const Leaf: React.FC<{ x: number; y: number; r: number; s?: number }> = ({ x, y, r, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M0 0 C16 -17 50 -17 68 0 C50 17 16 17 0 0 Z" />
    <path d="M6 0 H60" />
    <path d="M22 0 L30 -7 M38 0 L46 -7 M22 0 L30 7 M38 0 L46 7" opacity={0.6} />
  </g>
);

const Cherries: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx={0} cy={0} r={8.5} />
    <circle cx={14} cy={4} r={8.5} />
    <circle cx={6} cy={-12} r={7.5} />
    <circle cx={-2} cy={-2} r={1.6} />
  </g>
);

export const CoffeeBranch: React.FC<Common & { flip?: boolean; rotate?: number }> = ({ color, opacity = 1, size, style, flip, rotate = 0, strokeWidth = 2.4 }) => (
  <svg width={size} height={size * 0.87} viewBox="0 0 300 260" style={{ display: "block", overflow: "visible", opacity, transform: `${flip ? "scaleX(-1) " : ""}rotate(${rotate}deg)`, ...style }}>
    <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 252 C70 210 130 160 292 36" />
      <path d="M118 168 C140 176 160 176 178 168" />
      <Leaf x={54} y={218} r={-150} s={0.85} />
      <Leaf x={70} y={206} r={-30} s={0.95} />
      <Leaf x={142} y={150} r={-160} />
      <Leaf x={160} y={136} r={-20} s={0.9} />
      <Leaf x={226} y={88} r={-140} s={0.85} />
      <Leaf x={246} y={72} r={-12} s={0.8} />
      <Cherries x={106} y={196} />
      <Cherries x={196} y={124} />
      <Cherries x={270} y={64} />
    </g>
  </svg>
);

export const Bean: React.FC<{ cx: number; cy: number; r: number; rot: number }> = ({ cx, cy, r, rot }) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
    <ellipse rx={r * 0.72} ry={r} />
    <path d={`M0 ${-r * 0.8} C${r * 0.35} ${-r * 0.3} ${-r * 0.35} ${r * 0.3} 0 ${r * 0.8}`} />
  </g>
);

export const Beans: React.FC<Common> = ({ color, opacity = 1, size, style, strokeWidth = 2.4 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ display: "block", overflow: "visible", opacity, ...style }}>
    <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
      <Bean cx={34} cy={40} r={18} rot={-30} />
      <Bean cx={82} cy={30} r={14} rot={25} />
      <Bean cx={70} cy={84} r={16} rot={70} />
    </g>
  </svg>
);

export const SteamCup: React.FC<Common> = ({ color, opacity = 1, size, style, strokeWidth = 2.6 }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ display: "block", overflow: "visible", opacity, ...style }}>
    <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M58 46 C50 36 66 30 58 18 M80 46 C72 34 88 28 80 14 M102 46 C94 36 110 30 102 18" />
      <path d="M34 62 H126 V86 C126 112 106 128 80 128 C54 128 34 112 34 86 Z" />
      <path d="M126 72 H134 C146 72 150 80 150 88 C150 98 142 104 132 104 H124" />
      <path d="M22 138 C50 148 110 148 138 138" />
    </g>
  </svg>
);
