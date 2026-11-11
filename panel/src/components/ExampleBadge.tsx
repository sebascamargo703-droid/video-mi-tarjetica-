import React from "react";
import { palette } from "../brand";
import { font } from "../fonts";
import { Icon } from "./Icons";

/** Aviso discreto y siempre legible: los datos del panel son de ejemplo. */
export const ExampleBadge: React.FC<{ text: string; size?: number; style?: React.CSSProperties }> = ({ text, size = 22, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.4,
      padding: `${size * 0.4}px ${size * 0.7}px`,
      borderRadius: 999,
      background: palette.panelSurface,
      border: `2px solid ${palette.panelBorder}`,
      boxShadow: "0 6px 18px rgba(10, 46, 34, 0.12)",
      color: palette.panelTextSecondary,
      fontFamily: font,
      fontSize: size,
      fontWeight: 600,
      lineHeight: 1,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <Icon name="info" size={size * 1.05} color={palette.panelTextSecondary} />
    {text}
  </div>
);
