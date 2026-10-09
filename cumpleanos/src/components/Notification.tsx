import React from "react";
import { biz, brand } from "../brand";
import { notification } from "../copy";
import { font, tracking } from "../fonts";
import { BizIcon } from "./BizIcon";

/** Contenido de la notificación. Todo el texto ≥ 34 px a 1080 de ancho. */
export const Notification: React.FC<{ width: number }> = ({ width }) => (
  <div style={{ width, padding: 26, display: "flex", gap: 22, alignItems: "flex-start", fontFamily: font, color: brand.colors.white }}>
    <div
      style={{
        width: 84,
        height: 84,
        flexShrink: 0,
        borderRadius: 22,
        background: `linear-gradient(145deg, ${biz.primary}, #D8969C)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.35)",
      }}
    >
      <BizIcon size={50} color={biz.deep} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 34, lineHeight: 1.15 }}>
        <span style={{ fontWeight: 800, letterSpacing: tracking.body }}>{notification.app}</span>
        <span style={{ fontWeight: 400, opacity: 0.85 }}>{notification.when}</span>
      </div>
      <div style={{ fontSize: 36, fontWeight: 400, lineHeight: 1.26, marginTop: 6 }}>{notification.body}</div>
    </div>
  </div>
);

/** Vidrio de la notificación: blur 30 px y borde blanco al 15 %. */
export const glassStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.16)",
  backdropFilter: "blur(30px) saturate(170%)",
  WebkitBackdropFilter: "blur(30px) saturate(170%)",
  border: "1.5px solid rgba(255,255,255,0.15)",
  boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
};
