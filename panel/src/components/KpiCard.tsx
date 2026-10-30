import React from "react";
import { palette } from "../brand";
import { font, tracking } from "../fonts";
import { Icon, type IconName } from "./Icons";
import { Odometer } from "./Odometer";

/** Tarjeta de indicador: ícono + etiqueta + número con odómetro (y lo que venga debajo, ej. sparkline). */
export const KpiCard: React.FC<{
  icon: IconName;
  label: string;
  value: number;
  frame: number;
  fps: number;
  odometerAt: number;
  numberSize: number;
  w: number;
  h: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ icon, label, value, frame, fps, odometerAt, numberSize, w, h, children, style }) => (
  <div
    style={{
      width: w,
      height: h,
      boxSizing: "border-box",
      borderRadius: 28,
      background: palette.panelSurface,
      border: `2px solid ${palette.panelBorder}`,
      padding: 28,
      display: "flex",
      flexDirection: "column",
      fontFamily: font,
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 14, background: palette.successBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={28} color={palette.brand} />
      </div>
      <div style={{ fontSize: 25, fontWeight: 600, lineHeight: 1.15, color: palette.panelTextSecondary, letterSpacing: tracking.body }}>{label}</div>
    </div>
    <div style={{ marginTop: 16 }}>
      <Odometer value={value} frame={frame} fps={fps} at={odometerAt} size={numberSize} color={palette.brand} />
    </div>
    {children ? <div style={{ marginTop: "auto" }}>{children}</div> : null}
  </div>
);
