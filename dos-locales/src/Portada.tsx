import React from "react";
import { AbsoluteFill } from "remotion";
import { brand } from "./brand";
import { font } from "./fonts";
import { Logo } from "./components/Logo";
import { City } from "./three/City";
import { Stage } from "./three/Stage";
import type { Cam } from "./three/camera";

/**
 * Portada del reel (1080×1920). Fondo: la calle 3D con Origen lleno arriba y La Esquina abajo.
 * El titular se parte en dos, junto a cada café. Lo importante cae en la franja central
 * 1080×1350 (y 285–1635) que muestra la cuadrícula del perfil.
 */
const CAM: Cam = { pos: [3, 40, 30], target: [0, 0, -6], fov: 34 };

const Mark: React.FC<{ children: React.ReactNode; bg: string; fg: string; glow: string }> = ({ children, bg, fg, glow }) => (
  <span style={{ display: "inline-block", background: bg, color: fg, padding: "0.1em 0.16em 0.02em", borderRadius: "0.1em", textShadow: "none", boxShadow: `0 18px 60px ${glow}` }}>{children}</span>
);

export const Portada: React.FC = () => (
  <AbsoluteFill style={{ background: brand.colors.bg }}>
    <Stage cam={CAM}>
      <City valentina={{ pos: [0, 0, 0], rot: 0, visible: false }} />
    </Stage>
    {/* oscurece arriba y en la calle para que el texto respire */}
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, rgba(5,8,11,0.92) 0%, rgba(5,8,11,0.55) 30%, rgba(5,8,11,0) 40%, rgba(5,8,11,0) 49%, rgba(5,8,11,0.7) 58%, rgba(5,8,11,0.7) 74%, rgba(5,8,11,0.15) 82%, rgba(5,8,11,0.55) 100%)`,
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />

    {/* logo */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
      <Logo height={84} color={brand.colors.white} />
    </div>

    {/* parte 1, sobre Origen */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 418, textAlign: "center", fontFamily: font, fontWeight: 800, color: brand.colors.white, letterSpacing: "-0.04em", lineHeight: 1.02, textShadow: "0 10px 40px rgba(0,0,0,0.7)" }}>
      <div style={{ fontSize: 76 }}>¿Por qué uno vive</div>
      <div style={{ fontSize: 150, marginTop: 10 }}>
        <Mark bg={brand.colors.highlight} fg={brand.colors.ink} glow="rgba(143,227,192,0.35)">
          LLENO
        </Mark>
      </div>
    </div>

    {/* parte 2, en la calle, sobre La Esquina */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1130, textAlign: "center", fontFamily: font, fontWeight: 800, color: brand.colors.white, letterSpacing: "-0.04em", lineHeight: 1.02, textShadow: "0 10px 40px rgba(0,0,0,0.7)" }}>
      <div style={{ fontSize: 76 }}>…y el otro</div>
      <div style={{ fontSize: 118, marginTop: 10 }}>
        <Mark bg="#2A3440" fg="#C9D3DE" glow="rgba(0,0,0,0.5)">
          CASI VACÍO?
        </Mark>
      </div>
    </div>

    {/* rótulo inferior */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1478, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: font, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: brand.colors.soft, padding: "12px 26px", borderRadius: 999, background: "rgba(5,8,11,0.65)", border: "1.5px solid rgba(167,201,189,0.35)" }}>
        MISMA CALLE · MISMOS PRECIOS
      </div>
    </div>
  </AbsoluteFill>
);
