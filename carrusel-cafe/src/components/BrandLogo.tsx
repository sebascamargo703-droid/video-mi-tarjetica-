import React from "react";
import { Img } from "remotion";
import { assets } from "../assets";
import { sans } from "../fonts";

/**
 * Logo de Mi Tarjetica. Usa public/logo.svg (o logo-white.svg sobre verde) si existe; si no,
 * un wordmark provisional "MiTarjetica" en Inter 800 (ver README).
 */
export const BrandLogo: React.FC<{ variant: "color" | "white"; height: number; color: string }> = ({ variant, height, color }) => {
  const src = variant === "white" ? assets.logoWhite() : assets.logo();
  if (src) return <Img src={src} style={{ height, width: "auto", display: "block" }} />;
  return (
    <div style={{ fontFamily: sans, fontWeight: 800, fontSize: height * 0.86, lineHeight: `${height}px`, letterSpacing: "-0.02em", color, whiteSpace: "nowrap" }}>MiTarjetica</div>
  );
};
