import React from "react";
import { brand } from "../brand";
import { copy } from "../copy";
import { font } from "../fonts";

/** Pantalla de bloqueo: degradado oscuro con manchas de color (para que el vidrio se note), fecha y hora. */
export const LockScreen: React.FC<{ children?: React.ReactNode; clockOpacity?: number }> = ({ children, clockOpacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      fontFamily: font,
      color: brand.colors.white,
      background: `radial-gradient(circle at 18% 62%, rgba(105,211,190,0.55) 0%, rgba(105,211,190,0) 34%),
        radial-gradient(circle at 88% 40%, rgba(233,162,59,0.38) 0%, rgba(233,162,59,0) 36%),
        radial-gradient(circle at 60% 90%, ${brand.colors.greenMid} 0%, rgba(22,112,93,0) 40%),
        linear-gradient(170deg, #0D1F1B 0%, #08241E 45%, #020807 100%)`,
    }}
  >
    <div style={{ position: "absolute", top: 118, width: "100%", textAlign: "center", fontSize: 34, fontWeight: 600, opacity: 0.9 * clockOpacity }}>{copy.lockDate}</div>
    <div style={{ position: "absolute", top: 150, opacity: clockOpacity, width: "100%", textAlign: "center", fontSize: 176, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}>
      {copy.lockTime}
    </div>
    {children}
    <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", width: 230, height: 9, borderRadius: 99, background: "rgba(255,255,255,0.85)" }} />
  </div>
);
