import React from "react";
import { AbsoluteFill } from "remotion";
import { palette } from "../brand";

/**
 * Fondo verde de marca (degradado radial #145B44 → #0E4433). Es estático: el primer y el
 * último frame del video son exactamente este fondo, así el loop no se nota.
 */
export const BrandBackground: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <AbsoluteFill
    style={{
      backgroundColor: palette.bg,
      backgroundImage: `radial-gradient(ellipse 90% 70% at 50% 45%, ${palette.bg} 0%, ${palette.bg} 30%, ${palette.bgDeep} 100%)`,
      ...style,
    }}
  />
);
