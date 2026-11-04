import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { font } from "./fonts";
import { Logo } from "./components/Logo";
import { DarkBg, Motes, PaperWasher, usePaper } from "./CamiloVuelve";
import { Disc3D, GlossFloor, Phone3D, type Layer } from "./three/Devices";
import { Glow } from "./three/Props";
import { Stage } from "./three/Stage";
import type { V3 } from "./three/camera";
import { EASE_IN, EASE_INOUT, clamp, ease } from "./motion";
import { Headline } from "./ui";

/**
 * Historia de Instagram (1080×1920, 15 s, sin voz: música + efectos).
 * Lavadora 3D con la tarjeta de papel → la tarjeta pasa al celular → "Empieza gratis" → "Respóndenos TARJETICA".
 * Zonas libres: arriba 0–250 (nombre de la cuenta) y abajo 1640–1920 (barra de respuesta).
 */
export const HISTORIA_SEC = 15;
const C = brand.colors;
const A = { from: 0, to: 4.3 };
const B = { from: 4.3, to: 9.4 };
const K = { from: 9.4, to: HISTORIA_SEC };

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps, s: (x: number) => Math.round(x * fps) };
};
const sp = (frame: number, fps: number, at: number, damping = 15, stiffness = 150) => (frame >= at ? spring({ frame: frame - at, fps, config: { damping, stiffness } }) : 0);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

const Seg: React.FC<{ r: { from: number; to: number }; children: React.ReactNode }> = ({ r, children }) => {
  const { frame, s } = useT();
  const a = s(r.from);
  if (frame < a || frame > s(r.to) + 7) return null;
  const tin = a === 0 ? 1 : ease(frame, a, 8);
  return <AbsoluteFill style={{ opacity: tin, transform: `scale(${1.04 - 0.04 * tin})`, filter: tin < 1 ? `blur(${(1 - tin) * 10}px)` : undefined }}>{children}</AbsoluteFill>;
};

const Chip: React.FC<{ text: string; at: number; tone: "bad" | "good"; y: number; x?: number }> = ({ text, at, tone, y, x = 0 }) => {
  const { frame, fps } = useT();
  const p = sp(frame, fps, at, 13, 170);
  if (p <= 0) return null;
  const bad = tone === "bad";
  return (
    <div style={{ position: "absolute", left: x, width: 960, top: y, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 30px", borderRadius: 999, background: bad ? "rgba(255,90,82,0.14)" : "rgba(143,227,192,0.13)", border: `2px solid ${bad ? C.red : C.highlight}`, fontFamily: font, fontSize: bad ? 36 : 40, fontWeight: 800, color: C.white, whiteSpace: "nowrap", backdropFilter: "blur(10px)" }}>
        <span style={{ color: bad ? C.red : C.highlight }}>{bad ? "✕" : "✓"}</span>
        {text}
      </div>
    </div>
  );
};

/* 1 · ¿Todavía tarjeta de papel? */
const WasherPart: React.FC = () => {
  const { t, frame, s } = useT();
  const fastAt = 2.9;
  const fast = Math.max(0, t - fastAt);
  const k = EASE_INOUT(Math.min(1, t / A.to));
  const cam = { pos: lerp3([1.4, 1.0, 10.2], [0.4, 0.35, 8.6], k), target: [0, 0.17, 0] as V3, fov: 35 };
  return (
    <Seg r={A}>
      <DarkBg glow={0.8} y={1050} />
      <Stage cam={cam} env={1} exposure={1.05}>
        <GlossFloor y={-1.15} />
        <PaperWasher spin={t * 0.9 + fast * fast * 5} shake={ease(frame, s(fastAt), 10)} />
        <Motes seed="hw" n={20} spread={[6, 6, 4]} />
      </Stage>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,8,11,0.85) 0%, rgba(5,8,11,0.35) 25%, rgba(5,8,11,0) 36%, rgba(5,8,11,0) 62%, rgba(5,8,11,0.75) 76%)" }} />
      <Chip text="Se pierde" at={s(1.5)} tone="bad" y={1350} x={-290} />
      <Chip text="Se moja" at={s(2.0)} tone="bad" y={1350} x={0} />
      <Chip text="Se olvida" at={s(2.5)} tone="bad" y={1350} x={290} />
    </Seg>
  );
};

