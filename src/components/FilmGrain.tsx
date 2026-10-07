import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useLayout } from "../lib/layout";

/**
 * Grano de película fino y constante. Ruido fractal SVG con semilla distinta
 * en cada frame, renderizado a la mitad de resolución en 4K (grano "1080p",
 * más orgánico) y fusionado en overlay.
 */
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  const { W, H, u } = useLayout();
  const scale = Math.max(1, u);
  const w = Math.ceil(W / scale);
  const h = Math.ceil(H / scale);

  return (
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity, pointerEvents: "none" }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ width: W, height: H, display: "block" }}
      >
        <filter id="film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={frame % 97}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={w} height={h} filter="url(#film-grain)" />
      </svg>
    </AbsoluteFill>
  );
};
