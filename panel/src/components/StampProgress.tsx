import React from "react";
import { palette } from "../brand";
import { font } from "../fonts";
import { ease } from "../motion";

/** "7/10" + barra de progreso de sellos que se llena con easing. */
export const StampProgress: React.FC<{ stamps: number; total: number; frame: number; at: number; w: number; size?: number }> = ({ stamps, total, frame, at, w, size = 32 }) => {
  const k = ease(frame, at, 42);
  const shown = Math.round(stamps * k);
  return (
    <div style={{ width: w, fontFamily: font }}>
      <div style={{ fontSize: size, fontWeight: 800, color: palette.panelText, fontVariantNumeric: "tabular-nums", lineHeight: 1, letterSpacing: "-0.02em" }}>
        {shown}
        <span style={{ color: palette.panelTextSecondary, fontWeight: 600 }}>/{total}</span>
      </div>
      <div style={{ marginTop: 12, height: 14, borderRadius: 7, background: palette.panelBorder, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(stamps / total) * k * 100}%`, borderRadius: 7, background: palette.brand }} />
      </div>
    </div>
  );
};