/* 2 · Pásala al celular */
const FlyingPaper: React.FC<{ fly: number; t: number; o: number }> = ({ fly, t, o }) => {
  const paper = usePaper();
  if (!paper) return null;
  return (
    <mesh position={lerp3([-1.5, 1.4, 0.8], [0, 0.5, 0.12], fly)} rotation={[0.3 * (1 - fly), 0.6 * (1 - fly), -0.4 + 0.4 * fly + (1 - fly) * t]} scale={1 - 0.55 * fly}>
      <boxGeometry args={[0.9, 0.56, 0.01]} />
      <meshStandardMaterial map={paper} roughness={0.6} transparent opacity={o} />
    </mesh>
  );
};

const PhonePart: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const ph = sp(frame, fps, s(B.from + 0.05), 16, 90);
  const flyAt = s(B.from + 0.35);
  const fly = ease(frame, flyAt, 18, EASE_INOUT);
  const arrived = flyAt + 18;
  const stampAt = s(7.0);
  const flash = interpolate(frame, [arrived - 2, arrived + 2, arrived + 14], [0, 1, 0], clamp) + interpolate(frame, [stampAt, stampAt + 3, stampAt + 16], [0, 0.8, 0], clamp);
  const screens: Layer[] = [
    ["screens/w-s0.png", 1],
    ["screens/w-s3.png", interpolate(frame, [arrived, arrived + 5], [0, 1], clamp)],
    ["screens/w-s4-banner.png", interpolate(frame, [stampAt, stampAt + 5], [0, 1], clamp)],
  ];
  return (
    <Seg r={B}>
      <DarkBg y={900} glow={1 + 0.4 * flash} />
      <Stage cam={{ pos: [0.35 + Math.sin(t * 0.4) * 0.2, 0.25, 5.8], target: [0, 0.35, 0], fov: 35 }} env={1} exposure={1.1}>
        <Phone3D
          position={[2.6 * (1 - ph), 0.42, 0]}
          rotation={[0.05, -Math.PI * 1.1 * (1 - ph) - 0.22 + Math.sin(t * 0.9) * 0.06, 0.03 * (1 - ph)]}
          scale={0.85}
          screens={screens.filter(([, o], i, arr) => o > 0 && !arr.slice(i + 1).some(([, o2]) => o2 >= 1))}
          brightness={1 + 0.35 * Math.min(1, flash)}
          glow={Math.min(1, flash)}
        />
        {frame >= flyAt - 12 && fly < 1 ? <FlyingPaper fly={fly} t={t} o={Math.min(1, (frame - flyAt + 12) / 6) * (1 - ease(frame, arrived - 5, 5))} /> : null}
        <Motes seed="hp" n={24} />
      </Stage>
      <Chip text="Sin descargar apps" at={s(5.9)} tone="good" y={1280} />
      <Chip text="El sello llega solo" at={s(6.5)} tone="good" y={1380} />
      <Chip text="Aviso cuando pasa cerca" at={s(7.6)} tone="good" y={1480} />
    </Seg>
  );
};

