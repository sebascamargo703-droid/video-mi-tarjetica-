import React from "react";
import { brand } from "../brand";
import { notification } from "../copy";
import { font, tracking } from "../fonts";
import { BusinessIcon } from "./BusinessPin";

/** Notificación de la tarjeta (estilo pantalla de bloqueo). `scale` 1 = diseño a 640 px de ancho. */
export const Notification: React.FC<{ width?: number; light?: boolean }> = ({ width = 640, light = false }) => {
  const k = width / 640;
  const fg = light ? brand.colors.ink : brand.colors.white;
  return (
    <div
      style={{
        width,
        padding: 24 * k,
        borderRadius: 34 * k,
        display: "flex",
        gap: 20 * k,
        alignItems: "flex-start",
        fontFamily: font,
        color: fg,
        ...(light
          ? { background: "rgba(246,242,234,0.96)", boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }
          : {
              background: "rgba(255,255,255,0.16)",
              backdropFilter: "blur(30px) saturate(170%)",
              WebkitBackdropFilter: "blur(30px) saturate(170%)",
              border: "1.5px solid rgba(255,255,255,0.15)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
            }),
      }}
    >
      <div
        style={{
          width: 76 * k,
          height: 76 * k,
          flexShrink: 0,
          borderRadius: 20 * k,
          background: `linear-gradient(145deg, ${brand.colors.greenMid}, ${brand.colors.greenDeep})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BusinessIcon size={46 * k} color={brand.colors.white} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 24 * k, letterSpacing: tracking.caps }}>
          <span style={{ fontWeight: 800 }}>{notification.app}</span>
          <span style={{ fontWeight: 600, opacity: 0.7, letterSpacing: 0 }}>{notification.when}</span>
        </div>
        <div style={{ fontSize: 34 * k, fontWeight: 800, lineHeight: 1.2, marginTop: 4 * k, letterSpacing: tracking.body }}>{notification.title}</div>
        <div style={{ fontSize: 31 * k, fontWeight: 400, lineHeight: 1.25, marginTop: 2 * k }}>{notification.body}</div>
      </div>
    </div>
  );
};
