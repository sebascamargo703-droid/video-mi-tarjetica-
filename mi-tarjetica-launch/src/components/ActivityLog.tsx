import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { copy } from "../copy";
import { fonts, tracking } from "../fonts";
import { ease, presence } from "../lib/motion";

const Check: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M5 12.5l4.2 4.2L19 7"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Badge: React.FC<{ size: number; label: string; t: number }> = ({
  size,
  label,
  t,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.3,
      padding: `${size * 0.3}px ${size * 0.7}px ${size * 0.3}px ${size * 0.5}px`,
      borderRadius: 999,
      background: "rgba(105,211,190,0.14)",
      color: brand.colors.mint,
      fontWeight: 600,
      fontSize: size,
      transform: `scale(${0.8 + 0.2 * t})`,
      opacity: t,
      whiteSpace: "nowrap",
    }}
  >
    <Check size={size * 1.1} color={brand.colors.mint} />
    {label}
  </div>
);

/**
 * Registro antifraude: cada sello con cajero, hora, caja y dispositivo.
 * `compact` lo recompone en tarjetas apiladas (para vertical).
 */
export const ActivityLog: React.FC<{
  width: number;
  enterAt: number;
  exitAt?: number;
  compact?: boolean;
}> = ({ width: w, enterAt, exitAt = Infinity, compact = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = copy.fraud;
  const rowGap = Math.round(fps * 0.22);
  const box = presence(frame, enterAt, Math.round(fps * 0.8), exitAt);
  const fs = compact ? w * 0.036 : w * 0.0195;

  const container: React.CSSProperties = {
    width: w,
    borderRadius: w * (compact ? 0.05 : 0.022),
    background: "rgba(255,255,255,0.045)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
    fontFamily: fonts.body,
    color: brand.colors.white,
    overflow: "hidden",
    opacity: box,
    transform: `translateY(${(1 - box) * w * 0.03}px)`,
    filter: box < 0.99 ? `blur(${(1 - box) * 8}px)` : undefined,
  };

  if (compact) {
    return (
      <div style={{ ...container, padding: w * 0.02 }}>
        {f.rows.map((row, i) => {
          const t = ease(frame, enterAt + Math.round(fps * 0.3) + i * rowGap, Math.round(fps * 0.6));
          const b = ease(frame, enterAt + Math.round(fps * 0.6) + i * rowGap, Math.round(fps * 0.4));
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `${w * 0.035}px ${w * 0.04}px`,
                borderTop: i === 0 ? undefined : `1px solid ${brand.colors.hairlineDark}`,
                opacity: t,
                transform: `translateY(${(1 - t) * w * 0.03}px)`,
              }}
            >
              <div>
                <div style={{ fontSize: fs * 1.15, fontWeight: 600, letterSpacing: tracking.body }}>
                  <span style={{ color: brand.colors.gray, fontVariantNumeric: "tabular-nums" }}>{row[0]}</span>
                  {"  "}
                  {row[1]}
                </div>
                <div style={{ fontSize: fs, color: brand.colors.gray, marginTop: fs * 0.25 }}>
                  {row[2]} · {row[3]} · {row[4]}
                </div>
              </div>
              <Badge size={fs * 0.95} label={row[5]} t={b} />
            </div>
          );
        })}
      </div>
    );
  }

  const cols = "0.8fr 1.1fr 1.1fr 0.8fr 1.4fr 1fr";
  const cell: React.CSSProperties = { padding: `${w * 0.018}px ${w * 0.024}px` };
  return (
    <div style={container}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: cols,
          fontSize: fs * 0.78,
          fontWeight: 600,
          letterSpacing: tracking.caps,
          textTransform: "uppercase",
          color: brand.colors.gray,
          borderBottom: `1px solid ${brand.colors.hairlineDark}`,
        }}
      >
        {f.header.map((hd, i) => (
          <div key={i} style={cell}>
            {hd}
          </div>
        ))}
      </div>
      {f.rows.map((row, i) => {
        const t = ease(frame, enterAt + Math.round(fps * 0.3) + i * rowGap, Math.round(fps * 0.6));
        const b = ease(frame, enterAt + Math.round(fps * 0.6) + i * rowGap, Math.round(fps * 0.4));
        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: cols,
              alignItems: "center",
              fontSize: fs,
              fontVariantNumeric: "tabular-nums",
              borderTop: i === 0 ? undefined : `1px solid ${brand.colors.hairlineDark}`,
              opacity: t,
              transform: `translateY(${(1 - t) * w * 0.012}px)`,
            }}
          >
            <div style={{ ...cell, color: brand.colors.gray }}>{row[0]}</div>
            <div style={{ ...cell, fontWeight: 600 }}>{row[1]}</div>
            <div style={cell}>{row[2]}</div>
            <div style={cell}>{row[3]}</div>
            <div style={{ ...cell, color: "rgba(255,255,255,0.8)" }}>{row[4]}</div>
            <div style={cell}>
              <Badge size={fs * 0.85} label={row[5]} t={b} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
