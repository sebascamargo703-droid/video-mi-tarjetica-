import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { useLayout } from "../lib/layout";
import { colors } from "../theme";

/**
 * Fondo oscuro de las escenas gráficas: #0A0A0F con gradiente radial azul muy
 * sutil y partículas de luz que suben lentamente (deterministas).
 */
export const Backdrop: React.FC<{
  glowX?: number;
  glowY?: number;
  particles?: number;
  intensity?: number;
}> = ({ glowX = 50, glowY = 42, particles = 26, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { W, H, u } = useLayout();

  const dots = useMemo(
    () =>
      Array.from({ length: particles }).map((_, i) => ({
        x: random(`x${i}`) * W,
        y: random(`y${i}`) * H,
        r: (1.5 + random(`r${i}`) * 3.5) * u,
        speed: (0.15 + random(`s${i}`) * 0.35) * u,
        alpha: 0.12 + random(`a${i}`) * 0.35,
        phase: random(`p${i}`) * Math.PI * 2,
      })),
    [particles, W, H, u],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at ${glowX}% ${glowY}%, rgba(25,148,123,${
            0.22 * intensity
          }) 0%, rgba(14,82,68,${0.08 * intensity}) 45%, rgba(10,10,15,0) 75%)`,
        }}
      />
      {dots.map((d, i) => {
        const y = (((d.y - frame * d.speed * 2) % H) + H) % H;
        const x = d.x + Math.sin(frame / 60 + d.phase) * 8 * u;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: d.r * 2,
              height: d.r * 2,
              borderRadius: "50%",
              background: "#A8E6D9",
              opacity: d.alpha * (0.6 + 0.4 * Math.sin(frame / 25 + d.phase)),
              filter: `blur(${d.r * 0.6}px)`,
              boxShadow: `0 0 ${d.r * 4}px rgba(89,207,183,0.8)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
