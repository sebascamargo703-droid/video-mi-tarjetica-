import React from "react";
import { AbsoluteFill, Html5Audio, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_INOUT, clamp } from "./motion";
import { Landscape } from "./Miniatura";
import { CarStage, type Cam } from "./three";

/**
 * "Miniatura" horizontal (16:9) con el BMW del cliente, igual al video de referencia:
 * 1) el BMW a escala en el borde de la ventana de un tren, paisaje pasando;
 * 2) el BMW real andando por un túnel (fondo 3D, luces que le pasan por encima, ruedas girando);
 * 3) el BMW andando de noche por la autopista con la ciudad al fondo.
 * El carro es el recorte de la foto; el fondo 3D se dibuja con la misma perspectiva de la foto.
 */
export const H_SEC = 10;
const CUT1 = 3.9;
const CUT2 = 7.3;
const PW = 1449;
const PH = 2576;
const CAR = { x0: 135, y0: 1243, x1: 1320, y1: 1758 };
const WHEELS = [
  { cx: 804, cy: 1626, rx: 86, ry: 98 },
  { cx: 216, cy: 1536, rx: 34, ry: 67 },
];
const HEAD = { x: 979, y: 1520 };
const FOG = { x: 985, y: 1640 };

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};
const ease = (x: number) => EASE_INOUT(Math.max(0, Math.min(1, x)));

