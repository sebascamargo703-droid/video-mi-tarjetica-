import React from "react";
import { palette, lightA } from "../brand";
import { sans } from "../fonts";
import { WithEmoji } from "./Emoji";

/** Ícono de la cafetería: grano de café sobre coffee. */
export const CafeIcon: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.27, background: palette.coffee, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.45} height={size * 0.6} viewBox="0 0 28 36">
      <g transform="translate(14 18) rotate(-18)">
        <ellipse rx={10.5} ry={15} fill="#F3E7D7" />
        <path d="M0 -12 C5 -4 -5 4 0 12" fill="none" stroke={palette.coffee} strokeWidth={2.4} strokeLinecap="round" />
      </g>
    </svg>
  </div>
);

/** Notificación de pantalla de bloqueo con fondo de vidrio (light al 93 %). `size` = tamaño del mensaje. */
export const LockNotification: React.FC<{ app: string; when: string; message: string; size: number }> = ({ app, when, message, size }) => (
  <div
    style={{
      borderRadius: size * 1.2,
      padding: `${size * 0.85}px ${size * 0.95}px ${size * 0.95}px`,
      background: lightA(0.93),
      backdropFilter: "blur(16px)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
      fontFamily: sans,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.42 }}>
      <CafeIcon size={size * 1.55} />
      <span style={{ fontSize: size * 0.84, fontWeight: 600, color: palette.ink, whiteSpace: "nowrap" }}>{app}</span>
      <span style={{ marginLeft: "auto", fontSize: size * 0.78, color: palette.inkSecondary }}>{when}</span>
    </div>
    <div style={{ marginTop: size * 0.5, fontSize: size, lineHeight: 1.32, color: palette.ink }}>
      <WithEmoji text={message} />
    </div>
  </div>
);
