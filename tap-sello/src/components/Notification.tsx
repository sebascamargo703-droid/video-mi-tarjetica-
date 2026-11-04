import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { copy } from "../copy";
import { font, tracking } from "../fonts";
import { ease, springIn } from "../motion";

/** Notificación de pantalla de bloqueo con fondo de vidrio (backdrop-filter). Cae desde arriba. */
export const Notification: React.FC<{ width: number; at: number }> = ({ width: w, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = copy.lock;
  const p = springIn(frame, fps, at);
  const fade = ease(frame, at, Math.round(fps * 0.35));
  return (
    <div
      style={{
        width: w,
        borderRadius: 30,
        padding: 18,
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        background: "rgba(255,255,255,0.16)",
        backdropFilter: "blur(22px) saturate(170%)",
        WebkitBackdropFilter: "blur(22px) saturate(170%)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.18)",
        fontFamily: font,
        color: brand.colors.white,
        transform: `translateY(${(1 - p) * -170}px) scale(${0.9 + 0.1 * p})`,
        opacity: fade,
        filter: p < 0.98 ? `blur(${(1 - p) * 8}px)` : undefined,
      }}
    >
      <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 13, background: brand.colors.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.9} strokeLinecap="round">
          <circle cx="6" cy="7" r="3" />
          <circle cx="6" cy="17" r="3" />
          <path d="M8.5 8.5L20 18M8.5 15.5L20 6" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600, opacity: 0.75 }}>
          <span style={{ letterSpacing: tracking.caps, textTransform: "uppercase" }}>{l.notifApp}</span>
          <span>{l.notifWhen}</span>
        </div>
        <div style={{ fontSize: 21, fontWeight: 800, marginTop: 4, letterSpacing: tracking.body }}>{l.notifTitle}</div>
        <div style={{ fontSize: 19, fontWeight: 400, lineHeight: 1.3, opacity: 0.92 }}>{l.notifBody}</div>
      </div>
    </div>
  );
};
