import React from "react";
import { Img, staticFile } from "remotion";

/** Etiqueta circular de Repostería Sierra (extraída de ETIQUETA_NEGOCIO.pdf). */
export const SierraLogo: React.FC<{ size: number; shadow?: boolean; style?: React.CSSProperties }> = ({ size, shadow = true, style }) => (
  <Img
    src={staticFile("sierra-logo.png")}
    style={{ width: size, height: size, display: "block", borderRadius: "50%", boxShadow: shadow ? "0 18px 40px rgba(0, 0, 0, 0.35)" : undefined, ...style }}
  />
);
