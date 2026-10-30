import React from "react";
import { brand } from "../brand";
import { promo } from "../copy";
import { font } from "../fonts";

/** Badge circular grande con la promo ("2x1"). La escena controla escala y giro. */
export const PromoBadge: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: brand.colors.mint,
      color: brand.colors.greenDeep,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: font,
      fontWeight: 800,
      fontSize: size * 0.42,
      letterSpacing: "-0.04em",
      boxShadow: "0 20px 50px rgba(0,0,0,0.45), 0 0 0 8px rgba(105,211,190,0.25)",
      position: "relative",
    }}
  >
    <div style={{ position: "absolute", inset: size * 0.06, borderRadius: "50%", border: `3px dashed ${brand.colors.greenDeep}`, opacity: 0.45 }} />
    {promo.badge}
  </div>
);
