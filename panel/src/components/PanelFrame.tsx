import React from "react";
import { palette } from "../brand";
import { font, tracking } from "../fonts";
import { EASE, ease } from "../motion";
import { Icon } from "./Icons";

/** Aparición de un elemento del panel: opacidad + translateY 20 px + escala 0.98 → 1. */
export const appear = (frame: number, at: number, dir = 1): React.CSSProperties => {
  const k = ease(frame, at, 30, EASE);
  return { opacity: k, transform: `translateY(${(1 - k) * 20 * dir}px) scale(${0.98 + 0.02 * k})` };
};

/**
 * Marco del panel: blanco, esquinas de 40 px, sombra amplia y suave, y la cabecera
 * (logo genérico del negocio, título y selector de periodo) que entra escalonada.
 */
export const PanelFrame: React.FC<{
  w: number;
  h: number;
  padding: number;
  frame: number;
  headerAt: number;
  business: string;
  title: string;
  period: string;
  headerOpacity?: number;
  children: React.ReactNode;
}> = ({ w, h, padding, frame, headerAt, business, title, period, headerOpacity = 1, children }) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: h,
      borderRadius: 40,
      background: palette.panelBg,
      boxShadow: `0 70px 140px ${palette.shadow}, 0 12px 30px rgba(10, 46, 34, 0.18)`,
      fontFamily: font,
    }}
  >
    <div style={{ position: "absolute", left: padding, right: padding, top: padding, height: 96, display: "flex", alignItems: "center", gap: 22, opacity: headerOpacity }}>
      <div style={{ ...appear(frame, headerAt), width: 80, height: 80, borderRadius: "50%", background: palette.brand, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="scissors" size={40} color={palette.panelBg} strokeWidth={2.2} />
      </div>
      <div style={{ ...appear(frame, headerAt + 5), display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 25, fontWeight: 600, color: palette.panelTextSecondary }}>{business}</div>
        <div style={{ fontSize: 48, fontWeight: 800, color: palette.panelText, letterSpacing: tracking.headline, lineHeight: 1 }}>{title}</div>
      </div>
      <div
        style={{
          ...appear(frame, headerAt + 10),
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 18px 14px 24px",
          borderRadius: 999,
          background: palette.panelSurface,
          border: `2px solid ${palette.panelBorder}`,
          fontSize: 26,
          fontWeight: 600,
          color: palette.panelText,
        }}
      >
        {period}
        <Icon name="chevron" size={26} color={palette.panelText} />
      </div>
    </div>
    {children}
  </div>
);
