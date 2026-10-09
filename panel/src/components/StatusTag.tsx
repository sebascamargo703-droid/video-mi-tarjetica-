import React from "react";
import { palette, withAlpha } from "../brand";
import { font } from "../fonts";
import { pop } from "../motion";
import type { Tag } from "../panelData";

/** Etiqueta de estado con pop (0 → 1.15 → 1). Las de alerta laten suave 2 veces, sin alarmar. */
export const StatusTag: React.FC<{ tag: Tag; frame: number; fps: number; at: number; size?: number }> = ({ tag, frame, fps, at, size = 24 }) => {
  const k = pop(frame, fps, at);
  if (k <= 0.001) return null;
  const alert = tag.tone === "alert";
  const t = (frame - at) / fps - 0.25;
  const pulse = alert && t > 0 && t < 1.8 ? (t % 0.9) / 0.9 : -1;
  const color = alert ? palette.alertText : palette.successText;
  return (
    <div style={{ display: "inline-flex", transform: `scale(${k})`, transformOrigin: "left center" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: size * 0.4,
          padding: `${size * 0.28}px ${size * 0.62}px`,
          borderRadius: 999,
          background: alert ? palette.alertBg : palette.successBg,
          color,
          fontFamily: font,
          fontSize: size,
          fontWeight: 600,
          lineHeight: 1,
          whiteSpace: "nowrap",
          boxShadow: pulse >= 0 ? `0 0 0 ${pulse * size * 0.6}px ${withAlpha(palette.alertText, 0.28 * (1 - pulse))}` : undefined,
        }}
      >
        <span style={{ width: size * 0.38, height: size * 0.38, borderRadius: "50%", background: color }} />
        {tag.text}
      </div>
    </div>
  );
};
