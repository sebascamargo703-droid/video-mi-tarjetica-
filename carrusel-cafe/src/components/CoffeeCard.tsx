import React from "react";
import { palette } from "../brand";
import { cardCopy } from "../carousels";
import { sans } from "../fonts";

const CREAM = "#F3E7D7";

/** Grano de café (sello): lleno en crema o solo contorno. */
const BeanStamp: React.FC<{ size: number; filled: boolean }> = ({ size, filled }) => (
  <svg width={size * 0.78} height={size} viewBox="0 0 28 36" style={{ display: "block" }}>
    <g transform="translate(14 18) rotate(-18)">
      <ellipse rx={10.5} ry={15} fill={filled ? CREAM : "none"} stroke={filled ? CREAM : "rgba(243, 231, 215, 0.55)"} strokeWidth={2} />
      <path d="M0 -12 C5 -4 -5 4 0 12" fill="none" stroke={filled ? palette.coffee : "rgba(243, 231, 215, 0.55)"} strokeWidth={2.2} strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * Tarjeta de sellos de la cafetería (color coffee, texto blanco 8.48:1; etiquetas en crema 6.3:1).
 * Todo es relativo al ancho `w`.
 */
export const CoffeeCard: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => {
  const P = w * 0.065;
  const caps: React.CSSProperties = { fontSize: w * 0.034, fontWeight: 600, letterSpacing: "0.09em", color: CREAM, lineHeight: 1 };
  return (
    <div
      style={{
        position: "relative",
        width: w,
        borderRadius: w * 0.06,
        background: `linear-gradient(155deg, #7A4E2A 0%, ${palette.coffee} 55%, #5A381C 100%)`,
        padding: P,
        boxSizing: "border-box",
        color: palette.light,
        fontFamily: sans,
        boxShadow: `0 ${w * 0.08}px ${w * 0.16}px ${palette.shadowStrong}`,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* textura de líneas finas */}
      <svg style={{ position: "absolute", right: -w * 0.08, top: -w * 0.06, opacity: 0.12 }} width={w * 0.5} height={w * 0.5} viewBox="0 0 100 100">
        {[20, 32, 44, 56].map((r) => (
          <circle key={r} cx={70} cy={30} r={r} fill="none" stroke={CREAM} strokeWidth={1} />
        ))}
      </svg>
      <div style={{ display: "flex", alignItems: "center", gap: w * 0.035 }}>
        <div style={{ width: w * 0.13, height: w * 0.13, borderRadius: w * 0.035, background: "rgba(243, 231, 215, 0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BeanStamp size={w * 0.08} filled />
        </div>
        <div style={{ fontSize: w * 0.064, fontWeight: 600, letterSpacing: "-0.01em" }}>{cardCopy.business}</div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: w * 0.025, marginTop: w * 0.06 }}>
        <span style={caps}>{cardCopy.stampsLabel}</span>
        <span style={{ fontSize: w * 0.058, fontWeight: 600 }}>
          {cardCopy.stamps}/{cardCopy.total}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(5, 1fr)`, rowGap: w * 0.03, marginTop: w * 0.035, justifyItems: "center" }}>
        {Array.from({ length: cardCopy.total }).map((_, i) => (
          <BeanStamp key={i} size={w * 0.105} filled={i < cardCopy.stamps} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: w * 0.06 }}>
        <div>
          <div style={caps}>{cardCopy.customerLabel}</div>
          <div style={{ fontSize: w * 0.05, fontWeight: 600, marginTop: w * 0.018 }}>{cardCopy.customer}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={caps}>{cardCopy.rewardLabel}</div>
          <div style={{ fontSize: w * 0.05, fontWeight: 600, marginTop: w * 0.018 }}>{cardCopy.reward}</div>
        </div>
      </div>
    </div>
  );
};
