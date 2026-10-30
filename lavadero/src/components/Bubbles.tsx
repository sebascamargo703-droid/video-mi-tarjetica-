import React from "react";

export type BubbleState = { x: number; y: number; r: number; /** 0–1 en el pop final (−1 = aún no). */ pop: number };

/** Burbujas blancas con borde fino y reflejo; al reventar crecen un poco, dejan un anillo y desaparecen. */
export const Bubbles: React.FC<{ bubbles: BubbleState[]; style?: React.CSSProperties }> = ({ bubbles, style }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }} width={1} height={1}>
    {bubbles.map((b, i) => {
      if (b.pop >= 1) return null;
      const popping = b.pop >= 0;
      const sc = popping ? 1 + b.pop * 0.35 : 1;
      const o = popping ? 1 - b.pop : 1;
      return (
        <g key={i} transform={`translate(${b.x} ${b.y})`}>
          {popping ? <circle r={b.r * (1.1 + b.pop * 0.9)} fill="none" stroke="#FFFFFF" strokeOpacity={0.7 * (1 - b.pop)} strokeWidth={2} /> : null}
          <g opacity={o} transform={`scale(${sc})`}>
            <circle r={b.r} fill="rgba(255, 255, 255, 0.16)" stroke="#FFFFFF" strokeOpacity={0.9} strokeWidth={Math.max(1.5, b.r * 0.07)} />
            <path d={`M ${-b.r * 0.55} ${-b.r * 0.2} A ${b.r * 0.6} ${b.r * 0.6} 0 0 1 ${-b.r * 0.15} ${-b.r * 0.58}`} fill="none" stroke="#FFFFFF" strokeWidth={Math.max(2, b.r * 0.12)} strokeLinecap="round" />
            <circle cx={b.r * 0.35} cy={-b.r * 0.42} r={b.r * 0.09} fill="#FFFFFF" />
          </g>
        </g>
      );
    })}
  </svg>
);
