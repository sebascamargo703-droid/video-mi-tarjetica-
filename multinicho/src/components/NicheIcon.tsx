import React from "react";
import { font } from "../fonts";

/**
 * Íconos de línea uniformes (48×48, trazo 3, puntas redondas) dibujados en SVG.
 * Para un nicho nuevo: agrega aquí su nombre y su dibujo, y úsalo en niches.ts.
 */
export type IconName = "scissors" | "lotus" | "car" | "cone" | "dumbbell" | "paw" | "cup" | "bread" | "polish" | "dryer" | "logo";

const paths: Record<Exclude<IconName, "logo">, React.ReactNode> = {
  scissors: (
    <>
      <circle cx={13} cy={35} r={6} />
      <circle cx={35} cy={35} r={6} />
      <path d="M17.2 30.6 L36 6 M30.8 30.6 L12 6" />
    </>
  ),
  lotus: (
    <>
      <path d="M24 38 C17 32 17 20 24 10 C31 20 31 32 24 38 Z" />
      <path d="M21.5 37.5 C13.5 36.5 8 30.5 7 20.5 C13.5 21.5 18 25 20.5 30" />
      <path d="M26.5 37.5 C34.5 36.5 40 30.5 41 20.5 C34.5 21.5 30 25 27.5 30" />
      <path d="M10 43 H38" />
    </>
  ),
  car: (
    <>
      <path d="M10 33 H6 V25 L11 15.5 Q12.2 13 15 13 H33 Q35.8 13 37 15.5 L42 25 V33 H38 M30 33 H18" />
      <path d="M6 25 H42" />
      <circle cx={14} cy={33} r={4} />
      <circle cx={34} cy={33} r={4} />
    </>
  ),
  cone: (
    <>
      <path d="M13.5 22 L24 44 L34.5 22" />
      <path d="M12 22 A12 12 0 0 1 36 22 Z" />
      <path d="M17 29 H31" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M15 24 H33" />
      <rect x={8} y={13} width={7} height={22} rx={2} />
      <rect x={33} y={13} width={7} height={22} rx={2} />
      <path d="M4 19 V29 M44 19 V29" />
    </>
  ),
  paw: (
    <>
      <path d="M24 25 C30 25 35 31 35 36 C35 40 31.5 42 28.5 41 C26 40.2 22 40.2 19.5 41 C16.5 42 13 40 13 36 C13 31 18 25 24 25 Z" />
      <circle cx={11} cy={20} r={4} />
      <circle cx={19} cy={11} r={4} />
      <circle cx={29} cy={11} r={4} />
      <circle cx={37} cy={20} r={4} />
    </>
  ),
  cup: (
    <>
      <path d="M8 20 H35 V29 C35 36.5 30 41 21.5 41 C13 41 8 36.5 8 29 Z" />
      <path d="M35 23 H38 C41 23 42.5 25 42.5 27.5 C42.5 30 40.5 32 37.5 32 H34.5" />
      <path d="M16 5 C14 8.5 18 10.5 16 14 M25 5 C23 8.5 27 10.5 25 14" />
    </>
  ),
  bread: (
    <>
      <path d="M9 39 V23.5 C5.5 22.5 4 19.5 5 16 C6.8 10.5 14 8 24 8 C34 8 41.2 10.5 43 16 C44 19.5 42.5 22.5 39 23.5 V39 Z" />
      <path d="M16 18 L20 26 M23.5 17 L27.5 25 M31 18 L34 24" />
    </>
  ),
  polish: (
    <>
      <rect x={18.5} y={4} width={11} height={13} rx={2} />
      <rect x={11} y={17} width={26} height={26} rx={7} />
      <path d="M17 24 V35" />
    </>
  ),
  dryer: (
    <>
      <path d="M12 8 H30 L41 12 V24 L30 28 H12 A10 10 0 0 1 12 8 Z" />
      <circle cx={13} cy={18} r={4} />
      <path d="M17 28 L20 44 H27 L25 28" />
      <path d="M44 14 H47 M44 22 H47" />
    </>
  ),
};

export const NicheIcon: React.FC<{ name: IconName; size: number; color: string; label?: string; style?: React.CSSProperties }> = ({
  name,
  size,
  color,
  label = "Tu logo",
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: "block", overflow: "visible", ...style }}>
    {name === "logo" ? (
      <>
        <rect x={2} y={2} width={44} height={44} rx={11} fill="none" stroke={color} strokeWidth={2.4} strokeDasharray="5 4" />
        <text x={24} y={27.6} textAnchor="middle" fill={color} fontFamily={font} fontWeight={800} fontSize={9.6} letterSpacing={-0.3}>
          {label}
        </text>
      </>
    ) : (
      <g fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </g>
    )}
  </svg>
);