/* ------------------------------------------------------------------ */
/** El BMW recortado, con ruedas girando, barridos de luz, faros y gradación. Coordenadas: `left/top` de la foto escalada por `m`. */
const CarComp: React.FC<{ m: number; left: number; top: number; spin: number; blur: number; filter?: string; sweeps?: number[]; tint?: string; lights?: number }> = ({ m, left, top, spin, blur, filter, sweeps = [], tint, lights = 0 }) => {
  const mask = `url(${staticFile("bmw/carro.png")})`;
  const full = { position: "absolute" as const, left: 0, top: 0, width: PW * m, height: PH * m };
  return (
    <div style={{ position: "absolute", left, top, width: PW * m, height: PH * m }}>
      {/* sombra de contacto */}
      <div style={{ position: "absolute", left: (CAR.x0 - 10) * m, top: 1600 * m, width: (CAR.x1 - CAR.x0 + 20) * m, height: 200 * m, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, transparent 72%)", filter: "blur(10px)", transform: "rotate(5deg)" }} />
      <div style={{ ...full, filter }}>
        <Img src={staticFile("bmw/carro.png")} style={full} />
        {/* ruedas girando con desenfoque de movimiento */}
        {WHEELS.map((w, wi) => {
          const f = w.rx / w.ry;
          return (
            <div key={wi} style={{ ...full, clipPath: `ellipse(${w.rx * m}px ${w.ry * m}px at ${w.cx * m}px ${w.cy * m}px)` }}>
              {Array.from({ length: blur > 0 ? 6 : 1 }).map((_, i) => (
                <Img
                  key={i}
                  src={staticFile("bmw/carro.png")}
                  style={{
                    ...full,
                    transformOrigin: `${w.cx * m}px ${w.cy * m}px`,
                    transform: `scaleX(${f}) rotate(${spin + i * blur}deg) scaleX(${1 / f})`,
                    opacity: i === 0 ? 1 : 0.28,
                  }}
                />
              ))}
            </div>
          );
        })}
        {/* tinte de la escena dentro del carro */}
        {tint ? <div style={{ ...full, background: tint, mixBlendMode: "soft-light", maskImage: mask, WebkitMaskImage: mask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }} /> : null}
        {/* luces del túnel / postes que le pasan por encima (de adelante hacia atrás) */}
        {sweeps.map((k, i) =>
          k > -0.3 && k < 1.3 ? (
            <div key={i} style={{ ...full, maskImage: mask, WebkitMaskImage: mask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%", mixBlendMode: "screen" }}>
              <div style={{ position: "absolute", left: (CAR.x1 - (CAR.x1 - CAR.x0) * k) * m - 160 * m, top: (CAR.y0 - 80) * m, width: 220 * m, height: (CAR.y1 - CAR.y0 + 160) * m, background: "linear-gradient(90deg, transparent, rgba(255,236,205,0.7), transparent)", transform: "skewX(-18deg)", filter: "blur(8px)" }} />
            </div>
          ) : null,
        )}
      </div>
      {lights > 0
        ? [HEAD, FOG].map((p, i) => (
            <div key={i} style={{ position: "absolute", left: p.x * m, top: p.y * m, width: 0, height: 0, mixBlendMode: "screen" }}>
              <div style={{ position: "absolute", left: -80, top: -45, width: 160, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, rgba(200,225,255,0.55) 30%, transparent 70%)", opacity: lights * (i ? 0.7 : 1) }} />
              {i === 0 ? <div style={{ position: "absolute", left: -420, top: -3, width: 840, height: 6, background: "linear-gradient(90deg, transparent, rgba(190,220,255,0.85), transparent)", filter: "blur(2px)", opacity: lights * 0.85 }} /> : null}
            </div>
          ))
        : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 1 · Miniatura en la ventana */
const MiniPart: React.FC = () => {
  const { t } = useT();
  if (t > CUT1 + 0.1) return null;
  const dark = ease((t - (CUT1 - 0.5)) / 0.45);
  const jx = Math.sin(t * 37) * 1.2;
  const jy = Math.sin(t * 53) * 1.4 + Math.sin(t * 19) * 0.8;
  const zoom = 1 + 0.05 * ease(t / CUT1);
  const m = 640 / (CAR.x1 - CAR.x0);
  const surface = 760;
  const left = 760 - ((CAR.x0 + CAR.x1) / 2) * m;
  const top = surface - CAR.y1 * m + 8;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: -300, width: 1920, height: 1500, transform: "scale(1.0)" }}>
        <div style={{ position: "absolute", inset: 0, transform: "scaleX(1.8)", transformOrigin: "0 0" }}>
          <Landscape t={t} dark={dark} dir={-1} />
        </div>
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.07) 62%, rgba(255,255,255,0) 82%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(270deg, #0C0D0F 0%, #24272B 70%, rgba(36,39,43,0) 100%)", transform: `translateX(${2200 - 2500 * ease((t - (CUT1 - 0.75)) / 0.6)}px)`, filter: "blur(12px)" }} />
      <AbsoluteFill style={{ transform: `translate(${jx}px, ${jy}px) scale(${zoom})`, transformOrigin: "45% 70%" }}>
        <div style={{ position: "absolute", left: -80, right: -80, top: surface - 110, height: 180, background: "linear-gradient(180deg, #A9A49B 0%, #CFC9BF 18%, #E2DCD2 70%, #EDE8DF 100%)", borderTop: "5px solid #1B1D20" }} />
        <div style={{ position: "absolute", left: -80, right: -80, top: surface + 70, height: 40, background: "linear-gradient(180deg, #F4F0E8 0%, #C8C2B7 60%, #8E8980 100%)", borderRadius: "0 0 26px 26px" }} />
        <div style={{ position: "absolute", left: -80, right: -80, top: surface + 110, bottom: -80, background: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 118px, rgba(0,0,0,0.18) 118px 122px), linear-gradient(180deg, #8A8F95 0%, #6C7177 45%, #50555B 100%)" }} />
        <div style={{ position: "absolute", left: left + CAR.x0 * m - 10, top: surface - 38, width: (CAR.x1 - CAR.x0) * m + 20, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 50%, rgba(20,18,15,0.55) 0%, rgba(20,18,15,0.25) 45%, transparent 72%)", filter: "blur(6px)" }} />
        <Img src={staticFile("bmw/carro.png")} style={{ position: "absolute", left, top, width: PW * m, height: PH * m }} />
      </AbsoluteFill>
      {/* poste del marco (derecha, como en la referencia) */}
      <div style={{ position: "absolute", right: -30, top: 0, width: 130, height: 1080, background: "linear-gradient(90deg, #2A2C30, #0D0E10 60%)", boxShadow: "-20px 0 40px rgba(0,0,0,0.45)", filter: "blur(2px)" }} />
      <AbsoluteFill style={{ backdropFilter: "blur(13px)", WebkitBackdropFilter: "blur(13px)", maskImage: "linear-gradient(180deg, black 0%, transparent 38%, transparent 76%, black 100%)", WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 38%, transparent 76%, black 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: dark }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Fondo 3D con la perspectiva de la foto: la vía va hacia adelante-derecha (hacia la cámara). */
const SPEED = 24;
const YAW = -0.62; // gira la vía para que coincida con el rumbo del carro en la foto
const Road: React.FC<{ lt: number; kind: "tunnel" | "highway" }> = ({ lt, kind }) => {
  const off = (lt * SPEED) % 6;
  const tunnel = kind === "tunnel";
  return (
    <group rotation={[0, YAW, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 1]}>
        <planeGeometry args={[400, 30]} />
        <meshLambertMaterial color={tunnel ? "#5A5D63" : "#4A4D53"} />
      </mesh>
      {Array.from({ length: 60 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-120 + i * 6 - off, 0.005, -1.9]}>
          <planeGeometry args={[3, 0.14]} />
          <meshBasicMaterial color="#D9D5C9" />
        </mesh>
      ))}
      {tunnel ? (
        <>
          <mesh position={[0, 2.8, -4.4]}>
            <boxGeometry args={[400, 5.6, 0.2]} />
            <meshStandardMaterial color="#3A3D42" roughness={0.8} />
          </mesh>
          <mesh position={[0, 5.6, 3]}>
            <boxGeometry args={[400, 0.2, 16]} />
            <meshStandardMaterial color="#1B1D20" roughness={0.9} />
          </mesh>
          {Array.from({ length: 50 }).map((_, i) => {
            const x = -150 + i * 6 - off;
            return (
              <group key={i}>
                <mesh position={[x, 3.6, -4.28]}>
                  <planeGeometry args={[4.2, 0.18]} />
                  <meshBasicMaterial color="#EAF2FF" toneMapped={false} />
                </mesh>
                <mesh position={[x, 5.48, 1]} rotation={[Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[4.2, 0.24]} />
                  <meshBasicMaterial color="#FFE6BE" toneMapped={false} />
                </mesh>
              </group>
            );
          })}
          {[0, 1, 2, 3].map((i) => (
            <pointLight key={i} position={[((i * 6 - off) % 24) - 6, 5, 1]} intensity={16} distance={11} color="#FFE2B8" />
          ))}
        </>
      ) : (
        <>
          {[0.55, 0.8].map((y) => (
            <mesh key={y} position={[0, y, -6]}>
              <boxGeometry args={[400, 0.14, 0.06]} />
              <meshStandardMaterial color="#9AA1A8" metalness={0.9} roughness={0.3} />
            </mesh>
          ))}
          {Array.from({ length: 100 }).map((_, i) => (
            <mesh key={i} position={[-200 + i * 4 - (off % 4), 0.4, -6.02]}>
              <boxGeometry args={[0.08, 0.8, 0.08]} />
              <meshStandardMaterial color="#6E757C" metalness={0.8} roughness={0.4} />
            </mesh>
          ))}
          {Array.from({ length: 16 }).map((_, i) => {
            const x = -120 + i * 16 - ((lt * SPEED) % 16);
            return (
              <group key={i} position={[x, 0, -6.6]}>
                <mesh position={[0, 3.5, 0]}>
                  <cylinderGeometry args={[0.09, 0.11, 7, 12]} />
                  <meshStandardMaterial color="#3A3F45" metalness={0.7} roughness={0.4} />
                </mesh>
                <mesh position={[0, 7, 1.0]}>
                  <boxGeometry args={[0.6, 0.14, 0.34]} />
                  <meshBasicMaterial color="#FFD9A0" toneMapped={false} />
                </mesh>
              </group>
            );
          })}
          {[0, 1, 2].map((i) => (
            <pointLight key={i} position={[((i * 16 - (lt * SPEED)) % 48) + 16, 6.6, -5]} intensity={40} distance={18} color="#FFC982" />
          ))}
        </>
      )}
    </group>
  );
};

/** Barridos: posición 0–1 de cada luz pasando sobre el carro, de adelante hacia atrás. */
const sweepsAt = (lt: number, every: number, dur: number) => {
  const out: number[] = [];
  for (let k = 0; k < 3; k++) {
    const ph = (lt - k * every) % (every * 3);
    out.push(ph / dur - 0.3);
  }
  return out;
};

const DriveScene: React.FC<{ from: number; to: number; kind: "tunnel" | "highway" }> = ({ from, to, kind }) => {
  const { t } = useT();
  if (t < from - 0.05 || t > to + 0.1) return null;
  const lt = t - from;
  const tunnel = kind === "tunnel";
  const k = ease(lt / (to - from));
  const cam: Cam = { pos: [0.4 + (tunnel ? 0.3 : -0.4) * k, 1.38 + Math.sin(lt * 9) * 0.006, 7.4 - 0.5 * k], target: [0, 0.55, 0], fov: 32 };
  const m = (tunnel ? 1.02 : 0.98) + 0.05 * k;
  const bounce = Math.sin(lt * 13) * 1.5 + Math.sin(lt * 7.3) * 1.0;
  const cx = 930 + (tunnel ? -20 : 30) * k;
  const groundY = 885;
  const left = cx - ((CAR.x0 + CAR.x1) / 2) * m;
  const top = groundY - CAR.y1 * m + bounce;
  const flash = interpolate(lt, [0, 0.05, 0.35], [1, 0.8, 0], clamp);
  const fadeIn = kind === "highway" ? interpolate(lt, [0, 0.25], [0, 1], clamp) : 1;
  const fadeOut = kind === "highway" ? interpolate(t, [H_SEC - 0.6, H_SEC], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {kind === "highway" ? <Skyline lt={lt} /> : <AbsoluteFill style={{ background: "#07080A" }} />}
      <CarStage cam={cam} env={tunnel ? 0.3 : 0.35} envRot={2.4} exposure={1.1}>
        <ambientLight intensity={tunnel ? 0.35 : 0.28} />
        <Road lt={lt} kind={kind} />
      </CarStage>
      {/* desenfoque de movimiento del fondo (bordes) */}
      <AbsoluteFill style={{ backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", maskImage: "linear-gradient(90deg, black 0%, transparent 25%, transparent 75%, black 100%)", WebkitMaskImage: "linear-gradient(90deg, black 0%, transparent 25%, transparent 75%, black 100%)" }} />
      <CarComp
        m={m}
        left={left}
        top={top}
        spin={-lt * 1400}
        blur={7}
        filter={tunnel ? "brightness(0.72) contrast(1.08) saturate(0.9)" : "brightness(0.66) contrast(1.1) saturate(0.85)"}
        tint={tunnel ? "rgba(255,190,120,0.3)" : "rgba(80,110,180,0.45)"}
        sweeps={tunnel ? sweepsAt(lt, 0.25, 0.32) : sweepsAt(lt, 0.67, 0.5)}
        lights={1}
      />
      <AbsoluteFill style={{ background: "#fff", opacity: (kind === "tunnel" ? flash : 0) * 0.55, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "#000", opacity: fadeOut }} />
    </AbsoluteFill>
  );
};

const Skyline: React.FC<{ lt: number }> = ({ lt }) => {
  const shift = -lt * 22;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #05070D 0%, #0E1830 32%, #24304E 45%, #3A2E44 52%, #12131A 66%, #0A0B0E 100%)" }}>
      <div style={{ position: "absolute", left: shift - 300, top: 250, width: 2600, height: 260, filter: "brightness(1.5)" }}>
        {Array.from({ length: 80 }).map((_, i) => {
          const w = 24 + random(`bw${i}`) * 50;
          const h = 40 + random(`bh${i}`) * (i % 9 === 0 ? 220 : 110);
          const x = i * 32 + random(`bx${i}`) * 12;
          return (
            <div key={i} style={{ position: "absolute", left: x, bottom: 0, width: w, height: h, background: "#0D111B" }}>
              {Array.from({ length: Math.floor(h / 14) }).map((__, r) =>
                Array.from({ length: Math.max(1, Math.floor(w / 10)) }).map((___, c) =>
                  random(`win${i}-${r}-${c}`) > 0.55 ? <div key={`${r}-${c}`} style={{ position: "absolute", left: 3 + c * 10, top: 5 + r * 14, width: 4, height: 6, background: random(`wc${i}${r}${c}`) > 0.3 ? "#FFD79A" : "#BFD8FF", opacity: 0.85 }} /> : null,
                ),
              )}
            </div>
          );
        })}
      </div>
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: ((random(`kx${i}`) * 2100 + shift * 1.6) % 2100 + 2100) % 2100 - 90,
            top: 420 + random(`ky${i}`) * 170,
            width: 18 + random(`ks${i}`) * 34,
            height: 18 + random(`ks${i}`) * 34,
            borderRadius: "50%",
            background: random(`kc${i}`) > 0.5 ? "rgba(255,200,120,0.55)" : "rgba(170,205,255,0.45)",
            filter: "blur(3px)",
          }}
        />
      ))}
      <AbsoluteFill style={{ backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
export const MiniaturaBMWH: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MiniPart />
      <DriveScene from={CUT1} to={CUT2} kind="tunnel" />
      <DriveScene from={CUT2} to={H_SEC} kind="highway" />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 110% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none" }} />
      <AbsoluteFill
        style={{
          opacity: 0.06,
          mixBlendMode: "overlay",
          backgroundImage: "repeating-radial-gradient(circle at 17% 32%, #fff 0 1px, transparent 1px 3px), repeating-radial-gradient(circle at 73% 61%, #000 0 1px, transparent 1px 4px)",
          backgroundPosition: `${(frame * 37) % 200}px ${(frame * 53) % 200}px`,
          pointerEvents: "none",
        }}
      />
      <Html5Audio src={staticFile("audio-h.wav")} />
    </AbsoluteFill>
  );
};
