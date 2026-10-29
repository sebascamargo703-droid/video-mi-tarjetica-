import React from "react";
import { AbsoluteFill } from "remotion";
import { brand } from "./brand";
import { font } from "./fonts";
import { Logo } from "./components/Logo";
import { Dog3D } from "./three/Dog";
import { ShadowFloor } from "./three/Objects";
import { Stage } from "./three/Stage";

/**
 * Portada del reel (1080×1920): Rocky en 3D con la lengua afuera. Lo importante cae en la franja
 * central 1080×1350 (y 285–1635) que muestra la cuadrícula del perfil.
 */
const C = brand.colors;
const Mark: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", background: C.greenMid, color: "#fff", padding: "0.1em 0.16em 0.02em", borderRadius: "0.1em", boxShadow: "0 18px 50px rgba(22,112,93,0.35)" }}>{children}</span>
);

export const Portada: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse 900px 1150px at 540px 1000px, #FBFEFC 0%, #E6F5EE 50%, #BFE6D6 100%)" }}>
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 40 + ((i * 311) % 960), top: (i * 523) % 1900, fontSize: 70 + (i % 3) * 20, opacity: 0.08, transform: `rotate(${i * 37}deg)` }}>
        🐾
      </div>
    ))}
    <Stage cam={{ pos: [0.35, 1.0, 5.4], target: [0, 0.62, 0], fov: 35 }} env={1} exposure={1.05}>
      <ShadowFloor opacity={0.22} />
      <Dog3D position={[0, 0, 0]} t={1.3} happy={1} wag={1} tilt={0.18} yaw={0.1} bow={1} />
    </Stage>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
      <Logo height={66} color={C.ink} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1.02 }}>
      <div style={{ fontSize: 84 }}>Este cliente</div>
      <div style={{ fontSize: 84 }}>no habla…</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1.02 }}>
      <div style={{ fontSize: 70 }}>pero sí puede</div>
      <div style={{ fontSize: 130, marginTop: 8 }}>
        <Mark>VOLVER</Mark>
      </div>
    </div>
  </AbsoluteFill>
);
