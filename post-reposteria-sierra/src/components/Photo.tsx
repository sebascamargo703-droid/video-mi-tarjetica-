import React from "react";
import { Img, staticFile } from "remotion";

/**
 * Foto editada: recorte (object-fit cover + posición), ajuste de color (un poco más de
 * contraste, saturación y calidez) y viñeta suave. `zoom` acerca la foto.
 */
export const Photo: React.FC<{
  src: string;
  w: number;
  h: number;
  position?: string;
  zoom?: number;
  vignette?: number;
  style?: React.CSSProperties;
}> = ({ src, w, h, position = "50% 50%", zoom = 1, vignette = 0.28, style }) => (
  <div style={{ position: "relative", width: w, height: h, overflow: "hidden", ...style }}>
    <Img
      src={staticFile(`photos/${src}`)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: position,
        transform: `scale(${zoom})`,
        transformOrigin: position,
        filter: "contrast(1.08) saturate(1.12) brightness(1.02) sepia(0.06)",
      }}
    />
    {/* calidez de mantequilla */}
    <div style={{ position: "absolute", inset: 0, background: "rgba(247, 220, 158, 0.08)", mixBlendMode: "soft-light" }} />
    {/* viñeta */}
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 75% 70% at 50% 45%, transparent 55%, rgba(22, 14, 10, ${vignette}) 100%)` }} />
  </div>
);
