import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, VIDEO } from "./constants";
import { FONT } from "./fonts";
import { andresAt, doorAt, fogAt, interiorAt, lampAt, type Cam } from "./story";
import { Stage } from "./three/Stage";
import { LogoMark } from "./ui/LogoMark";

/**
 * Portada del reel (1080×1920) en verde de marca: logo arriba, titular partido
 * arriba/abajo y, al centro, la silla vacía bajo la luz. Lo importante cae en
 * la franja central 1080×1350 (y 285–1635) que muestra la cuadrícula del perfil.
 * Render:  npx remotion still Portada out/portada.png
 */
const T = 3.4; // momento del gancho que se usa como foto
const PANEL = { w: 700, h: 800 };
const SCALE = PANEL.w / VIDEO.width;
/** Cámara propia de la portada: silla completa con el cono de luz. */
const CAM: Cam = { pos: [0.55, 1.45, -0.45], target: [-0.7, 1.02, -3.2], fov: 56 };

export const Portada: React.FC = () => {
  const head: React.CSSProperties = { position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: FONT.text, fontWeight: 800, color: COLORS.white, letterSpacing: "-0.04em", lineHeight: 1.02, textShadow: "0 10px 40px rgba(0,0,0,0.5)" };
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1100px at 540px 960px, #1B7A5E 0%, ${COLORS.brandGreen} 45%, #062A22 100%)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        <LogoMark height={40} color={COLORS.white} />
        <div style={{ fontFamily: FONT.brand, fontWeight: 700, fontSize: 56, color: COLORS.white }}>Mi Tarjetica</div>
      </div>
      <div style={{ ...head, top: 392, fontSize: 80 }}>Esta silla era de Andrés…</div>
      {/* foto 3D del gancho */}
      <div style={{ position: "absolute", left: (VIDEO.width - PANEL.w) / 2, top: 520, width: PANEL.w, height: PANEL.h, borderRadius: 44, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.55), 0 0 0 6px rgba(143,227,192,0.35)" }}>
        <div style={{ position: "absolute", left: 0, top: (PANEL.h - VIDEO.height * SCALE) / 2, width: VIDEO.width, height: VIDEO.height, transform: `scale(${SCALE})`, transformOrigin: "0 0" }}>
          <Stage T={T} cam={CAM} andres={andresAt(T)} lamp={lampAt(T)} interior={interiorAt(T)} door={doorAt(T)} fog={fogAt(T)} />
        </div>
      </div>
      <div style={{ ...head, top: 1362 }}>
        <div style={{ fontSize: 64 }}>hasta que le llegó el aviso</div>
        <div style={{ fontSize: 118, marginTop: 10 }}>
          <span style={{ display: "inline-block", background: COLORS.brandMint, color: "#06231B", padding: "0.1em 0.18em 0.02em", borderRadius: "0.1em", textShadow: "none", boxShadow: "0 18px 60px rgba(143,227,192,0.35)" }}>Y VOLVIÓ</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
