import React from "react";
import { BUSINESS, COLORS, MOMENTS as M, TEXTS } from "../constants";
import { FONT } from "../fonts";
import { EASE, pop, seg } from "../motion";
import { LogoMark } from "./LogoMark";
import { StampCard } from "./StampCard";

export const PHONE = { w: 660, h: 1340 } as const;

/**
 * Celular en primer plano con la pantalla de bloqueo: hora, la notificación de
 * cercanía (entra con spring + vibración) y la tarjeta con 9 de 10 sellos.
 * `t` es el segundo absoluto del video.
 */
export const PhoneLock: React.FC<{ t: number }> = ({ t }) => {
  const notif = pop(t, M.notification);
  const since = t - M.notification;
  // vibración: sacudida corta que se apaga
  const buzz = since >= 0 && since < 0.9 ? Math.exp(-since * 5) : 0;
  const shakeX = Math.sin(since * 82) * 11 * buzz;
  const shakeR = Math.sin(since * 82 + 1) * 0.9 * buzz;
  const card = seg(t, M.notification + 0.35, M.notification + 0.95, EASE.out);
  const screenW = PHONE.w - 28;
  return (
    <div style={{ width: PHONE.w, height: PHONE.h, position: "relative", transform: `translateX(${shakeX}px) rotate(${shakeR}deg)` }}>
      {/* ondas de vibración a los lados */}
      {[-1, 1].map((s) =>
        [0, 1].map((k) => (
          <div
            key={`${s}${k}`}
            style={{
              position: "absolute",
              top: PHONE.h * 0.32,
              left: s < 0 ? -34 - k * 26 : undefined,
              right: s > 0 ? -34 - k * 26 : undefined,
              width: 14,
              height: PHONE.h * 0.2 - k * 60,
              marginTop: k * 30,
              borderRadius: 10,
              borderLeft: s < 0 ? `6px solid ${COLORS.gold}` : undefined,
              borderRight: s > 0 ? `6px solid ${COLORS.gold}` : undefined,
              opacity: buzz * (k ? 0.5 : 0.9) * (Math.sin(since * 40) > 0 ? 1 : 0.4),
            }}
          />
        )),
      )}
      {/* cuerpo */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 92, background: "linear-gradient(145deg, #2A2F3C, #0B0D13)", boxShadow: "0 50px 120px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,255,255,0.12)" }} />
      {/* pantalla */}
      <div style={{ position: "absolute", left: 14, top: 14, width: screenW, height: PHONE.h - 28, borderRadius: 80, overflow: "hidden", background: "linear-gradient(170deg, #17264F 0%, #0B1330 45%, #2B1630 100%)", fontFamily: FONT.text }}>
        {/* brillo que sube con la notificación */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 38%, rgba(255,178,90,${0.22 * Math.min(1, notif)}), transparent 60%)` }} />
        <div style={{ position: "absolute", left: "50%", top: 26, width: 170, height: 44, marginLeft: -85, borderRadius: 24, background: "#000" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", color: "rgba(255,255,255,0.82)", fontSize: 34, fontWeight: 600 }}>{BUSINESS.date}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 158, textAlign: "center", color: COLORS.white, fontSize: 176, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.1 }}>{BUSINESS.clock}</div>

        {/* notificación */}
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            top: 410,
            padding: "22px 24px",
            borderRadius: 40,
            background: "rgba(246,248,255,0.94)",
            boxShadow: `0 20px 50px rgba(0,0,0,0.45), 0 0 ${60 * buzz}px rgba(255,194,75,0.7)`,
            display: "flex",
            gap: 20,
            alignItems: "center",
            transform: `translateY(${(1 - notif) * -150}px) scale(${0.72 + 0.28 * notif})`,
            opacity: Math.min(1, notif * 1.6),
          }}
        >
          <div style={{ width: 92, height: 92, flexShrink: 0, borderRadius: 24, background: `linear-gradient(160deg, #1D8A6E, ${COLORS.brandGreen})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoMark height={34} color={COLORS.white} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 23, fontWeight: 600, color: "#6B7084", letterSpacing: "0.03em" }}>
              <span>{TEXTS.notifApp}</span>
              <span>{TEXTS.notifTime}</span>
            </div>
            <div style={{ fontSize: 35, fontWeight: 800, color: "#10131F", letterSpacing: "-0.02em", marginTop: 4 }}>{TEXTS.notifTitle}</div>
            <div style={{ fontSize: 31, fontWeight: 600, color: "#2A2F40", lineHeight: 1.22, marginTop: 4 }}>{TEXTS.notifBody}</div>
          </div>
        </div>

        {/* tarjeta de sellos: 9 de 10, el décimo pulsa */}
        <div style={{ position: "absolute", left: 20, top: 660, transform: `translateY(${(1 - card) * 70}px)`, opacity: card }}>
          <StampCard width={screenW - 40} t={t} filled={BUSINESS.stampsFilled} />
        </div>
        <div style={{ position: "absolute", left: "50%", bottom: 22, width: 220, height: 9, marginLeft: -110, borderRadius: 5, background: "rgba(255,255,255,0.75)" }} />
      </div>
    </div>
  );
};
