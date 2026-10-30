import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { copy } from "../copy";
import { fonts, tracking } from "../fonts";
import { Logo } from "../components/Logo";
import { ease, useS } from "../lib/motion";

/** Tono extra para redes: tinta + papel (colores del logo oficial). */
export const inkTone = {
  bg: brand.colors.ink,
  fg: brand.colors.cream,
  sub: "#A39A91",
  accent: brand.colors.mint,
};

/** Aparece con ease‑out expo + desenfoque (para bloques que no son texto). */
export const Reveal: React.FC<{
  at: number;
  y?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, y = 40, style, children }) => {
  const frame = useCurrentFrame();
  const s = useS();
  const t = ease(frame, at, s(0.8));
  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${(1 - t) * y}px)`,
        filter: t < 0.99 ? `blur(${(1 - t) * 8}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Pill: React.FC<{
  label: string;
  bg: string;
  color: string;
  size?: number;
  weight?: number;
  border?: string;
  style?: React.CSSProperties;
}> = ({ label, bg, color, size = 30, weight = 600, border, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.4,
      fontFamily: fonts.body,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: tracking.body,
      color,
      background: bg,
      padding: `${size * 0.5}px ${size * 1.05}px`,
      borderRadius: 999,
      boxShadow: border ? `inset 0 0 0 2px ${border}` : undefined,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {label}
  </div>
);

/** Pie de marca: logo + dominio. */
export const BrandFooter: React.FC<{
  color: string;
  urlColor?: string;
  at?: number;
  bottom: number;
  center?: boolean;
  logoHeight?: number;
}> = ({ color, urlColor, at = 0, bottom, center = true, logoHeight = 84 }) => (
  <div
    style={{
      position: "absolute",
      left: 80,
      right: 80,
      bottom,
      display: "flex",
      flexDirection: center ? "column" : "row",
      alignItems: "center",
      justifyContent: center ? "center" : "space-between",
      gap: center ? 18 : 0,
    }}
  >
    <Reveal at={at} y={20}>
      <Logo height={logoHeight} color={color} />
    </Reveal>
    <Reveal at={at + 6} y={20}>
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 28,
          color: urlColor ?? color,
          letterSpacing: tracking.body,
        }}
      >
        {copy.cta.button}
      </div>
    </Reveal>
  </div>
);

export const Fill: React.FC<{ bg: string; glow?: string; glowAt?: string; children: React.ReactNode }> = ({
  bg,
  glow,
  glowAt = "50% 45%",
  children,
}) => (
  <AbsoluteFill style={{ backgroundColor: bg, fontFamily: fonts.body }}>
    {glow ? (
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${glowAt}, ${glow} 0%, rgba(0,0,0,0) 60%)`,
        }}
      />
    ) : null}
    {children}
  </AbsoluteFill>
);

export const CheckCircle: React.FC<{ size: number; bg: string; color: string }> = ({
  size,
  bg,
  color,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24">
      <path
        d="M5 12.5l4.2 4.2L19 7"
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
