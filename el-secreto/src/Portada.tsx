import React from "react";
import { AbsoluteFill, random } from "remotion";
import { brand } from "./brand";
import { font } from "./fonts";
import { Logo } from "./components/Logo";
import { Cup3D, ShadowFloor, Star3D } from "./three/Objects";
import { Stage } from "./three/Stage";
import type { Cam } from "./three/camera";

/**
 * Portada del reel (1080×1920). Una estrella dorada 3D delante del vaso (sin marca) que queda
 * en segundo plano. Lo importante cae en la franja central 1080×1350 (y 285–1635) que muestra
 * la cuadrícula del perfil.
 */
const C = brand.colors;
const CAM: Cam = { pos: [0, 1.6, 16], target: [0, 1.05, 0], fov: 35 };

const Mark: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", background: C.gold, color: C.forest, padding: "0.1em 0.16em 0.02em", borderRadius: "0.1em", textShadow: "none", boxShadow: "0 18px 60px rgba(232,184,74,0.35)" }}>{children}</span>
);

export const Portada: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1100px at 540px 980px, #17614A 0%, ${C.forest} 52%, #04110D 100%)` }}>
    <AbsoluteFill
      style={{
        background: "repeating-conic-gradient(from 0deg at 540px 1010px, rgba(255,230,160,0.08) 0deg 4deg, transparent 4deg 14deg)",
        maskImage: "radial-gradient(circle at 540px 1010px, black 0%, transparent 55%)",
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 540px 1010px, rgba(255,214,120,0.3), transparent 30%)", mixBlendMode: "screen" }} />
    <Stage cam={CAM} env={1.3} exposure={1.15}>
      <ShadowFloor y={-0.9} opacity={0.45} />
      <Cup3D position={[1.85, -0.9, -2.4]} rotation={[0.04, 0.5, 0]} scale={1.05} />
      <group position={[-0.35, 0.95, 0.8]} rotation={[0.28, -0.5, 0.1]} scale={1.45}>
        <Star3D emissive={0.42} />
        <pointLight position={[0.3, 0.6, 2.4]} intensity={4} distance={7} color="#FFD98A" />
      </group>
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh key={i} position={[(random(`x${i}`) - 0.5) * 10, (random(`y${i}`) - 0.5) * 10 + 1, (random(`z${i}`) - 0.5) * 4]}>
          <sphereGeometry args={[0.03 + random(`r${i}`) * 0.04, 10, 8]} />
          <meshStandardMaterial color="#FFD98A" emissive="#FFB733" emissiveIntensity={1.4} />
        </mesh>
      ))}
    </Stage>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,17,13,0.85) 0%, rgba(4,17,13,0.3) 28%, rgba(4,17,13,0) 38%, rgba(4,17,13,0) 64%, rgba(4,17,13,0.75) 76%, rgba(4,17,13,0.9) 100%)" }} />

    <div style={{ position: "absolute", left: 0, right: 0, top: 310, display: "flex", justifyContent: "center" }}>
      <Logo height={70} color={C.white} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.white, letterSpacing: "-0.04em", lineHeight: 1.02, textShadow: "0 10px 40px rgba(0,0,0,0.7)" }}>
      <div style={{ fontSize: 84 }}>El secreto de</div>
      <div style={{ fontSize: 142, marginTop: 12 }}>
        <Mark>STARBUCKS</Mark>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1335, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.white, letterSpacing: "-0.04em", lineHeight: 1, textShadow: "0 10px 40px rgba(0,0,0,0.7)" }}>
      <div style={{ fontSize: 118 }}>no es el café.</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: font, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.goldLight, padding: "12px 26px", borderRadius: 999, background: "rgba(4,17,13,0.7)", border: "1.5px solid rgba(232,184,74,0.45)" }}>
        Y TU NEGOCIO PUEDE COPIARLO
      </div>
    </div>
  </AbsoluteFill>
);
