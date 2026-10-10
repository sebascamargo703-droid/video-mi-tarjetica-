import React from "react";
import { AbsoluteFill } from "remotion";
import { type Bg, grid, onBg, palette } from "../brand";
import { display, sans } from "../fonts";
import { BrandLogo } from "./BrandLogo";
import { Dots } from "./Dots";

const backgrounds: Record<Bg, string> = {
  green: `radial-gradient(ellipse 85% 70% at 50% 45%, ${palette.green} 0%, ${palette.green} 30%, ${palette.greenDeep} 100%)`,
  light: palette.light,
  latte: palette.latte,
};

/** Base común: fondo, logo pequeño arriba a la izquierda (salvo la lámina 1) e indicador de página. */
export const SlideFrame: React.FC<{ bg: Bg; index: number; total: number; showLogo?: boolean; children: React.ReactNode }> = ({ bg, index, total, showLogo = true, children }) => {
  const c = onBg(bg);
  return (
    <AbsoluteFill style={{ background: backgrounds[bg], backgroundColor: bg === "green" ? palette.green : backgrounds[bg], fontFamily: sans, color: c.text }}>
      {children}
      {showLogo ? (
        <div style={{ position: "absolute", left: grid.m, top: grid.m - 8 }}>
          <BrandLogo variant={bg === "green" ? "light" : "color"} height={40} color={c.logo} />
        </div>
      ) : null}
      <Dots total={total} active={index} color={bg === "green" ? palette.onGreen : palette.brand} y={grid.dotsY} />
    </AbsoluteFill>
  );
};

/** "Lo que usaste:" + número en caramelo + filete fino hasta el margen (como una lista de cargos). */
export const ChargeHeader: React.FC<{ bg: Bg; label: string; number: string }> = ({ bg, label, number }) => {
  const c = onBg(bg);
  return (
    <div style={{ position: "absolute", left: grid.m, right: grid.m, top: grid.chargeY - 30, height: 60, display: "flex", alignItems: "center", gap: 20 }}>
      <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 28, color: c.secondary, letterSpacing: "0.01em" }}>{label}</span>
      <span style={{ ...display, fontWeight: 600, fontSize: 52, color: c.number, lineHeight: 1, fontVariantNumeric: "lining-nums" }}>{number}</span>
      <span style={{ flex: 1, height: 0, borderTop: `2px dotted ${c.line}`, opacity: 0.8, marginTop: 10 }} />
      <span style={{ width: 8, height: 8, borderRadius: 4, background: c.line, marginTop: 10 }} />
    </div>
  );
};

/** Titular en Fraunces con opsz alto. */
export const Title: React.FC<{ bg: Bg; text: string; size?: number; top?: number; weight?: 400 | 600; style?: React.CSSProperties }> = ({
  bg,
  text,
  size = grid.titleSize,
  top = grid.titleY,
  weight = 400,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: grid.m,
      right: grid.m,
      top,
      ...display,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.1,
      // Fraunces con opsz alto ya viene apretada: sin tracking negativo para que respire
      letterSpacing: "0.005em",
      color: onBg(bg).title,
      ...style,
    }}
  >
    {text}
  </div>
);

/** Nota al pie (Inter). */
export const Note: React.FC<{ bg: Bg; text: string; size?: number; top?: number; style?: React.CSSProperties }> = ({ bg, text, size = 28, top = grid.noteY, style }) => (
  <div style={{ position: "absolute", left: grid.m, right: grid.m, top, fontFamily: sans, fontWeight: 400, fontSize: size, lineHeight: 1.35, color: onBg(bg).secondary, ...style }}>{text}</div>
);
