import React from "react";
import { palette } from "../brand";
import { business } from "../post";
import { sans } from "../fonts";
import { SierraLogo } from "./SierraLogo";

/** Sello: un cuadrito de brownie (lleno) o solo el contorno (vacío). */
const BrownieStamp: React.FC<{ size: number; filled: boolean }> = ({ size, filled }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
    <rect x={4} y={6} width={32} height={28} rx={7} fill={filled ? palette.cocoa : "none"} stroke={filled ? palette.cocoa : "rgba(22, 14, 10, 0.4)"} strokeWidth={2.4} />
    {filled ? <path d="M9 14 C14 11 19 16 24 12 C27 10 30 12 31 13" fill="none" stroke={palette.butter} strokeWidth={2.2} strokeLinecap="round" opacity={0.85} /> : null}
  </svg>
);

/** Tarjeta de sellos de Repostería Sierra (mantequilla + cacao, como su etiqueta). */
export const SierraCard: React.FC<{ w: number }> = ({ w }) => {
  const P = w * 0.065;
  const caps: React.CSSProperties = { fontSize: w * 0.034, fontWeight: 600, letterSpacing: "0.09em", color: palette.cocoa, opacity: 0.8, lineHeight: 1 };
  return (
    <div
      style={{
        width: w,
        borderRadius: w * 0.06,
        background: `linear-gradient(155deg, #FAE3AE 0%, ${palette.butter} 60%, #EFCF88 100%)`,
        padding: P,
        boxSizing: "border-box",
        color: palette.cocoa,
        fontFamily: sans,
        boxShadow: `0 ${w * 0.08}px ${w * 0.16}px rgba(22, 14, 10, 0.35)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: w * 0.035 }}>
        <SierraLogo size={w * 0.15} shadow={false} style={{ boxShadow: "0 0 0 2px rgba(22,14,10,0.15)" }} />
        <div style={{ fontSize: w * 0.066, fontWeight: 800, letterSpacing: "-0.01em" }}>{business.name}</div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: w * 0.025, marginTop: w * 0.06 }}>
        <span style={caps}>SELLOS</span>
        <span style={{ fontSize: w * 0.058, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
          {business.stamps}/{business.total}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", rowGap: w * 0.025, marginTop: w * 0.035, justifyItems: "center" }}>
        {Array.from({ length: business.total }).map((_, i) => (
          <BrownieStamp key={i} size={w * 0.12} filled={i < business.stamps} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: w * 0.06 }}>
        <div>
          <div style={caps}>CLIENTE</div>
          <div style={{ fontSize: w * 0.05, fontWeight: 600, marginTop: w * 0.018 }}>{business.customer}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={caps}>PREMIO</div>
          <div style={{ fontSize: w * 0.05, fontWeight: 600, marginTop: w * 0.018 }}>{business.reward}</div>
        </div>
      </div>
    </div>
  );
};
