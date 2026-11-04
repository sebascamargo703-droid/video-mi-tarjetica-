import React from "react";
import { brand } from "../brand";
import { business, card } from "../copy";
import { font, logoFont, tracking } from "../fonts";
import { BusinessIcon } from "./BusinessPin";
import { QrCode } from "./QrCode";

/**
 * Tarjeta de sellos tal como se ve en el Wallet: crema, nombre en Fraunces, foto/ilustración
 * con los sellos encima, campos y QR. Diseñada a 600 px de ancho (≈ 820 de alto); `width` la escala.
 * `stamps` permite animar los sellos (número con decimales = el último entrando) y `pulse`
 * ilumina el siguiente espacio vacío.
 */
export const PASS_H = 820;
export const PassCard: React.FC<{ width: number; stamps?: number; pulse?: number; showQr?: boolean }> = ({ width, stamps = card.stamps, pulse = 0, showQr = true }) => {
  const k = width / 600;
  const d = card.total > 5 ? 76 : 84;
  return (
    <div style={{ width, height: PASS_H * k, overflow: "hidden", borderRadius: 30 * k, boxShadow: "0 30px 80px rgba(0,0,0,0.55)" }}>
      <div style={{ width: 600, height: PASS_H, transform: `scale(${k})`, transformOrigin: "0 0", background: brand.colors.cream, fontFamily: font, color: brand.colors.ink, position: "relative" }}>
        {/* encabezado */}
        <div style={{ position: "absolute", left: 30, right: 30, top: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 58, height: 58, borderRadius: 16, background: brand.colors.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BusinessIcon size={36} color={brand.colors.cream} />
            </div>
            <span style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 40, letterSpacing: "-0.01em" }}>{business.name}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: tracking.caps, opacity: 0.6 }}>SELLOS</div>
            <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>
              {Math.floor(stamps)}
              <span style={{ opacity: 0.45 }}>/{card.total}</span>
            </div>
          </div>
        </div>
        {/* foto con sellos */}
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: 112,
            height: 250,
            borderRadius: 20,
            overflow: "hidden",
            background: `radial-gradient(circle at 78% 30%, rgba(242,179,90,0.75), rgba(242,179,90,0) 45%),
              radial-gradient(circle at 20% 90%, rgba(105,211,190,0.35), rgba(105,211,190,0) 45%),
              linear-gradient(140deg, #3B2417 0%, #6E4327 55%, #A7703F 100%)`,
          }}
        >
          {/* granos de café decorativos */}
          {[
            [470, 40, 30, 20],
            [500, 180, -20, 16],
            [40, 30, 50, 14],
            [90, 200, 10, 18],
          ].map(([x, y, r, s], i) => (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: s * 1.5, height: s, borderRadius: "50%", background: "#2A170D", transform: `rotate(${r}deg)`, opacity: 0.55, boxShadow: "inset 0 -2px 0 rgba(255,255,255,0.12)" }} />
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: card.total > 5 ? 38 : 83, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: card.total > 5 ? "14px 22px" : 18, padding: card.total > 5 ? "0 60px" : 0 }}>
            {Array.from({ length: card.total }).map((_, i) => {
              const fill = Math.max(0, Math.min(1, stamps - i));
              const next = i === Math.floor(stamps) ? pulse : 0;
              return (
                <div key={i} style={{ width: d, height: d, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px dashed rgba(246,242,234,${0.6 + 0.4 * next})`, boxShadow: next > 0 ? `0 0 ${30 * next}px rgba(143,227,192,${next})` : undefined, background: next > 0 ? `rgba(143,227,192,${0.25 * next})` : undefined }} />
                  {fill > 0 ? (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background: brand.colors.cream,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `scale(${fill})`,
                        boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
                      }}
                    >
                      <BusinessIcon size={d * 0.57} color={brand.colors.green} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        {/* campos */}
        <div style={{ position: "absolute", left: 30, right: 30, top: 388, display: "flex", justifyContent: "space-between" }}>
          {[
            ["PREMIO", card.reward],
            ["CLIENTE", card.customer],
          ].map(([kk, v]) => (
            <div key={kk}>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: tracking.caps, opacity: 0.6 }}>{kk}</div>
              <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: tracking.body }}>{v}</div>
            </div>
          ))}
        </div>
        {showQr ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: 486, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ padding: 14, background: "#FFFFFF", borderRadius: 18 }}>
              <QrCode size={230} color={brand.colors.ink} background="#FFFFFF" quiet={1} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, opacity: 0.6 }}>Muestra este código en caja</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** Versión mini de una tarjeta (escena de varias tarjetas). */
export const MiniCard: React.FC<{ name: string; color: string; icon: "beer" | "coffee" | "scissors" | "star"; stamps: number; total: number; width?: number }> = ({ name, color, icon, stamps, total, width = 440 }) => {
  const k = width / 440;
  const d = Math.min(46, 360 / total - 8);
  return (
    <div style={{ width, height: 270 * k, borderRadius: 26 * k, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.55)" }}>
      <div style={{ width: 440, height: 270, transform: `scale(${k})`, transformOrigin: "0 0", background: `linear-gradient(150deg, ${color}, rgba(0,0,0,0.35) 140%), ${color}`, fontFamily: font, color: "#fff", position: "relative" }}>
        <div style={{ position: "absolute", left: 24, top: 22, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BusinessIcon size={28} color="#fff" icon={icon} />
          </div>
          <span style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 30 }}>{name}</span>
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, top: 104, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: d, height: d, borderRadius: "50%", ...(i < stamps ? { background: "rgba(255,255,255,0.92)" } : { border: "2.5px dashed rgba(255,255,255,0.5)" }) }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 24, bottom: 20, fontSize: 15, fontWeight: 800, letterSpacing: tracking.caps, opacity: 0.75 }}>
          SELLOS {stamps}/{total}
        </div>
        <div style={{ position: "absolute", right: 22, bottom: 16, width: 64, height: 64, borderRadius: 10, background: "rgba(255,255,255,0.92)", padding: 6 }}>
          <QrCode size={52} color="#111" background="rgba(0,0,0,0)" quiet={0} />
        </div>
      </div>
    </div>
  );
};
