import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../fonts";
import { ease, popSpring, useS } from "../lib/motion";

/** Proporciones del isotipo oficial (marco redondeado + 3 puntos que crecen). */
const VB_W = 860;
const VB_H = 487;
const DOTS = [
  { cx: 237, r: 58 },
  { cx: 448, r: 79 },
  { cx: 677, r: 95 },
];

/**
 * Isotipo dibujado en SVG.
 * `draw` (0→1) traza el marco; `dots` (0→1 cada uno) escala los puntos.
 */
export const LogoMark: React.FC<{
  height: number;
  color: string;
  draw?: number;
  dots?: [number, number, number];
}> = ({ height, color, draw = 1, dots = [1, 1, 1] }) => {
  const width = (height * VB_W) / VB_H;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{ overflow: "visible", display: "block" }}
    >
      <rect
        x={43.5}
        y={43.5}
        width={773}
        height={400}
        rx={128}
        fill="none"
        stroke={color}
        strokeWidth={87}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
        strokeLinecap="round"
      />
      {DOTS.map((d, i) => (
        <circle
          key={i}
          cx={d.cx}
          cy={244}
          r={Math.max(0, d.r * dots[i])}
          fill={color}
        />
      ))}
    </svg>
  );
};

/**
 * Logo completo: isotipo + wordmark serif ("Mi" en itálica, "Tarjetica").
 * Si `animateAt` está definido, se arma solo: trazo → puntos (como sellos) → texto.
 */
export const Logo: React.FC<{
  height: number;
  color: string;
  animateAt?: number;
  layout?: "row" | "column";
}> = ({ height, color, animateAt, layout = "row" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const animated = animateAt !== undefined;
  const a = animateAt ?? 0;

  const draw = animated ? ease(frame, a, s(0.9)) : 1;
  const dots: [number, number, number] = animated
    ? [
        popSpring(frame, fps, a + s(0.45)),
        popSpring(frame, fps, a + s(0.6)),
        popSpring(frame, fps, a + s(0.75)),
      ]
    : [1, 1, 1];
  const wordT = animated ? ease(frame, a + s(0.75), s(0.9)) : 1;

  const markH = height * 0.52;
  const isRow = layout === "row";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isRow ? "row" : "column",
        alignItems: "center",
        gap: isRow ? height * 0.18 : height * 0.12,
      }}
    >
      <LogoMark height={markH} color={color} draw={draw} dots={dots} />
      <div
        style={{
          fontFamily: fonts.logo,
          color,
          display: "flex",
          flexDirection: "column",
          alignItems: isRow ? "flex-start" : "center",
          opacity: wordT,
          transform: `translate${isRow ? "X" : "Y"}(${(1 - wordT) * height * 0.12}px)`,
          filter: wordT < 1 ? `blur(${(1 - wordT) * height * 0.03}px)` : undefined,
        }}
      >
        <span
          style={{
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: height * 0.26,
            lineHeight: 1,
            marginLeft: isRow ? height * 0.02 : 0,
            marginBottom: -height * 0.02,
          }}
        >
          Mi
        </span>
        <span
          style={{
            fontWeight: 700,
            fontSize: height * 0.56,
            lineHeight: 1,
            letterSpacing: "-0.01em",
          }}
        >
          Tarjetica
        </span>
      </div>
    </div>
  );
};
