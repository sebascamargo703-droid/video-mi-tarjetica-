import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { copy } from "../copy";
import { fonts, tracking } from "../fonts";
import { ease, softSpring } from "../lib/motion";
import { LogoMark } from "./Logo";

/**
 * Notificación de pantalla de bloqueo (UI genérica, efecto vidrio).
 * Entra desde arriba con spring suave + desenfoque.
 */
export const LockScreenNotification: React.FC<{
  width: number;
  enterAt: number;
  light?: boolean;
  style?: React.CSSProperties;
}> = ({ width: w, enterAt, light = false, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = copy.nearby.notification;
  const p = softSpring(frame, fps, enterAt);
  const fade = ease(frame, enterAt, Math.round(fps * 0.5));
  const pad = w * 0.045;

  return (
    <div
      style={{
        width: w,
        borderRadius: w * 0.07,
        padding: pad,
        background: light ? "rgba(255,255,255,0.86)" : "rgba(40,48,46,0.55)",
        backdropFilter: "blur(24px) saturate(160%)",
        boxShadow: `0 ${w * 0.04}px ${w * 0.12}px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,${light ? 0.6 : 0.12})`,
        display: "flex",
        gap: w * 0.04,
        alignItems: "flex-start",
        fontFamily: fonts.body,
        color: light ? brand.colors.black : brand.colors.white,
        transform: `translateY(${(1 - p) * -w * 0.35}px) scale(${0.92 + 0.08 * p})`,
        opacity: fade,
        filter: p < 0.98 ? `blur(${(1 - p) * w * 0.02}px)` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          width: w * 0.12,
          height: w * 0.12,
          flexShrink: 0,
          borderRadius: w * 0.03,
          background: brand.colors.green,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LogoMark height={w * 0.042} color={brand.colors.white} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: w * 0.034,
            fontWeight: 600,
            letterSpacing: tracking.caps,
            opacity: 0.6,
          }}
        >
          <span>{n.app}</span>
          <span style={{ letterSpacing: 0 }}>{n.when}</span>
        </div>
        <div
          style={{
            fontSize: w * 0.048,
            fontWeight: 600,
            marginTop: w * 0.008,
            letterSpacing: tracking.body,
          }}
        >
          {n.title}
        </div>
        <div
          style={{
            fontSize: w * 0.044,
            fontWeight: 400,
            lineHeight: 1.3,
            opacity: 0.9,
            marginTop: w * 0.004,
          }}
        >
          {n.body}
        </div>
      </div>
    </div>
  );
};
