import React from "react";
import { AbsoluteFill } from "remotion";
import { brand } from "./brand";
import { font } from "./fonts";
import { Logo } from "./components/Logo";
import { PHONE_H, PHONE_W, Phone3D, roundedPlane } from "./three/Devices";
import { Desk, Tarjetico } from "./three/Office";
import { Stage } from "./three/Stage";

/**
 * Portada del TikTok (1080×1920) en verde de marca: logo arriba, titular partido arriba/abajo y,
 * en el centro, un celular acostado con la oficina de Tarjeticos encima. Lo importante cae en la
 * franja central 1080×1350 (y 285–1635) que muestra la cuadrícula del perfil.
 */
const C = brand.colors;
const Mark: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", background: C.highlight, color: C.ink, padding: "0.1em 0.16em 0.02em", borderRadius: "0.1em", textShadow: "none", boxShadow: "0 18px 60px rgba(143,227,192,0.35)" }}>{children}</span>
);
const Y = 0.13; // superficie de la pantalla del celular
const S = 3.2;
const SCREEN_GEO = roundedPlane(PHONE_W * (665 / 720) * S, PHONE_H * (1428 / 1483) * S, 0.098 * S);

export const Portada: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1100px at 540px 960px, #1B7A5E 0%, ${C.green} 45%, #062A22 100%)` }}>
    <AbsoluteFill
      style={{
        background: "repeating-conic-gradient(from 0deg at 540px 980px, rgba(143,227,192,0.09) 0deg 5deg, transparent 5deg 15deg)",
        maskImage: "radial-gradient(circle at 540px 980px, black 0%, transparent 58%)",
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 540px 980px, rgba(143,227,192,0.26), transparent 34%)" }} />
    <Stage cam={{ pos: [0, 8.3, 13.6], target: [0, 0.42, 0.15], fov: 35 }} env={1} exposure={1.1}>
      <Phone3D position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={S} screens={[]} />
      {/* pantalla encendida: piso verde de la oficina */}
      <mesh geometry={SCREEN_GEO} position={[0, Y + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={10}>
        <meshBasicMaterial color="#17584A" toneMapped={false} />
      </mesh>
      <Desk position={[0, Y, -1.0]} screens={[["m-sellos-b", 1]]} glow={1} />
      <Tarjetico position={[-0.95, Y, -0.55]} rotation={[0, 0.45, 0]} scale={0.86} color="#69D3BE" tool="stamp" t={0.6} act={1} happy={1} />
      <Tarjetico position={[0.95, Y, -0.55]} rotation={[0, -0.45, 0]} scale={0.86} color="#8FE3C0" tool="party" t={1.4} act={1} happy={1} />
      <Tarjetico position={[-0.5, Y, 1.0]} rotation={[0, 0.25, 0]} scale={0.8} color="#A7E8D5" tool="binoculars" t={2.1} act={1} happy={1} />
      <Tarjetico position={[0.52, Y, 1.05]} rotation={[0, -0.25, 0]} scale={0.8} color="#69D3BE" tool="headset" t={2.9} act={0.5} happy={1} />
      <pointLight position={[0, 2.6, 1.5]} intensity={8} distance={8} color="#FFF4E0" />
      <pointLight position={[0, 1.6, -1.2]} intensity={4} distance={5} color="#8FE3C0" />
    </Stage>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
      <Logo height={66} color={C.white} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.white, letterSpacing: "-0.04em", lineHeight: 1.02, textShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 80 }}>Le pedí ayuda</div>
      <div style={{ fontSize: 80 }}>con mi negocio…</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1335, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.white, letterSpacing: "-0.04em", lineHeight: 1.02, textShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 66 }}>y me montó una</div>
      <div style={{ fontSize: 124, marginTop: 8 }}>
        <Mark>OFICINA</Mark>
      </div>
      <div style={{ fontSize: 58, marginTop: 14 }}>dentro del celular</div>
    </div>
  </AbsoluteFill>
);
