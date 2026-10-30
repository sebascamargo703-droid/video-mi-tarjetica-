import React from "react";
import { AbsoluteFill } from "remotion";
import { brand } from "./brand";
import { font } from "./fonts";
import { Logo } from "./components/Logo";
import { PaperWasher } from "./CamiloVuelve";
import { GlossFloor } from "./three/Devices";
import { Stage } from "./three/Stage";

/**
 * Portada del reel (1080×1920): la lavadora 3D con la tarjeta de papel adentro. Lo importante cae en la
 * franja central 1080×1350 (y 285–1635) que muestra la cuadrícula del perfil.
 */
const C = brand.colors;

const Mark: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", background: C.highlight, color: C.ink, padding: "0.1em 0.16em 0.02em", borderRadius: "0.1em", textShadow: "none", boxShadow: "0 18px 60px rgba(143,227,192,0.35)" }}>{children}</span>
);

export const Portada: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 760px 900px at 540px 1000px, rgba(22,112,93,0.45) 0%, rgba(8,58,48,0.2) 45%, transparent 75%)" }} />
    <Stage cam={{ pos: [0.9, 0.5, 7.4], target: [0, -0.1, 0], fov: 35 }} env={1} exposure={1.05}>
      <GlossFloor y={-1.15} />
      <PaperWasher spin={0.5} shake={0} />
    </Stage>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,8,11,0.9) 0%, rgba(5,8,11,0.6) 22%, rgba(5,8,11,0) 34%, rgba(5,8,11,0) 64%, rgba(5,8,11,0.7) 72%, rgba(5,8,11,0.9) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 310, display: "flex", justifyContent: "center" }}>
      <Logo height={70} color={C.white} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.white, letterSpacing: "-0.04em", lineHeight: 1.02, textShadow: "0 10px 40px rgba(0,0,0,0.7)" }}>
      <div style={{ fontSize: 80 }}>Le faltaba</div>
      <div style={{ fontSize: 138, marginTop: 10 }}>
        <Mark>UN SELLO…</Mark>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1350, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.white, letterSpacing: "-0.04em", lineHeight: 1.02, textShadow: "0 10px 40px rgba(0,0,0,0.7)" }}>
      <div style={{ fontSize: 76 }}>…y terminó en la</div>
      <div style={{ fontSize: 130, marginTop: 6 }}>lavadora.</div>
    </div>
  </AbsoluteFill>
);
