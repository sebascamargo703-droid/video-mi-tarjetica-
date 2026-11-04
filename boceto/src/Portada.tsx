import React from "react";
import { AbsoluteFill } from "remotion";
import { brand } from "./brand";
import { font, handFont } from "./fonts";
import { Logo } from "./components/Logo";
import { camAt, PanelContent } from "./Boceto";

/**
 * Portada (1080×1920) en verde de marca: logo arriba, titular partido arriba/abajo y los dos paneles
 * (boceto y 3D) en la escena de la calle. Lo importante cae en la franja central 1080×1350 (y 285–1635).
 */
const C = brand.colors;
const t = 9.7;
const Mark: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", background: C.highlight, color: C.ink, padding: "0.1em 0.16em 0.02em", borderRadius: "0.1em", textShadow: "none", boxShadow: "0 18px 60px rgba(143,227,192,0.35)" }}>{children}</span>
);

export const Portada: React.FC = () => {
  const cam = camAt(t);
  const head: React.CSSProperties = { position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.white, letterSpacing: "-0.04em", lineHeight: 1.02, textShadow: "0 10px 40px rgba(0,0,0,0.5)" };
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1100px at 540px 960px, #1B7A5E 0%, ${C.green} 45%, #062A22 100%)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
        <Logo height={66} color={C.white} />
      </div>
      <div style={{ ...head, top: 392 }}>
        <div style={{ fontSize: 78 }}>Pasó cerca del café…</div>
      </div>
      {/* boceto */}
      <div style={{ position: "absolute", left: 92, top: 690, width: 300, height: 533, borderRadius: 8, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.45)", transform: "rotate(-4deg)" }}>
        <PanelContent t={t} cam={cam} sketch w={300} h={533} />
      </div>
      <div style={{ position: "absolute", left: 92, width: 300, top: 1235, textAlign: "center", fontFamily: handFont, fontWeight: 700, fontSize: 52, color: C.highlight, transform: "rotate(-4deg)" }}>boceto ✏️</div>
      {/* 3D */}
      <div style={{ position: "absolute", left: 430, top: 560, width: 470, height: 835, borderRadius: 10, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.55)" }}>
        <PanelContent t={t} cam={cam} sketch={false} w={470} h={835} />
      </div>
      <div style={{ ...head, top: 1438 }}>
        <div style={{ fontSize: 60 }}>y la flecha lo trajo</div>
        <div style={{ fontSize: 112, marginTop: 6 }}>
          <Mark>DE VUELTA</Mark>
        </div>
      </div>
    </AbsoluteFill>
  );
};
