import React from "react";
import { biz, brand } from "../brand";
import { business, card, copy, customer } from "../copy";
import { font, tracking } from "../fonts";
import { BizIcon } from "./BizIcon";

const Check: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const cardBackground = `linear-gradient(145deg, ${biz.deep} 0%, ${biz.deeper} 100%)`;

/** Contenido de la tarjeta del Wallet del negocio (el fondo y el tamaño los pone la escena). */
export const WalletCard: React.FC<{ width: number; height: number }> = ({ width: w, height: h }) => {
  const pad = 30;
  const d = 82;
  return (
    <div style={{ position: "relative", width: w, height: h, fontFamily: font, color: brand.colors.white }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 10% 0%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 55%)" }} />
      <div style={{ position: "absolute", top: pad, left: pad, right: pad, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: biz.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BizIcon size={40} color={biz.deep} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 42, letterSpacing: tracking.title }}>{business.name}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: tracking.caps, opacity: 0.8 }}>SELLOS</div>
          <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1 }}>
            {card.stamps}
            <span style={{ opacity: 0.6 }}>/{card.total}</span>
          </div>
        </div>
      </div>
      {/* Banda dorada del regalo */}
      <div
        style={{
          position: "absolute",
          top: 122,
          left: pad,
          right: pad,
          padding: "16px 22px",
          borderRadius: 20,
          background: `linear-gradient(135deg, #D9BC86 0%, ${biz.accent} 55%, #B48D52 100%)`,
          color: biz.onAccent,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: "0.04em" }}>{copy.cardBandTitle}</div>
        <div style={{ fontWeight: 600, fontSize: 30, marginTop: 4 }}>{copy.cardBandText}</div>
      </div>
      {/* Sellos */}
      <div style={{ position: "absolute", top: 268, left: pad, right: pad, display: "grid", gridTemplateColumns: `repeat(${Math.ceil(card.total / 2)}, 1fr)`, rowGap: 22, justifyItems: "center" }}>
        {Array.from({ length: card.total }).map((_, i) =>
          i < card.stamps ? (
            <div key={i} style={{ width: d, height: d, borderRadius: "50%", background: biz.primary, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(0,0,0,0.22)" }}>
              <Check size={42} color={biz.deep} />
            </div>
          ) : (
            <div key={i} style={{ width: d, height: d, borderRadius: "50%", border: "3px dashed rgba(232,180,184,0.55)" }} />
          ),
        )}
      </div>
      <div style={{ position: "absolute", left: pad, right: pad, bottom: pad, display: "flex", gap: 40, whiteSpace: "nowrap" }}>
        {[
          ["CLIENTE", customer.fullName],
          ["PREMIO", card.reward],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: tracking.caps, opacity: 0.8 }}>{k}</div>
            <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: tracking.body }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
