import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { logoFont } from "../fonts";
import { ease, pop } from "../motion";

/** Isotipo oficial redibujado en SVG: marco redondeado + 3 puntos que crecen. */
export const LogoMark: React.FC<{ height: number; color: string; draw?: number; dots?: [number, number, number] }> = ({
  height,
  color,
  draw = 1,
  dots = [1, 1, 1],
}) => (
  <svg width={(height * 860) / 487} height={height} viewBox="0 0 860 487" style={{ overflow: "visible", display: "block" }}>
    <rect x={43.5} y={43.5} width={773} height={400} rx={128} fill="none" stroke={color} strokeWidth={87} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
    {[
      [237, 58],
      [448, 79],
      [677, 95],
    ].map(([cx, r], i) => (
      <circle key={i} cx={cx} cy={244} r={Math.max(0, r * dots[i])} fill={color} />
    ))}
  </svg>
);

/** Logo completo; con `animateAt` se arma solo: trazo → puntos (como sellos) → wordmark. */
export const Logo: React.FC<{ height: number; color: string; animateAt?: number }> = ({ height, color, animateAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = animateAt ?? -9999;
  const draw = animateAt === undefined ? 1 : ease(frame, a, Math.round(fps * 0.7));
  const dots: [number, number, number] =
    animateAt === undefined ? [1, 1, 1] : [pop(frame, fps, a + 18), pop(frame, fps, a + 26), pop(frame, fps, a + 34)];
  const word = animateAt === undefined ? 1 : ease(frame, a + 30, Math.round(fps * 0.7));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: height * 0.18 }}>
      <LogoMark height={height * 0.52} color={color} draw={draw} dots={dots} />
      <div
        style={{
          fontFamily: logoFont,
          color,
          display: "flex",
          flexDirection: "column",
          opacity: word,
          transform: `translateX(${(1 - word) * height * 0.12}px)`,
          filter: word < 1 ? `blur(${(1 - word) * 6}px)` : undefined,
        }}
      >
        <span style={{ fontStyle: "italic", fontWeight: 600, fontSize: height * 0.26, lineHeight: 1, marginBottom: -height * 0.02 }}>Mi</span>
        <span style={{ fontWeight: 700, fontSize: height * 0.56, lineHeight: 1, letterSpacing: "-0.01em" }}>Tarjetica</span>
      </div>
    </div>
  );
};
