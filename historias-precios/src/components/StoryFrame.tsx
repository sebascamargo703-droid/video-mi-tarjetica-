import React from "react";
import { AbsoluteFill } from "remotion";
import { type Bg, onBg, palette, story } from "../brand";
import { display, sans } from "../fonts";
import { BrandLogo } from "./BrandLogo";

const backgrounds: Record<Bg, string> = {
  green: `radial-gradient(ellipse 90% 65% at 50% 45%, ${palette.green} 0%, ${palette.green} 30%, ${palette.greenDeep} 100%)`,
  latte: palette.latte,
  light: palette.light,
};

/** Base de cada historia: fondo, logo arriba a la izquierda e indicador "Precios · n/8" (debajo de la zona segura). */
export const StoryFrame: React.FC<{ bg: Bg; indicator: string; children: React.ReactNode }> = ({ bg, indicator, children }) => {
  const c = onBg(bg);
  return (
    <AbsoluteFill style={{ background: backgrounds[bg], backgroundColor: bg === "green" ? palette.green : backgrounds[bg], fontFamily: sans, color: c.text }}>
      <div style={{ position: "absolute", left: story.m, right: story.m, top: story.headerY, height: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <BrandLogo variant={bg === "green" ? "light" : "color"} height={42} color={c.logo} />
        <span style={{ fontSize: 28, fontWeight: 600, color: c.secondary, fontVariantNumeric: "tabular-nums", letterSpacing: "0.01em" }}>{indicator}</span>
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Titular en Fraunces (opsz alto). */
export const Headline: React.FC<{ bg: Bg; text: string; size: number; top: number; weight?: 400 | 600; style?: React.CSSProperties }> = ({ bg, text, size, top, weight = 400, style }) => (
  <div style={{ position: "absolute", left: story.m, right: story.m, top, ...display, fontWeight: weight, fontSize: size, lineHeight: 1.08, letterSpacing: "0.003em", color: onBg(bg).title, whiteSpace: "pre-line", textWrap: "balance", ...style }}>
    {text}
  </div>
);
