import React from "react";
import { AbsoluteFill } from "remotion";
import { brand } from "./brand";
import { font, logoFont, tracking } from "./fonts";
import { Logo } from "./components/Logo";
import { Notification } from "./components/Notification";
import { Storefront, SIDEWALK_Y, Walker } from "./components/Storefront";

/**
 * Portada del reel (1080×1920). Todo lo importante va en la franja central 1080×1350
 * (y 285–1635), que es lo que se ve en la cuadrícula del perfil.
 */
export const Portada: React.FC = () => (
  <AbsoluteFill style={{ background: brand.colors.bg, overflow: "hidden" }}>
    {/* fachada del café, desenfocada como fondo */}
    <AbsoluteFill style={{ transform: "scale(1.25)", transformOrigin: "540px 1500px", filter: "blur(10px) brightness(0.55) saturate(1.1)" }}>
      <div style={{ position: "absolute", left: 0, top: 820 }}>
        <Storefront />
      </div>
    </AbsoluteFill>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 900px 700px at 540px 760px, rgba(105,211,190,0.20), transparent 70%),
          linear-gradient(180deg, ${brand.colors.bg} 0%, rgba(6,18,14,0.75) 30%, rgba(6,18,14,0.35) 60%, rgba(6,18,14,0.85) 100%)`,
      }}
    />
    {/* persona con el celular, pasando por el frente */}
    <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 30px rgba(0,0,0,0.6))" }}>
      <Walker x={850} y={820 + SIDEWALK_Y + 40} height={430} phase={0.9} />
    </div>

    {/* la notificación */}
    <div style={{ position: "absolute", left: 90, top: 330, transform: "rotate(-3deg)", filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.55))" }}>
      <div style={{ position: "absolute", inset: -24, borderRadius: 60, background: "radial-gradient(closest-side, rgba(143,227,192,0.35), transparent)", filter: "blur(10px)" }} />
      <Notification width={900} />
      <div style={{ position: "absolute", right: -18, top: -30, padding: "10px 22px", borderRadius: 999, background: brand.colors.highlight, color: brand.colors.ink, fontFamily: font, fontWeight: 800, fontSize: 30, transform: "rotate(6deg)", boxShadow: "0 10px 24px rgba(0,0,0,0.35)" }}>
        📍 a media cuadra
      </div>
    </div>

    {/* titular */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: font, color: brand.colors.white, textShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
      <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: tracking.headline, lineHeight: 1.1, textAlign: "center" }}>
        ¿Te llegó esto solo por
        <br />
        pasar por el <span style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, color: brand.colors.mint, fontSize: "1.12em" }}>frente?</span>
      </div>
      <div style={{ marginTop: 34, fontSize: 196, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.92, textAlign: "center" }}>¿ESTO ES</div>
      <div
        style={{
          marginTop: 18,
          fontSize: 210,
          fontWeight: 800,
          letterSpacing: "-0.045em",
          lineHeight: 1,
          color: brand.colors.ink,
          background: brand.colors.highlight,
          padding: "0 34px 6px",
          borderRadius: 28,
          transform: "rotate(-2deg)",
          textShadow: "none",
          boxShadow: "0 24px 70px rgba(143,227,192,0.35)",
        }}
      >
        LEGAL?
      </div>
    </div>

    {/* marca */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1470, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "18px 34px", borderRadius: 999, background: "rgba(6,18,14,0.7)", border: "2px solid rgba(255,255,255,0.12)" }}>
        <Logo height={96} color={brand.colors.white} />
      </div>
    </div>
  </AbsoluteFill>
);
