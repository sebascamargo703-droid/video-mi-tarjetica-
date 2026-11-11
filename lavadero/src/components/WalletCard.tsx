import React from "react";
import { card, palette } from "../brand";
import { copy } from "../copy";
import { font, tracking } from "../fonts";
import { Drop } from "./Drop";
import { RollNumber } from "./RollNumber";
import { StampRow } from "./StampRow";
import { VisitCounter } from "./VisitCounter";

/** Geometría de la tarjeta (relativa al ancho `w`). La comparten la tarjeta y la gota voladora. */
export const cardGeom = (w: number) => {
  const P = 0.055 * w;
  const headerH = 0.09 * w;
  const labelY = P + headerH + 0.04 * w;
  const labelH = 0.05 * w;
  const dropsY = labelY + labelH + 0.028 * w;
  const d = 0.066 * w;
  const slot = (w - 2 * P) / copy.stampsTotal;
  const footerY = dropsY + d + 0.05 * w;
  const footerH = 0.11 * w;
  const H = footerY + footerH + P;
  const centers = Array.from({ length: copy.stampsTotal }, (_, k) => ({ x: P + slot * (k + 0.5), y: dropsY + d / 2 }));
  return { P, headerH, labelY, labelH, dropsY, d, footerY, footerH, H, centers };
};

/**
 * Tarjeta del lavadero tal como se ve en el Wallet del cliente: encabezado, "SELLOS n/10",
 * 10 gotas, cliente y premio. Al completarse, el pie se transforma en "¡PREMIO DISPONIBLE!".
 */
export const WalletCard: React.FC<{
  w: number;
  stamps: number;
  fill: number[];
  ring: number[];
  visit: number;
  /** 0–1: transformación del pie en el banner del premio. */
  prize: number;
  /** 0–1: brillo diagonal (fuera de rango = no se ve). */
  sheen: number;
  sheenStrength?: number;
}> = ({ w, stamps, fill, ring, visit, prize, sheen, sheenStrength = 0.4 }) => {
  const g = cardGeom(w);
  const caps: React.CSSProperties = { fontSize: 0.026 * w, fontWeight: 800, letterSpacing: tracking.caps, color: card.textSoft, lineHeight: 1 };
  const x = -60 + sheen * 220;
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: g.H,
        borderRadius: 0.06 * w,
        background: `linear-gradient(160deg, ${card.bg} 0%, ${card.bg} 55%, ${card.bgDeep} 100%)`,
        boxShadow: `0 0 0 2px rgba(255,255,255,0.2), 0 ${0.08 * w}px ${0.16 * w}px ${palette.shadow}`,
        overflow: "hidden",
        fontFamily: font,
        color: card.text,
      }}
    >
      {/* franja celeste superior (decorativa) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 0.014 * w, background: card.highlight }} />

      {/* encabezado */}
      <div style={{ position: "absolute", left: g.P, right: g.P, top: g.P, height: g.headerH, display: "flex", alignItems: "center", gap: 0.03 * w }}>
        <div style={{ width: g.headerH, height: g.headerH, borderRadius: 0.026 * w, background: "rgba(255, 255, 255, 0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Drop size={g.headerH * 0.62} fill={card.drop} highlight={card.dropGlow} />
        </div>
        <div style={{ fontSize: 0.054 * w, fontWeight: 800, letterSpacing: tracking.title, whiteSpace: "nowrap" }}>{copy.business}</div>
        <div style={{ marginLeft: "auto" }}>
          <VisitCounter label={copy.labels.visit} value={visit} size={0.032 * w} />
        </div>
      </div>

      {/* SELLOS n/10 */}
      <div style={{ position: "absolute", left: g.P, top: g.labelY, height: g.labelH, display: "flex", alignItems: "flex-end", gap: 0.02 * w }}>
        <span style={{ ...caps, paddingBottom: 0.006 * w }}>{copy.labels.stamps}</span>
        <span style={{ fontSize: 0.046 * w, fontWeight: 800, lineHeight: 1, display: "inline-flex" }}>
          <RollNumber value={stamps} lineHeight={0.05 * w} />
          <span style={{ lineHeight: `${0.05 * w}px` }}>/{copy.stampsTotal}</span>
        </span>
      </div>

      {/* gotas */}
      <StampRow centers={g.centers} size={g.d} fill={fill} ring={ring} />

      {/* pie: cliente · premio */}
      <div
        style={{
          position: "absolute",
          left: g.P,
          right: g.P,
          top: g.footerY,
          height: g.footerH,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          opacity: Math.max(0, 1 - prize * 1.4),
          transform: `translateY(${-Math.min(1, prize) * 16}px)`,
        }}
      >
        <div>
          <div style={caps}>{copy.labels.customer}</div>
          <div style={{ fontSize: 0.04 * w, fontWeight: 800, marginTop: 0.014 * w }}>{copy.customer}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={caps}>{copy.labels.reward}</div>
          <div style={{ fontSize: 0.04 * w, fontWeight: 800, marginTop: 0.014 * w }}>{copy.reward}</div>
        </div>
      </div>
      {prize > 0 ? (
        <div
          style={{
            position: "absolute",
            left: g.P,
            right: g.P,
            top: g.footerY - 0.01 * w,
            height: g.footerH + 0.02 * w,
            borderRadius: 0.03 * w,
            background: card.prizeBg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.008 * w,
            opacity: Math.min(1, prize * 1.5),
            transform: `scale(${0.9 + 0.1 * Math.min(1.08, prize)})`,
            boxShadow: `0 0 ${0.05 * w}px rgba(125, 211, 252, ${0.8 * prize})`,
          }}
        >
          <div style={{ fontSize: 0.044 * w, fontWeight: 800, color: card.prizeTitle, letterSpacing: tracking.title, lineHeight: 1 }}>{copy.prizeTitle}</div>
          <div style={{ fontSize: 0.034 * w, fontWeight: 600, color: card.prizeText, lineHeight: 1 }}>{copy.reward}</div>
        </div>
      ) : null}

      {/* brillo */}
      {sheen > 0 && sheen < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `linear-gradient(105deg, transparent ${x - 20}%, rgba(255,255,255,${sheenStrength * 0.4}) ${x - 7}%, rgba(255,255,255,${sheenStrength}) ${x}%, rgba(255,255,255,${sheenStrength * 0.4}) ${x + 7}%, transparent ${x + 20}%)`,
          }}
        />
      ) : null}
    </div>
  );
};
