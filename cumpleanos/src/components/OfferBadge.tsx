import React from "react";
import { biz, brand } from "../brand";
import { offer } from "../copy";
import { font } from "../fonts";

/** Badge circular del descuento ("-20 %"). La escena controla escala y giro. */
export const OfferBadge: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle at 30% 25%, #95404E 0%, ${biz.deep} 60%, ${biz.deeper} 100%)`,
      color: brand.colors.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: font,
      fontWeight: 800,
      fontSize: size * 0.3,
      letterSpacing: "-0.04em",
      boxShadow: `0 20px 50px rgba(0,0,0,0.35), 0 0 0 8px ${biz.accent}55`,
      position: "relative",
      whiteSpace: "nowrap",
    }}
  >
    <div style={{ position: "absolute", inset: size * 0.06, borderRadius: "50%", border: `3px dashed ${biz.accent}`, opacity: 0.8 }} />
    {offer.badge}
  </div>
);
