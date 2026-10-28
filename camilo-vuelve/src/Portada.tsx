import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { brand } from "./brand";
import { font } from "./fonts";
import { Logo } from "./components/Logo";

/**
 * Portada del reel (1080×1920): la tarjeta de papel en la lavadora. Lo importante cae en la
 * franja central 1080×1350 (y 285–1635) que muestra la cuadrícula del perfil.
 */
const C = brand.colors;
const k = 1920 / 1152;
const cx = 1010;

const Mark: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", background: C.highlight, color: C.ink, padding: "0.1em 0.16em 0.02em", borderRadius: "0.1em", textShadow: "none", boxShadow: "0 18px 60px rgba(143,227,192,0.35)" }}>{children}</span>
);

export const Portada: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
    <img src={staticFile("fotos/lavadora.jpg")} style={{ position: "absolute", height: 1920, width: 2048 * k, left: 540 - cx * k, top: 0, transform: "scale(1.12)", transformOrigin: `${cx * k}px 980px` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,8,11,0.95) 0%, rgba(5,8,11,0.75) 25%, rgba(5,8,11,0.1) 38%, rgba(5,8,11,0) 58%, rgba(5,8,11,0.75) 70%, rgba(5,8,11,0.92) 100%)" }} />
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
