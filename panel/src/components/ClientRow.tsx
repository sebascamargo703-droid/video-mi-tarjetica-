import React from "react";
import { palette } from "../brand";
import { font } from "../fonts";
import { EASE, ease } from "../motion";
import type { Client } from "../panelData";
import type { Layout } from "../layout";
import { StampProgress } from "./StampProgress";
import { StatusTag } from "./StatusTag";

/**
 * Fila de cliente: avatar con iniciales · nombre (+ etiqueta) · última visita · sellos.
 * Entra desde la derecha; `highlightVisit` (0–1) resalta la última visita en rojo suave.
 */
export const ClientRow: React.FC<{
  client: Client;
  L: Layout;
  frame: number;
  fps: number;
  at: number;
  tagAt: number;
  highlightVisit?: number;
  opacity?: number;
}> = ({ client, L, frame, fps, at, tagAt, highlightVisit = 0, opacity = 1 }) => {
  const k = ease(frame, at, 30, EASE);
  if (k <= 0) return null;
  const initials = client.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  const c = L.cols;
  const H = L.rowH;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: L.PW,
        height: H,
        fontFamily: font,
        opacity: k * opacity,
        transform: `translateX(${(1 - k) * 90}px) scale(${0.98 + 0.02 * k})`,
      }}
    >
      {/* avatar */}
      <div
        style={{
          position: "absolute",
          left: c.avatar,
          top: H / 2 - 32,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: palette.successBg,
          color: palette.brand,
          fontSize: 24,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {initials}
      </div>
      {/* nombre + etiqueta */}
      <div style={{ position: "absolute", left: c.name, width: c.nameW, top: 0, height: H, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
        <div style={{ fontSize: 33, fontWeight: 600, color: palette.panelText, letterSpacing: "-0.01em", lineHeight: 1.05, whiteSpace: "nowrap" }}>{client.name}</div>
        {client.tag ? <StatusTag tag={client.tag} frame={frame} fps={fps} at={tagAt} size={23} /> : null}
      </div>
      {/* última visita */}
      <div style={{ position: "absolute", left: c.visit, width: c.visitW, top: 0, height: H, display: "flex", alignItems: "center" }}>
        <div style={{ position: "relative", fontSize: 32, fontWeight: highlightVisit > 0.5 ? 600 : 400, color: highlightVisit > 0.5 ? palette.alertText : palette.panelTextSecondary, whiteSpace: "nowrap", lineHeight: 1 }}>
          {highlightVisit > 0 ? (
            <div style={{ position: "absolute", left: -10, top: -10, bottom: -10, width: `calc(${highlightVisit * 100}% + 20px)`, borderRadius: 12, background: palette.alertBg }} />
          ) : null}
          <span style={{ position: "relative" }}>{client.lastVisit}</span>
        </div>
      </div>
      {/* sellos */}
      <div style={{ position: "absolute", left: c.stamps, top: H / 2 - 30 }}>
        <StampProgress stamps={client.stamps} total={client.total} frame={frame} at={at + 8} w={c.stampsW} />
      </div>
      {/* separador */}
      <div style={{ position: "absolute", left: L.P, right: L.P, bottom: 0, height: 2, background: palette.panelBorder }} />
    </div>
  );
};
