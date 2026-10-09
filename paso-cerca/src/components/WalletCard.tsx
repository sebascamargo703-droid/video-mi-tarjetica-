import React from "react";
import { brand } from "../brand";
import { business, card, promo } from "../copy";
import { font, tracking } from "../fonts";
import { BusinessIcon } from "./BusinessPin";

const Check: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Contenido de la tarjeta del Wallet (el fondo verde y el tamaño los pone la escena). */
export const WalletCard: React.FC<{ width: number; height: number }> = ({ width: w, height: h }) => {
  const pad = 30;
  const d = 82;
  return (
    <div style={{ position: "relative", width: w, height: h, fontFamily: font, color: brand.colors.white }}>
      <div style={{ position: "absolute", top: pad, left: pad, right: pad, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BusinessIcon size={40} color={brand.colors.white} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 42, letterSpacing: tracking.title }}>{business.name}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: tracking.caps, opacity: 0.75 }}>{card.stampsLabel}</div>
          <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1 }}>
            {card.stamps}
            <span style={{ opacity: 0.55 }}>/{card.total}</span>
          </div>
        </div>
      </div>
      {/* Banda de promo */}
      <div
        style={{
          position: "absolute",
          top: 124,
          left: pad,
          right: pad,
          height: 66,
          borderRadius: 18,
          background: brand.colors.mint,
          color: brand.colors.greenDeep,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: "0.01em",
        }}
      >
        {promo.band}
      </div>
      {/* Sellos */}
      <div style={{ position: "absolute", top: 222, left: pad, right: pad, display: "grid", gridTemplateColumns: `repeat(${Math.ceil(card.total / 2)}, 1fr)`, rowGap: 22, justifyItems: "center" }}>
        {Array.from({ length: card.total }).map((_, i) =>
          i < card.stamps ? (
            <div key={i} style={{ width: d, height: d, borderRadius: "50%", background: brand.colors.white, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(0,0,0,0.2)" }}>
              <Check size={42} color={brand.colors.green} />
            </div>
          ) : (
            <div key={i} style={{ width: d, height: d, borderRadius: "50%", border: "3px dashed rgba(255,255,255,0.42)" }} />
          ),
        )}
      </div>
      <div style={{ position: "absolute", left: pad, right: pad, bottom: pad, display: "flex", gap: 40, whiteSpace: "nowrap" }}>
        {[
          [card.customerLabel, card.customer],
          [card.rewardLabel, card.reward],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: tracking.caps, opacity: 0.75 }}>{k}</div>
            <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: tracking.body }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const cardBackground = `linear-gradient(145deg, ${brand.colors.greenMid} 0%, ${brand.colors.green} 45%, ${brand.colors.greenDeep} 100%)`;
