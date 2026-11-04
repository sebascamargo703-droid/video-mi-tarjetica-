import React from "react";
import { AbsoluteFill, Html5Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_INOUT, clamp } from "./motion";
import { Landscape } from "./Miniatura";

/**
 * "Miniatura" con el BMW del cliente (foto real): primero el carro a escala sobre el borde de la
 * ventana de un tren (paisaje pasando, tilt-shift), luego entra a un túnel y aparece el carro real
 * en la azotea al atardecer: acercamiento de cámara, nubes que se mueven, luces que se encienden y
 * un barrido de luz sobre la pintura. Sin textos ni voz.
 */
export const BMW_SEC = 11;
const CUT = 4.0;
const PW = 1449; // foto original
const PH = 2576;
const CAR = { x0: 135, y0: 1243, x1: 1320, y1: 1758 };
const HEAD = { x: 979, y: 1520 }; // faro (en px de la foto)
const FOG = { x: 985, y: 1640 };
const SUN = { x: 800, y: 830 };

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};
const ease = (x: number) => EASE_INOUT(Math.max(0, Math.min(1, x)));

/* ------------------------------------------------------------------ */
/* 1 · El BMW a escala en el borde de la ventana del tren */
const MiniPart: React.FC = () => {
  const { t } = useT();
  if (t > CUT + 0.1) return null;
  const dark = ease((t - (CUT - 0.5)) / 0.45);
  const jx = Math.sin(t * 37) * 1.2;
  const jy = Math.sin(t * 53) * 1.4 + Math.sin(t * 19) * 0.8;
  const zoom = 1 + 0.06 * ease(t / CUT);
  const m = 760 / (CAR.x1 - CAR.x0);
  const surface = 1330;
  const left = 585 - ((CAR.x0 + CAR.x1) / 2) * m;
  const top = surface - CAR.y1 * m + 6;
  return (
    <AbsoluteFill>
      <Landscape t={t} dark={dark} dir={-1} />
      <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.07) 62%, rgba(255,255,255,0) 82%)" }} />
      {/* portal del túnel que llega desde la derecha */}
      <AbsoluteFill style={{ background: "linear-gradient(270deg, #0C0D0F 0%, #24272B 70%, rgba(36,39,43,0) 100%)", transform: `translateX(${1300 - 1500 * ease((t - (CUT - 0.75)) / 0.6)}px)`, filter: "blur(10px)" }} />
      <AbsoluteFill style={{ transform: `translate(${jx}px, ${jy}px) scale(${zoom})`, transformOrigin: "50% 62%" }}>
        {/* borde de la ventana: superficie, canto redondeado y pared del vagón */}
        <div style={{ position: "absolute", left: -60, right: -60, top: surface - 150, height: 230, background: "linear-gradient(180deg, #A9A49B 0%, #CFC9BF 18%, #E2DCD2 70%, #EDE8DF 100%)", borderTop: "6px solid #1B1D20" }} />
        <div style={{ position: "absolute", left: -60, right: -60, top: surface + 80, height: 46, background: "linear-gradient(180deg, #F4F0E8 0%, #C8C2B7 60%, #8E8980 100%)", borderRadius: "0 0 30px 30px" }} />
        <div style={{ position: "absolute", left: -60, right: -60, top: surface + 126, bottom: -60, background: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 118px, rgba(0,0,0,0.18) 118px 122px), linear-gradient(180deg, #8A8F95 0%, #6C7177 45%, #50555B 100%)" }} />
        {/* sombra de contacto */}
        <div style={{ position: "absolute", left: left + CAR.x0 * m - 10, top: surface - 46, width: (CAR.x1 - CAR.x0) * m + 20, height: 70, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 50%, rgba(20,18,15,0.55) 0%, rgba(20,18,15,0.25) 45%, transparent 72%)", filter: "blur(6px)" }} />
        <Img src={staticFile("bmw/carro.png")} style={{ position: "absolute", left, top, width: PW * m, height: PH * m }} />
      </AbsoluteFill>
      {/* poste del marco de la ventana */}
      <div style={{ position: "absolute", left: -40, top: 0, width: 150, height: 1920, background: "linear-gradient(270deg, #2A2C30, #0D0E10 60%)", boxShadow: "20px 0 40px rgba(0,0,0,0.45)", filter: "blur(2px)" }} />
      {/* tilt-shift: arriba y abajo desenfocados */}
      <AbsoluteFill style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", maskImage: "linear-gradient(180deg, black 0%, transparent 42%, transparent 74%, black 100%)", WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 42%, transparent 74%, black 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: dark }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2 · El carro real en la azotea al atardecer */
const RealPart: React.FC = () => {
  const { t } = useT();
  if (t < CUT - 0.05) return null;
  const lt = t - CUT;
  const reveal = ease(lt / 0.9);
  const push = ease((lt - 0.9) / (BMW_SEC - CUT - 0.9));
  const zoom = 1.42 - 0.36 * reveal + 0.1 * push;
  const s0 = 1080 / PW;
  const ox = (CAR.x0 + CAR.x1) / 2;
  const oy = 1500;
  const driftX = -18 * push;
  const blur = (1 - reveal) * 14;
  const flash = interpolate(lt, [0, 0.05, 0.4], [1, 0.9, 0], clamp);
  const lights = interpolate(lt, [1.0, 1.15, 1.3, 1.45], [0, 1, 0.55, 1], clamp);
  const sweep = (at: number) => interpolate(lt, [at, at + 1.3], [-0.4, 1.4], clamp);
  const fade = interpolate(t, [BMW_SEC - 0.7, BMW_SEC], [0, 1], clamp);
  const sky = lt * 14;
  // posiciones en pantalla dentro del contenedor escalado
  const pos = (p: { x: number; y: number }) => ({ left: p.x * s0, top: p.y * s0 });
  const carMask = `url(${staticFile("bmw/carro.png")})`;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translateX(${driftX}px) scale(${zoom})`, transformOrigin: `${ox * s0}px ${oy * s0}px`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        <Img src={staticFile("bmw/foto.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH * s0 }} />
        {/* luz que se mueve entre las nubes (sin duplicar la foto) */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1240 * s0, overflow: "hidden", mixBlendMode: "soft-light", maskImage: "linear-gradient(180deg, black 0%, black 70%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, black 0%, black 70%, transparent 100%)" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: -300 + ((sky * (1 + i * 0.4) + i * 420) % 1500), top: 120 + i * 210, width: 700, height: 360, borderRadius: "50%", background: i === 1 ? "radial-gradient(ellipse, rgba(255,230,190,0.7), transparent 70%)" : "radial-gradient(ellipse, rgba(40,48,64,0.55), transparent 70%)", filter: "blur(30px)" }} />
          ))}
        </div>
        {/* el sol detrás de las nubes respira */}
        <div style={{ position: "absolute", ...pos(SUN), width: 0, height: 0 }}>
          <div style={{ position: "absolute", left: -420, top: -320, width: 840, height: 640, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,214,150,0.55) 0%, rgba(255,190,120,0.18) 40%, transparent 70%)", mixBlendMode: "screen", opacity: 0.6 + 0.25 * Math.sin(lt * 1.3) }} />
        </div>
        {/* barrido de luz sobre la pintura (solo dentro del carro) */}
        {[1.9, 4.6].map((at) => {
          const k = sweep(at);
          if (k <= -0.4 || k >= 1.4) return null;
          return (
            <div key={at} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH * s0, maskImage: carMask, WebkitMaskImage: carMask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%", mixBlendMode: "screen" }}>
              <div style={{ position: "absolute", left: (CAR.x0 + (CAR.x1 - CAR.x0) * k) * s0 - 140, top: CAR.y0 * s0 - 100, width: 140, height: (CAR.y1 - CAR.y0) * s0 + 200, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)", transform: "skewX(-24deg)", filter: "blur(10px)" }} />
            </div>
          );
        })}
        {/* faros que se encienden */}
        {lights > 0 ? (
          <>
            {[HEAD, FOG].map((p, i) => (
              <div key={i} style={{ position: "absolute", ...pos(p), width: 0, height: 0, mixBlendMode: "screen" }}>
                <div style={{ position: "absolute", left: -70, top: -40, width: 140, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, rgba(200,225,255,0.55) 30%, transparent 70%)", opacity: lights * (i ? 0.7 : 1) }} />
                {i === 0 ? <div style={{ position: "absolute", left: -380, top: -3, width: 760, height: 6, background: "linear-gradient(90deg, transparent, rgba(190,220,255,0.85), transparent)", filter: "blur(2px)", opacity: lights * 0.9 }} /> : null}
              </div>
            ))}
          </>
        ) : null}
      </AbsoluteFill>
      {/* gradación cinematográfica */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,30,50,0.25) 0%, transparent 40%, transparent 70%, rgba(0,0,0,0.35) 100%)", mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.6, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};

export const MiniaturaBMW: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MiniPart />
      <RealPart />
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
      <Html5Audio src={staticFile("audio.wav")} />
    </AbsoluteFill>
  );
};
