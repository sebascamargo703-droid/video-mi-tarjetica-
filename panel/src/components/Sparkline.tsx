import React from "react";
import { font } from "../fonts";
import { palette, withAlpha } from "../brand";
import { ease, pop } from "../motion";

/** Curva suave (Catmull-Rom → Bézier) que pasa por todos los puntos. */
const smoothPath = (pts: [number, number][]) =>
  pts.reduce((d, p, i) => {
    if (i === 0) return `M ${p[0]} ${p[1]}`;
    const p0 = pts[i - 2] ?? pts[i - 1];
    const p1 = pts[i - 1];
    const p3 = pts[i + 1] ?? p;
    const c1 = [p1[0] + (p[0] - p0[0]) / 6, p1[1] + (p[1] - p0[1]) / 6];
    const c2 = [p[0] - (p3[0] - p1[0]) / 6, p[1] - (p3[1] - p1[1]) / 6];
    return `${d} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p[0]} ${p[1]}`;
  }, "");

/**
 * Sparkline de sellos por día: se dibuja de izquierda a derecha (stroke-dashoffset) y el
 * valor más alto termina con un punto que brilla.
 */
export const Sparkline: React.FC<{
  values: number[];
  labels: string[];
  w: number;
  h: number;
  frame: number;
  fps: number;
  drawAt: number;
  drawDur: number;
  peakAt: number;
}> = ({ values, labels, w, h, frame, fps, drawAt, drawDur, peakAt }) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const padX = 18;
  const plotH = h - 34;
  const pts: [number, number][] = values.map((v, i) => [padX + (i / (values.length - 1)) * (w - 2 * padX), 14 + (1 - (v - min) / (max - min)) * (plotH - 28)]);
  const peak = values.indexOf(max);
  const draw = ease(frame, drawAt, drawDur);
  const area = ease(frame, drawAt + drawDur * 0.5, drawDur);
  const dot = pop(frame, fps, peakAt);
  // halo que late 2 veces después de aparecer
  const pulseT = (frame - peakAt) / fps;
  const pulse = pulseT > 0 && pulseT < 2 ? (pulseT % 1) : 1;
  const line = smoothPath(pts);
  const id = "spark-fill";
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0%" stopColor={withAlpha(palette.brand, 0.18)} />
          <stop offset="100%" stopColor={withAlpha(palette.brand, 0)} />
        </linearGradient>
      </defs>
      <path d={`${line} L ${pts[pts.length - 1][0]} ${plotH} L ${pts[0][0]} ${plotH} Z`} fill={`url(#${id})`} opacity={area} />
      <path d={line} fill="none" stroke={palette.brand} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      {dot > 0 ? (
        <g transform={`translate(${pts[peak][0]} ${pts[peak][1]})`}>
          <circle r={10 + pulse * 22} fill={withAlpha(palette.accent, 0.55 * (1 - pulse))} />
          <circle r={11 * dot} fill={palette.brand} stroke={palette.panelBg} strokeWidth={4} />
          <text y={-24} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={24} fill={palette.brand} opacity={Math.min(1, dot)} style={{ fontVariantNumeric: "tabular-nums" }}>
            {max}
          </text>
        </g>
      ) : null}
      {labels.map((l, i) => (
        <text
          key={i}
          x={pts[i][0]}
          y={h - 4}
          textAnchor="middle"
          fontFamily={font}
          fontWeight={i === peak ? 800 : 600}
          fontSize={21}
          fill={i === peak ? palette.brand : palette.panelTextSecondary}
          opacity={ease(frame, drawAt + (i / (labels.length - 1)) * drawDur * 0.8, 12)}
        >
          {l}
        </text>
      ))}
    </svg>
  );
};
