import React from "react";
import { AbsoluteFill } from "remotion";
import { brand } from "./brand";
import { font } from "./fonts";
import { Logo } from "./components/Logo";
import { Dog3D } from "./three/Dog";
import { ShadowFloor } from "./three/Objects";
import { Stage } from "./three/Stage";

/**
 * Portada del reel (1080×1920), en verde de marca como las demás: logo arriba, titular partido
 * arriba/abajo y Rocky 3D en el centro. Lo importante cae en la franja central 1080×1350
 * (y 285–1635) que muestra la cuadrícula del perfil.
 */
const C = brand.colors;
const Mark: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", background: C.highlight, color: C.ink, padding: "0.1em 0.16em 0.02em", borderRadius: "0.1em", textShadow: "none", boxShadow: "0 18px 60px rgba(143,227,192,0.35)" }}>{children}</span>
);

export const Portada: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1100px at 540px 960px, #1B7A5E 0%, ${C.green} 45%, #062A22 100%)` }}>
    {/* rayos suaves detrás de Rocky */}
    <AbsoluteFill
      style={{
        background: "repeating-conic-gradient(from 0deg at 540px 1000px, rgba(143,227,192,0.09) 0deg 5deg, transparent 5deg 15deg)",
        maskImage: "radial-gradient(circle at 540px 1000px, black 0%, transparent 58%)",
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 540px 980px, rgba(143,227,192,0.28), transparent 32%)" }} />
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 40 + ((i * 311) % 960), top: (i * 523) % 1900, fontSize: 70 + (i % 3) * 20, opacity: 0.1, filter: "grayscale(1) brightness(3)", transform: `rotate(${i * 37}deg)` }}>
        🐾
      </div>
    ))}
    <Stage cam={{ pos: [0.35, 1.0, 5.4], target: [0, 0.62, 0], fov: 35 }} env={1} exposure={1.1}>
      <ShadowFloor opacity={0.35} />
      <Dog3D position={[0, 0, 0]} t={1.3} happy={1} wag={1} tilt={0.18} yaw={0.1} bow={1} />
      <pointLight position={[0, 2.2, -1.5]} intensity={6} distance={6} color="#8FE3C0" />
    </Stage>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
      <Logo height={66} color={C.white} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.white, letterSpacing: "-0.04em", lineHeight: 1.02, textShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 84 }}>Este cliente</div>
      <div style={{ fontSize: 84 }}>no habla…</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1400, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.white, letterSpacing: "-0.04em", lineHeight: 1.02, textShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 70 }}>pero sí puede</div>
      <div style={{ fontSize: 130, marginTop: 8 }}>
        <Mark>VOLVER</Mark>
      </div>
    </div>
  </AbsoluteFill>
);