/* 3 · Empieza gratis + Respóndenos TARJETICA */
const CtaPart: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const coin = sp(frame, fps, s(K.from + 0.05), 12, 120);
  const askAt = s(11.4);
  const coinOut = ease(frame, askAt - 6, 12, EASE_IN);
  const word = sp(frame, fps, askAt + 6, 11, 170);
  const sub = ease(frame, askAt + 14, 10);
  const bob = Math.sin(t * 5) * 10;
  return (
    <Seg r={K}>
      <DarkBg glow={1.3} y={900} />
      <Stage cam={{ pos: [0, 0.2, 6], target: [0, 0.15, 0], fov: 35 }} env={1.1} exposure={1.1}>
        <group position={[0, 0.25 + coinOut * 2.2, -coinOut * 1.5]} scale={coin * (1 - coinOut)} rotation={[0.15, (1 - coin) * 4 + Math.sin(t * 1.4) * 0.5, 0]}>
          <Disc3D src="screens/gratis.png" r={0.55} t={0.1} edge="#8FE3C0" metal={false} emissive={0.1} />
          <Glow position={[0, 0, -0.3]} size={3.2} color="#16705D" opacity={0.6 * (1 - coinOut)} />
        </group>
        <Motes seed="hk" n={30} />
      </Stage>
      {coinOut < 1 ? (
        <div style={{ position: "absolute", left: 0, width: 960, top: 1240, textAlign: "center", fontFamily: font, color: C.white, opacity: ease(frame, s(K.from + 0.4), 10) * (1 - coinOut) }}>
          <div style={{ fontSize: 46, fontWeight: 800 }}>Hasta 20 clientes</div>
          <div style={{ fontSize: 36, fontWeight: 600, color: C.soft, marginTop: 8 }}>Sin tarjeta de crédito</div>
        </div>
      ) : null}
      {frame >= askAt ? (
        <div style={{ position: "absolute", left: 0, width: 960, top: 720, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.white, letterSpacing: "-0.04em" }}>
          <div style={{ fontSize: 92, opacity: ease(frame, askAt, 8), textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>Respóndenos</div>
          <div style={{ display: "inline-block", marginTop: 16, transform: `scale(${word})` }}>
            <span style={{ fontSize: 132, background: C.highlight, color: C.ink, padding: "0.04em 0.18em 0", borderRadius: "0.12em", boxShadow: "0 20px 60px rgba(143,227,192,0.4)" }}>TARJETICA</span>
          </div>
          <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.01em", marginTop: 34, opacity: sub, color: C.soft }}>y te mandamos el link 💬</div>
          <div style={{ fontSize: 130, color: C.highlight, marginTop: 120, opacity: sub, transform: `translateY(${bob}px)` }}>↓</div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, width: 960, top: 420, display: "flex", justifyContent: "center", opacity: ease(frame, askAt + 20, 12) }}>
        <Logo height={78} color={C.white} />
      </div>
    </Seg>
  );
};

const HEAD: [string, number, number, number][] = [
  // texto, entra (s), sale (s), tamaño
  ["¿TUS CLIENTES\nTODAVÍA USAN\n[TARJETA DE PAPEL?]", 0.15, A.to - 0.15, 92],
  ["PÁSALA A SU\n[CELULAR]", B.from + 0.15, B.to - 0.15, 112],
  ["EMPIEZA\n[GRATIS]", K.from + 0.1, 11.2, 116],
];

const Sfx: React.FC<{ at: number; file: string; vol: number }> = ({ at, file, vol }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at * fps))} layout="none">
      <Html5Audio src={staticFile(`sfx/${file}.mp3`)} volume={vol} />
    </Sequence>
  );
};
const SFX_H: [number, string, number][] = [
  [1.5, "pop", 0.35],
  [2.0, "pop", 0.35],
  [2.5, "pop", 0.35],
  [B.from - 0.3, "whoosh-soft", 0.35],
  [B.from + 0.95, "ring-pulse", 0.3],
  [5.9, "pop", 0.3],
  [6.5, "pop", 0.3],
  [7.0, "notification", 0.45],
  [7.6, "pop", 0.3],
  [K.from - 0.3, "whoosh-soft", 0.35],
  [K.from + 0.1, "ring-pulse", 0.3],
  [11.6, "pop", 0.4],
];

export const Historia: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = (x: number) => Math.round(x * fps);
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <WasherPart />
      <PhonePart />
      <CtaPart />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 60%, rgba(0,0,0,0.4) 100%)", pointerEvents: "none" }} />
      {HEAD.map(([text, a, b, size]) => (
        <Headline key={text} text={text} at={s(a)} exitAt={s(b)} size={size} top={290} />
      ))}
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("grain.png")})`, backgroundPosition: `${(frame * 137) % 512}px ${(frame * 251) % 512}px`, opacity: 0.06, mixBlendMode: "overlay", pointerEvents: "none" }} />
      <Html5Audio src={staticFile("historia-music.mp3")} volume={(f) => 0.55 * Math.min(1, f / fps / 0.3) * Math.min(1, (HISTORIA_SEC - f / fps) / 1.2)} />
      {SFX_H.map(([at, f, v], i) => (
        <Sfx key={i} at={at} file={f} vol={v} />
      ))}
    </AbsoluteFill>
  );
};

