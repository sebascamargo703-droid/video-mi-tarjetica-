import React from "react";
import { brand } from "../brand";
import { copy } from "../copy";
import { font } from "../fonts";
import { SCREEN_W } from "../layout";
import { Notification } from "./Notification";

/** Pantalla de bloqueo: fondo con manchas de color (para que el vidrio se note), hora y notificación. */
export const LockScreen: React.FC<{ notifAt: number }> = ({ notifAt }) => {
  const l = copy.lock;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        fontFamily: font,
        color: brand.colors.white,
        background: `radial-gradient(circle at 20% 70%, ${brand.colors.mint} 0%, rgba(105,211,190,0) 38%),
          radial-gradient(circle at 85% 35%, ${brand.colors.greenMid} 0%, rgba(22,112,93,0) 45%),
          linear-gradient(170deg, #0B2F28 0%, ${brand.colors.greenDeep} 45%, #031512 100%)`,
      }}
    >
      <div style={{ position: "absolute", top: 108, width: "100%", textAlign: "center", fontSize: 19, fontWeight: 600, opacity: 0.88 }}>{l.date}</div>
      <div
        style={{
          position: "absolute",
          top: 128,
          width: "100%",
          textAlign: "center",
          fontSize: 104,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {l.time}
      </div>
      <div style={{ position: "absolute", top: 300, left: 12 }}>
        <Notification width={SCREEN_W - 24} at={notifAt} />
      </div>
      <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", width: 130, height: 5, borderRadius: 99, background: "rgba(255,255,255,0.85)" }} />
    </div>
  );
};
