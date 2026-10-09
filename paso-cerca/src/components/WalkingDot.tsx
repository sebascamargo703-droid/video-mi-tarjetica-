import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";

/** El cliente: punto blanco con halo que respira. `x, y` ya proyectados; `k` escala de perspectiva. */
export const WalkingDot: React.FC<{ x: number; y: number; k: number; opacity: number }> = ({ x, y, k, opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breathe = (Math.sin((frame / fps) * Math.PI * 2 * 1.2) + 1) / 2;
  const d = 30 * k;
  const halo = d * (2.6 + 0.6 * breathe);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity }}>
      <div
        style={{
          position: "absolute",
          left: -halo / 2,
          top: -halo / 2,
          width: halo,
          height: halo,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,255,255,${0.32 - 0.12 * breathe}) 0%, rgba(255,255,255,0) 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -d / 2,
          top: -d / 2,
          width: d,
          height: d,
          borderRadius: "50%",
          background: brand.colors.white,
          border: `${4 * k}px solid ${brand.colors.mint}`,
          boxShadow: `0 0 ${24 * k}px rgba(255,255,255,0.8)`,
        }}
      />
    </div>
  );
};
