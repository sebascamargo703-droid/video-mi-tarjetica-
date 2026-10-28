import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Html5Audio, Sequence, getStaticFiles, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { audio, brand } from "./brand";
import { business, copy, headlines } from "./copy";
import { font, logoFont } from "./fonts";
import { BusinessIcon } from "./components/BusinessPin";
import { Logo } from "./components/Logo";
import { LockScreen } from "./components/LockScreen";
import { Notification } from "./components/Notification";
import { MiniCard, PassCard } from "./components/PassCard";
import { QrCode } from "./components/QrCode";
import { ShadowFloor } from "./three/Objects";
import { Stage } from "./three/Stage";
import { useCanvasTexture } from "./three/textures";
import { EASE_IN, EASE_INOUT, clamp, ease } from "./motion";
import { BigPhone, CX, Headline, Karaoke, SCREEN } from "./ui";
import { DURATION_SEC, SCENES, type SceneId, V, VOICE, wordTime } from "./timeline";

const C = brand.colors;
const S = SCENES;

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps, s: (x: number) => Math.round(x * fps) };
};

/* ------------------------------------------------------------------ */
/* Piezas comunes */

/** Foto 16:9 (2048×1152) recortada en vertical; `cx` es el centro horizontal en píxeles de la foto. */
const Photo: React.FC<{ src: string; cx: number; zoom?: number; originY?: number; rotate?: number; filter?: string }> = ({ src, cx, zoom = 1, originY = 960, rotate = 0, filter }) => {
  const k = 1920 / 1152;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <img
        src={staticFile(src)}
        style={{ position: "absolute", height: 1920, width: 2048 * k, left: 540 - cx * k, top: 0, transform: `scale(${zoom}) rotate(${rotate}deg)`, transformOrigin: `${cx * k}px ${originY}px`, filter }}
      />
    </AbsoluteFill>
  );
};

/** Fondo oscuro con un halo verde que respira. */
const DarkBg: React.FC<{ glow?: number; y?: number }> = ({ glow = 1, y = 980 }) => {
  const { t } = useT();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 760px 900px at ${CX}px ${y}px, rgba(22,112,93,${0.42 * glow * (0.9 + 0.1 * Math.sin(t * 1.4))}) 0%, rgba(8,58,48,${0.18 * glow}) 45%, transparent 75%)` }} />
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ id: SceneId; children: React.ReactNode }> = ({ id, children }) => {
  const { frame, s } = useT();
  const a = s(S[id].from);
  const b = s(S[id].to);
  if (frame < a || frame > b + 7) return null;
  const tin = a === 0 ? 1 : ease(frame, a, 7);
  return <AbsoluteFill style={{ opacity: tin, transform: `scale(${1.04 - 0.04 * tin})`, filter: tin < 1 ? `blur(${(1 - tin) * 10}px)` : undefined }}>{children}</AbsoluteFill>;
};

/** Contenedor que entra con resorte (escala + subida) en el cuadro `at`. */
const PopIn: React.FC<{ at: number; x: number; y: number; w?: number; from?: number; children: React.ReactNode; out?: number; style?: React.CSSProperties }> = ({ at, x, y, w, from = 60, children, out = 0, style }) => {
  const { frame, fps } = useT();
  if (frame < at) return null;
  const p = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 150 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: Math.min(1, p * 1.6) * (1 - out), transform: `translateY(${(1 - p) * from - out * 30}px) scale(${0.92 + 0.08 * p})`, transformOrigin: "50% 50%", ...style }}>
      {children}
    </div>
  );
};

/** Tarjeta oscura tipo "app" (paneles del dueño). */
const Glass: React.FC<{ w: number; children: React.ReactNode; pad?: number }> = ({ w, children, pad = 30 }) => (
  <div style={{ width: w, padding: pad, borderRadius: 34, background: "linear-gradient(180deg, #121C1A 0%, #0B1311 100%)", border: "1.5px solid rgba(167,201,189,0.16)", boxShadow: "0 40px 100px rgba(0,0,0,0.65)", fontFamily: font, color: C.white }}>{children}</div>
);

const Avatar: React.FC<{ letter: string; color: string; size?: number }> = ({ letter, color, size = 64 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, fontWeight: 800, fontSize: size * 0.45, flexShrink: 0 }}>{letter}</div>
);

/** Celular grande con desplazamiento horizontal libre (BigPhone siempre centra en CX). */
const PhoneAt: React.FC<{ x?: number; y: number; w: number; tilt?: number; screenBg?: string; children: React.ReactNode }> = ({ x = 0, y, w, tilt = 0, screenBg, children }) => (
  <div style={{ position: "absolute", inset: 0, transform: `translateX(${x}px)` }}>
    <BigPhone y={y} w={w} tilt={tilt} screenBg={screenBg}>
      {children}
    </BigPhone>
  </div>
);

/** Pantalla de la billetera con la tarjeta de sellos. */
const WalletScreen: React.FC<{ stamps: number; pulse?: number; banner?: number }> = ({ stamps, pulse = 0, banner = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: "#0B0D0F", fontFamily: font, color: C.white }}>
    <div style={{ position: "absolute", left: 34, top: 120, fontSize: 52, fontWeight: 800, letterSpacing: "-0.02em" }}>Billetera</div>
    <div style={{ position: "absolute", left: 30, top: 210 }}>
      <PassCard width={SCREEN - 60} stamps={stamps} pulse={pulse} />
    </div>
    {banner > 0.01 ? (
      <div style={{ position: "absolute", left: 20, right: 20, top: 70, transform: `translateY(${(1 - banner) * -160}px)`, opacity: Math.min(1, banner * 2) }}>
        <MiniNotif title={copy.stampNotif.title} body={copy.stampNotif.body} width={SCREEN - 40} />
      </div>
    ) : null}
  </div>
);

/** Notificación compacta (texto libre). */
const MiniNotif: React.FC<{ title: string; body: string; width: number; when?: string }> = ({ title, body, width, when = "ahora" }) => {
  const k = width / 620;
  return (
    <div style={{ width, display: "flex", gap: 18 * k, alignItems: "center", padding: `${20 * k}px ${22 * k}px`, borderRadius: 30 * k, background: "rgba(40,46,50,0.92)", backdropFilter: "blur(20px)", border: "1.5px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", fontFamily: font, color: C.white }}>
      <div style={{ width: 70 * k, height: 70 * k, borderRadius: 18 * k, background: `linear-gradient(145deg, ${C.greenMid}, ${C.greenDeep})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <BusinessIcon size={42 * k} color={C.white} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 * k, fontWeight: 800 }}>
          <span>{title}</span>
          <span style={{ fontWeight: 600, opacity: 0.6 }}>{when}</span>
        </div>
        <div style={{ fontSize: 28 * k, lineHeight: 1.25, marginTop: 4 * k, opacity: 0.92 }}>{body}</div>
      </div>
    </div>
  );
};

/** Dedo que toca: círculo que se encoge con onda. */
const Tap: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const { frame } = useT();
  const d = frame - at;
  if (d < -8 || d > 16) return null;
  const inn = interpolate(d, [-8, 0], [0, 1], clamp);
  const ring = interpolate(d, [0, 16], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
      <div style={{ position: "absolute", width: 70, height: 70, left: -35, top: -35, borderRadius: "50%", background: "rgba(255,255,255,0.55)", transform: `scale(${1.2 - 0.3 * inn})`, opacity: inn * (1 - ring) }} />
      <div style={{ position: "absolute", width: 70, height: 70, left: -35, top: -35, borderRadius: "50%", border: "4px solid rgba(255,255,255,0.8)", transform: `scale(${1 + ring * 1.6})`, opacity: (1 - ring) * (d >= 0 ? 1 : 0) }} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 1 · La tarjeta de papel en la lavadora (foto) */
const WashScene: React.FC = () => {
  const { frame, s, t } = useT();
  const spinAt = s(wordTime("h2", "lavadora") - 0.1);
  const spin = ease(frame, spinAt, 40, EASE_INOUT);
  const zoom = 1.04 + 0.1 * (t / S.wash.to) + 0.08 * spin;
  return (
    <Scene id="wash">
      <Photo src="fotos/lavadora.jpg" cx={1040} zoom={zoom} originY={960} rotate={-1.5 + 9 * spin} filter={`saturate(${1 - 0.25 * spin}) brightness(${1 - 0.15 * spin})`} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,8,11,0.82) 0%, rgba(5,8,11,0.35) 26%, rgba(5,8,11,0) 40%, rgba(5,8,11,0) 62%, rgba(5,8,11,0.7) 100%)" }} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 2 · Tarjetas de papel que caen, se mojan y se pierden (3D) */
const PAPER_TINTS = ["#F3EAD6", "#CDEBDD", "#F4D3DA", "#D6E2F5", "#F7E3B5"];
const PaperCards: React.FC<{ tau: number; wet: number; lost: number }> = ({ tau, wet, lost }) => {
  const tex = useCanvasTexture("tarjeta-papel", 512, 320, (c, w, h) => {
    c.fillStyle = "#FFFFFF";
    c.fillRect(0, 0, w, h);
    c.strokeStyle = "rgba(120,80,40,0.25)";
    c.lineWidth = 4;
    c.strokeRect(12, 12, w - 24, h - 24);
    c.fillStyle = "#6B4A2E";
    c.font = "800 30px Inter";
    c.fillText("CLIENTE FRECUENTE", 36, 64);
    for (let i = 0; i < 10; i++) {
      const x = 70 + (i % 5) * 92;
      const y = 140 + Math.floor(i / 5) * 92;
      c.beginPath();
      c.arc(x, y, 32, 0, Math.PI * 2);
      c.strokeStyle = "#C9473F";
      c.lineWidth = 4;
      c.stroke();
      if (i < 6) {
        c.fillStyle = "rgba(201,71,63,0.85)";
        c.beginPath();
        c.arc(x + 2, y + 1, 24, 0, Math.PI * 2);
        c.fill();
      }
    }
    c.fillStyle = "rgba(107,74,46,0.5)";
    c.fillRect(36, 282, 260, 3);
  });
  if (!tex) return null;
  const wetCol = new THREE.Color("#7E8890");
  return (
    <>
      {Array.from({ length: 22 }).map((_, i) => {
        const t0 = random(`t${i}`) * 4.2;
        const life = tau - t0;
        if (life < 0) return null;
        const y = 5 - life * (1.5 + random(`v${i}`) * 0.6);
        if (y < -7) return null;
        const x = (random(`x${i}`) - 0.5) * 6.2 + Math.sin(life * 1.6 + i) * 0.7;
        const z = (random(`z${i}`) - 0.5) * 4 - 0.5;
        const col = new THREE.Color(PAPER_TINTS[i % PAPER_TINTS.length]).lerp(wetCol, wet * (0.4 + 0.5 * random(`w${i}`)));
        return (
          <mesh key={i} position={[x, y, z]} rotation={[Math.sin(life * 1.3 + i) * 1.1, life * (0.8 + random(`r${i}`)) + i, Math.cos(life * 0.9 + i) * 0.6]} scale={1.05} castShadow>
            <boxGeometry args={[1.6, 1, 0.012]} />
            <meshStandardMaterial map={tex} color={col} roughness={0.55 - 0.35 * wet} metalness={0} transparent opacity={1 - lost * (0.25 + 0.75 * random(`l${i}`))} />
          </mesh>
        );
      })}
    </>
  );
};

const LostScene: React.FC = () => {
  const { frame, t, s } = useT();
  const slowAt = V.p2.at;
  const pre = 2.2; // las primeras tarjetas ya vienen cayendo cuando arranca la escena
  const tau = pre + (t < slowAt ? t - S.lost.from : slowAt - S.lost.from + (t - slowAt) * 0.18);
  const wet = ease(frame, s(wordTime("p1", "moja")), 12);
  const lost = ease(frame, s(wordTime("p1", "olvida")), 30);
  const dim = ease(frame, s(V.p2.at - 0.1), 18);
  return (
    <Scene id="lost">
      <DarkBg glow={1 - 0.7 * dim} y={900} />
      <Stage cam={{ pos: [0, 0.2, 10], target: [0, 0, 0], fov: 40 }} env={0.9 - 0.5 * dim} exposure={1.1 - 0.4 * dim}>
        <ShadowFloor y={-4.5} opacity={0.3} />
        <PaperCards tau={tau} wet={wet} lost={lost} />
      </Stage>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)", opacity: 0.5 + 0.5 * dim }} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 3 · ¿Adivina quién sí vuelve? */
const GuessScene: React.FC = () => {
  const { frame, t, s } = useT();
  const p = ease(frame, s(S.guess.from), 40);
  return (
    <Scene id="guess">
      <DarkBg glow={0.6 + 0.8 * p} y={1000} />
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${t * 12}deg at ${CX}px 1000px, rgba(143,227,192,0.08) 0deg 5deg, transparent 5deg 15deg)`,
          maskImage: "radial-gradient(circle at 480px 1000px, black 0%, transparent 55%)",
          opacity: p,
        }}
      />
      {[0, 1, 2].map((i) => {
        const r = ((t * 0.6 + i / 3) % 1) * 1;
        return <div key={i} style={{ position: "absolute", left: CX - 300, top: 700, width: 600, height: 600, borderRadius: "50%", border: "3px solid rgba(143,227,192,0.7)", transform: `scale(${0.2 + r * 1.3})`, opacity: (1 - r) * p }} />;
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 4 · Mi Tarjetica: la tarjeta pasa del papel al celular */
const PaperCard2D: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 0.62, borderRadius: 10, background: "#F3EAD6", boxShadow: "0 24px 50px rgba(0,0,0,0.5)", padding: w * 0.06, boxSizing: "border-box", fontFamily: font }}>
    <div style={{ fontSize: w * 0.065, fontWeight: 800, color: "#6B4A2E", letterSpacing: "0.04em" }}>CLIENTE FRECUENTE</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: w * 0.03, marginTop: w * 0.06 }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ width: w * 0.13, height: w * 0.13, borderRadius: "50%", border: `${w * 0.008}px solid #C9473F`, background: i < 4 ? "rgba(201,71,63,0.85)" : undefined, boxSizing: "border-box" }} />
      ))}
    </div>
  </div>
);

const BrandScene: React.FC = () => {
  const { frame, fps, s } = useT();
  const logoAt = s(V.m0.at - 0.05);
  const logoIn = frame >= logoAt ? spring({ frame: frame - logoAt, fps, config: { damping: 14, stiffness: 140 } }) : 0;
  const logoOut = ease(frame, s(V.m1.at - 0.05), 10, EASE_IN);
  const phoneAt = s(wordTime("m1", "celular") - 0.6);
  const ph = frame >= phoneAt ? spring({ frame: frame - phoneAt, fps, config: { damping: 16, stiffness: 110 } }) : 0;
  const paperIn = ease(frame, s(V.m1.at), 14);
  const fly = ease(frame, s(wordTime("m1", "celular") - 0.1), 18, EASE_INOUT);
  return (
    <Scene id="brand">
      <DarkBg y={1050} />
      {logoOut < 1 ? (
        <div style={{ position: "absolute", left: 0, width: 960, top: 820, display: "flex", justifyContent: "center", opacity: Math.min(1, logoIn * 1.5) * (1 - logoOut), transform: `translateY(${-logoOut * 60}px) scale(${(0.8 + 0.2 * logoIn) * (1 - 0.1 * logoOut)})`, filter: logoIn < 0.95 ? `blur(${(1 - logoIn) * 12}px)` : undefined }}>
          <Logo height={150} color={C.white} />
        </div>
      ) : null}
      {/* tarjeta de papel que vuela al celular */}
      {paperIn > 0 && fly < 1 ? (
        <div style={{ position: "absolute", left: 70 + fly * 330, top: 760 + fly * 260, opacity: paperIn * (1 - fly), transform: `rotate(${-8 + 8 * fly}deg) scale(${1 - 0.6 * fly})`, transformOrigin: "50% 50%" }}>
          <PaperCard2D w={360} />
        </div>
      ) : null}
      {ph > 0 ? (
        <PhoneAt x={110 - 110 * ph * 0} y={560 + (1 - ph) * 900} w={430} tilt={4 * (1 - ph)}>
          <WalletScreen stamps={interpolate(frame, [phoneAt + 14, phoneAt + 30], [0, 4], clamp)} />
        </PhoneAt>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 5 · Escanea el QR, sin descargar app */
const QrScene: React.FC = () => {
  const { frame, fps, s } = useT();
  const signIn = s(S.qr.from + 0.1);
  const addAt = s(wordTime("q1", "sin") - 0.1);
  const add = frame >= addAt ? spring({ frame: frame - addAt, fps, config: { damping: 18, stiffness: 140 } }) : 0;
  const cardAt = s(wordTime("q1", "ninguna"));
  const scan = (frame - signIn) / fps;
  return (
    <Scene id="qr">
      <DarkBg y={1000} />
      <PopIn at={signIn} x={60} y={700} w={380}>
        <div style={{ width: 380, borderRadius: 30, background: C.cream, padding: "34px 30px 30px", boxShadow: "0 40px 90px rgba(0,0,0,0.6)", fontFamily: font, color: C.ink, textAlign: "center", transform: "perspective(1200px) rotateY(14deg)" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: "#1F2A33", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BusinessIcon size={44} color={C.cream} />
            </div>
          </div>
          <div style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 34, marginTop: 10 }}>{business.name}</div>
          <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1, marginTop: 10 }}>
            {copy.qrSign.top}
            <br />
            {copy.qrSign.bottom}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <div style={{ padding: 12, background: "#fff", borderRadius: 16, position: "relative" }}>
              <QrCode size={230} color={C.ink} background="#fff" quiet={1} />
              <div style={{ position: "absolute", left: 6, right: 6, top: 12 + (Math.sin(scan * 3) * 0.5 + 0.5) * 230, height: 4, borderRadius: 4, background: C.mint, boxShadow: `0 0 18px ${C.mint}`, opacity: add < 0.5 ? 1 : 0 }} />
            </div>
          </div>
        </div>
      </PopIn>
      <PhoneAt x={185} y={620} w={380} tilt={-3}>
        <div style={{ position: "absolute", inset: 0, background: "#0B0D0F" }}>
          {/* visor de cámara */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 45%, #2a3330, #0b0d0f 70%)", opacity: 1 - add }}>
            <div style={{ position: "absolute", left: "50%", top: "42%", width: 360, height: 360, transform: "translate(-50%,-50%)", border: "6px solid rgba(255,255,255,0.85)", borderRadius: 40, opacity: 0.9 }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: "68%", textAlign: "center", fontFamily: font, fontSize: 30, fontWeight: 600, color: "#fff", opacity: 0.85 }}>Apunta al código</div>
          </div>
          {/* hoja "Añadir a la billetera" */}
          {add > 0 ? (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 110 + (1 - add) * 1300, background: "#16191C", borderRadius: "40px 40px 0 0", fontFamily: font, color: "#fff" }}>
              <div style={{ position: "absolute", left: 30, top: 90 }}>
                <PassCard width={SCREEN - 60} stamps={frame >= cardAt ? 1 : 0} showQr={false} />
              </div>
              <div style={{ position: "absolute", left: 40, right: 40, top: 30, display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 600 }}>
                <span style={{ opacity: 0.6 }}>Cancelar</span>
                <span style={{ color: C.mint, fontWeight: 800 }}>Añadir</span>
              </div>
              <div style={{ position: "absolute", left: 40, right: 40, bottom: 120, height: 96, borderRadius: 26, background: "#fff", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800 }}>{copy.addPass}</div>
            </div>
          ) : null}
        </div>
      </PhoneAt>
      <Tap x={665} y={1388} at={cardAt + 2} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 6 · Camilo paga y el sello llega solo */
const PayScene: React.FC = () => {
  const { frame, fps, s } = useT();
  const tapAt = s(wordTime("c1", "paga"));
  const stampAt = s(wordTime("c1", "sello"));
  const banner = frame >= stampAt ? spring({ frame: frame - stampAt, fps, config: { damping: 16, stiffness: 160 } }) * (1 - ease(frame, stampAt + 50, 10)) : 0;
  const stamps = 3 + interpolate(frame, [stampAt + 4, stampAt + 14], [0, 1], clamp);
  const zoomAt = s(V.c2.at - 0.1);
  const z = ease(frame, zoomAt, 22, EASE_INOUT);
  const badgeAt = s(wordTime("c2", "corte"));
  const badge = frame >= badgeAt ? spring({ frame: frame - badgeAt, fps, config: { damping: 10, stiffness: 160 } }) : 0;
  return (
    <Scene id="pay">
      <Photo src="fotos/calle.jpg" cx={330} zoom={1.15} filter="blur(16px) brightness(0.42) saturate(0.9)" />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,8,11,0.85) 0%, rgba(5,8,11,0.3) 30%, rgba(5,8,11,0.3) 70%, rgba(5,8,11,0.8) 100%)" }} />
      {/* caja del negocio */}
      <div style={{ position: "absolute", left: 50, top: 760, opacity: 1 - z, transform: `translateX(${-z * 200}px)` }}>
        <PopIn at={s(S.pay.from + 0.05)} x={0} y={0} w={420}>
          <Glass w={420} pad={28}>
            <div style={{ fontSize: 34, fontWeight: 800 }}>{copy.register.who}</div>
            <div style={{ fontSize: 24, opacity: 0.6, marginTop: 4 }}>{copy.register.where}</div>
            <div style={{ marginTop: 22, height: 78, borderRadius: 20, background: frame >= tapAt ? C.highlight : C.mint, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, transform: `scale(${frame >= tapAt && frame < tapAt + 6 ? 0.95 : 1})` }}>
              {frame >= stampAt ? "✓ Sellado" : copy.register.button}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24 }}>
              <Avatar letter="C" color={C.highlight} size={54} />
              <span style={{ fontSize: 30, fontWeight: 700 }}>Camilo</span>
            </div>
          </Glass>
        </PopIn>
        <Tap x={210} y={155} at={tapAt} />
      </div>
      {/* celular de Camilo */}
      <PhoneAt x={190 - 190 * z} y={600 - 40 * z} w={400 + 120 * z}>
        <WalletScreen stamps={stamps} banner={banner} pulse={z * (0.6 + 0.4 * Math.sin(frame / 4))} />
      </PhoneAt>
      {badge > 0 ? (
        <div style={{ position: "absolute", left: 650, top: 1010, transform: `scale(${badge}) rotate(${-12 + 4 * Math.sin(frame / 10)}deg)`, width: 230, height: 230, borderRadius: "50%", background: C.gold, color: C.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: font, fontWeight: 800, boxShadow: "0 24px 60px rgba(232,184,74,0.45)", border: `6px solid ${C.goldLight}` }}>
          <BusinessIcon size={60} color={C.ink} />
          <div style={{ fontSize: 34, lineHeight: 1, marginTop: 6 }}>CORTE</div>
          <div style={{ fontSize: 34, lineHeight: 1 }}>GRATIS</div>
        </div>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 7 · Camilo deja de venir (contador de días) */
const GoneScene: React.FC = () => {
  const { frame, s } = useT();
  const from = s(wordTime("d1", "deja"));
  const to = s(V.d2.end);
  const days = Math.round(interpolate(frame, [from, to], [1, 47], { ...clamp, easing: EASE_INOUT }));
  const grey = ease(frame, from, 30);
  return (
    <Scene id="gone">
      <DarkBg glow={0.5} y={1000} />
      <div style={{ position: "absolute", left: CX - 260, top: 590, height: 420, overflow: "hidden", borderRadius: 26, transform: "perspective(1400px) rotateX(10deg) rotateZ(-3deg)", filter: `grayscale(${grey}) brightness(${1 - 0.35 * grey})` }}>
        <PassCard width={520} stamps={4} showQr={false} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 960, top: 1060, textAlign: "center", fontFamily: font, color: C.white, opacity: ease(frame, from - 4, 10) }}>
        <div style={{ fontSize: 210, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", color: C.red, textShadow: "0 0 50px rgba(255,90,82,0.35)" }}>{days}</div>
        <div style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 52, marginTop: 4, opacity: 0.85 }}>{copy.days}</div>
      </div>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 8 · Pasa cerca y el celular le avisa (foto) */
const NearScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const z = 1 + 0.08 * ((t - S.near.from) / (S.near.to - S.near.from));
  const notifAt = s(wordTime("n1", "avisa") - 0.15);
  const n = frame >= notifAt ? spring({ frame: frame - notifAt, fps, config: { damping: 15, stiffness: 150 } }) : 0;
  const ringsOn = ease(frame, s(wordTime("n1", "cerca")), 10);
  const px = 823;
  const py = 1290;
  return (
    <Scene id="near">
      <Photo src="fotos/calle.jpg" cx={1300} zoom={z} originY={1290} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,8,11,0.85) 0%, rgba(5,8,11,0.25) 30%, rgba(5,8,11,0) 45%, rgba(5,8,11,0) 75%, rgba(5,8,11,0.55) 100%)" }} />
      {[0, 1, 2].map((i) => {
        const r = ((t * 0.7 + i / 3) % 1) * 1;
        return <div key={i} style={{ position: "absolute", left: px - 200, top: py - 200, width: 400, height: 400, borderRadius: "50%", border: "3px solid rgba(143,227,192,0.85)", transform: `scale(${0.15 + r * 1.4})`, opacity: (1 - r) * ringsOn * 0.9 }} />;
      })}
      {n > 0 ? (
        <div style={{ position: "absolute", left: 90, top: 880, transform: `translateY(${(1 - n) * -80}px) scale(${0.9 + 0.1 * n})`, opacity: Math.min(1, n * 1.5) }}>
          <Notification width={780} />
        </div>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 9 · Y vuelve: lo ves en tu panel */
const PanelList: React.FC<{ back: number; select?: number }> = ({ back, select = 0 }) => (
  <Glass w={800} pad={32}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: "#1F2A33", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BusinessIcon size={34} color={C.cream} />
      </div>
      <div style={{ fontSize: 34, fontWeight: 800 }}>{copy.panel.title}</div>
    </div>
    <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "0.18em", color: C.soft, marginTop: 26, marginBottom: 12 }}>{copy.panel.section}</div>
    {copy.panel.rows.map((r, i) => {
      const isBack = i === 0 ? back : 0;
      const sel = i > 0 ? select : 0;
      return (
        <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 18px", marginTop: 10, borderRadius: 22, background: isBack > 0 ? `rgba(143,227,192,${0.16 * isBack})` : sel > 0 ? `rgba(255,184,102,${0.14 * sel})` : "rgba(255,255,255,0.04)", border: `2px solid ${isBack > 0 ? `rgba(143,227,192,${isBack})` : sel > 0 ? `rgba(255,184,102,${sel})` : "rgba(255,255,255,0.06)"}` }}>
          <Avatar letter={r.name[0]} color={r.color} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{r.name}</div>
            <div style={{ fontSize: 24, opacity: 0.6 }}>{r.detail}</div>
          </div>
          {isBack > 0.5 ? (
            <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, background: C.highlight, padding: "8px 16px", borderRadius: 999, transform: `scale(${Math.min(1, (isBack - 0.5) * 2)})` }}>{copy.panel.back}</div>
          ) : (
            <div style={{ fontSize: 24, fontWeight: 700, opacity: 0.55 }}>{r.days} días</div>
          )}
        </div>
      );
    })}
  </Glass>
);

const BackScene: React.FC = () => {
  const { frame, fps, s } = useT();
  const backAt = s(V.v1.at + 0.1);
  const back = ease(frame, backAt, 12);
  const stampAt = s(wordTime("v2", "panel") - 0.1);
  const st = frame >= stampAt ? spring({ frame: frame - stampAt, fps, config: { damping: 9, stiffness: 170 } }) : 0;
  return (
    <Scene id="back">
      <DarkBg y={1000} />
      <PopIn at={s(S.back.from + 0.02)} x={80} y={600} w={800}>
        <PanelList back={back} />
      </PopIn>
      {st > 0 ? (
        <div style={{ position: "absolute", left: 600, top: 1080, width: 300, height: 300, transform: `scale(${2 - st}) rotate(-14deg)`, opacity: Math.min(1, st * 1.5) }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: `9px solid ${C.highlight}`, background: "rgba(5,8,11,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: font, fontWeight: 800, color: C.highlight, boxShadow: "0 0 60px rgba(143,227,192,0.45)" }}>
            <div style={{ fontSize: 54, lineHeight: 1 }}>{copy.panel.badge[0]}</div>
            <div style={{ fontSize: 54, lineHeight: 1 }}>{copy.panel.badge[1]}</div>
          </div>
        </div>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 10 · A los que no vuelven, un aviso */
const PushScene: React.FC = () => {
  const { frame, fps, s } = useT();
  const sel = ease(frame, s(V.a1.at + 0.3), 10);
  const composeAt = s(V.a2.at - 0.05);
  const listOut = ease(frame, composeAt - 4, 8, EASE_IN);
  const sendAt = s(wordTime("a2", "listo") - 0.15);
  const phonesAt = s(V.a3.at - 0.2);
  const composeOut = ease(frame, phonesAt - 4, 8, EASE_IN);
  return (
    <Scene id="push">
      <DarkBg y={1000} />
      {listOut < 1 ? (
        <div style={{ opacity: 1 - listOut }}>
          <PopIn at={s(S.push.from)} x={80} y={600} w={800}>
            <PanelList back={1} select={sel} />
          </PopIn>
        </div>
      ) : null}
      {composeOut < 1 ? (
        <div style={{ opacity: 1 - composeOut }}>
          <PopIn at={composeAt} x={140} y={640} w={680}>
            <Glass w={680} pad={34}>
              <div style={{ fontSize: 38, fontWeight: 800 }}>{copy.push.title}</div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "0.16em", color: C.soft, marginTop: 14 }}>{copy.push.to}</div>
              <div style={{ marginTop: 18, padding: "20px 22px", borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)", fontSize: 34, fontWeight: 600 }}>
                {copy.push.msg.slice(0, Math.max(0, Math.round(interpolate(frame, [composeAt + 4, composeAt + 22], [0, copy.push.msg.length], clamp))))}
                <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>|</span>
              </div>
              <div style={{ marginTop: 22, height: 84, borderRadius: 22, background: frame >= sendAt ? C.highlight : C.mint, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800 }}>{frame >= sendAt ? "✓ Enviado" : copy.push.button}</div>
            </Glass>
          </PopIn>
          <Tap x={480} y={925} at={sendAt} />
        </div>
      ) : null}
      {frame >= phonesAt
        ? copy.push.names.map((name, i) => {
            const at = phonesAt + i * 5;
            const p = frame >= at ? spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 130 } }) : 0;
            const nAt = at + 12;
            const np = frame >= nAt ? spring({ frame: frame - nAt, fps, config: { damping: 15, stiffness: 160 } }) : 0;
            return (
              <div key={name} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 120}px)` }}>
                <PhoneAt x={-190 + i * 380} y={560} w={330}>
                  <LockScreen>
                    {np > 0 ? (
                      <div style={{ position: "absolute", left: 20, top: 420, transform: `translateY(${(1 - np) * -40}px)`, opacity: np }}>
                        <MiniNotif title={business.name} body={copy.push.msg} width={SCREEN - 40} />
                      </div>
                    ) : null}
                  </LockScreen>
                </PhoneAt>
                <div style={{ position: "absolute", left: CX - 190 + i * 380 - 170, width: 340, top: 1262, textAlign: "center", fontFamily: font, fontSize: 30, fontWeight: 800, color: C.white }}>
                  {name} <span style={{ color: C.highlight, opacity: np }}>· {copy.push.sent}</span>
                </div>
              </div>
            );
          })
        : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 11 · Tu tarjeta, con tu logo y tus colores */
const ColorsScene: React.FC = () => {
  const { frame, fps, s } = useT();
  const a = s(S.colors.from);
  return (
    <Scene id="colors">
      <DarkBg y={1050} />
      {copy.brands.map((b, i) => {
        const at = a + 4 + i * 9;
        const p = frame >= at ? spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 120 } }) : 0;
        const ang = (i - 1.5) * 9;
        const x = CX - 230 + (i - 1.5) * 70;
        const y = 640 + Math.abs(i - 1.5) * 34 + i * 120;
        return (
          <div key={b.name} style={{ position: "absolute", left: x, top: y + (1 - p) * 500, opacity: Math.min(1, p * 1.5), transform: `perspective(1400px) rotateY(${(1 - p) * 70}deg) rotate(${ang * p}deg)`, transformOrigin: "50% 100%" }}>
            <MiniCard name={b.name} color={b.color} icon={b.icon} stamps={b.stamps} total={b.total} width={460} />
          </div>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 12 · Empieza gratis */
const FreeScene: React.FC = () => {
  const { frame, fps, s } = useT();
  const at = s(wordTime("f1", "veinte") - 0.3);
  return (
    <Scene id="free">
      <DarkBg glow={1.3} y={980} />
      <div style={{ position: "absolute", left: 0, width: 960, top: 640, display: "flex", justifyContent: "center" }}>
        <Logo height={110} color={C.white} />
      </div>
      {copy.free.chips.map((c, i) => {
        const p = frame >= at + i * 6 ? spring({ frame: frame - at - i * 6, fps, config: { damping: 14, stiffness: 160 } }) : 0;
        return (
          <div key={c} style={{ position: "absolute", left: 0, width: 960, top: 860 + i * 120, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 34px", borderRadius: 999, background: "rgba(143,227,192,0.12)", border: `2px solid ${C.highlight}`, fontFamily: font, fontSize: 40, fontWeight: 800, color: C.white }}>
              <span style={{ color: C.highlight }}>✓</span>
              {c}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, width: 960, top: 1130, textAlign: "center", fontFamily: font, fontSize: 36, fontWeight: 700, color: C.soft, opacity: ease(frame, at + 14, 10) }}>{copy.free.url}</div>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 13 · Comenta TARJETICA */
const CtaScene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  const a = s(V.k1.at - 0.05);
  const wordAt = s(wordTime("k1", "tarjetica") - 0.1);
  const pTop = spring({ frame: frame - a, fps, config: { damping: 15, stiffness: 180 } });
  const pWord = frame >= wordAt ? spring({ frame: frame - wordAt, fps, config: { damping: 11, stiffness: 170 } }) : 0;
  const typeFrom = wordAt + 10;
  const typed = copy.cta.word.slice(0, Math.max(0, Math.min(copy.cta.word.length, Math.floor((frame - typeFrom) / 3))));
  const sentAt = typeFrom + copy.cta.word.length * 3 + 8;
  const replyAt = sentAt + 22;
  const reply = frame >= replyAt ? spring({ frame: frame - replyAt, fps, config: { damping: 15, stiffness: 150 } }) : 0;
  const bob = Math.sin(t * 5) * 8;
  return (
    <Scene id="cta">
      <DarkBg glow={1.3} y={900} />
      <div style={{ position: "absolute", left: 0, width: 960, top: 300, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.white, letterSpacing: "-0.04em" }}>
        <div style={{ fontSize: 110, opacity: Math.min(1, pTop * 1.5), transform: `scale(${1.2 - 0.2 * pTop})` }}>{copy.cta.top}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 24, marginTop: 14, transform: `scale(${pWord})` }}>
          <span style={{ fontSize: 132, background: C.highlight, color: C.ink, padding: "0.04em 0.18em 0", borderRadius: "0.12em", boxShadow: "0 20px 60px rgba(143,227,192,0.4)" }}>{copy.cta.word}</span>
          <span style={{ fontSize: 100, color: C.highlight, transform: `translateY(${bob}px)`, display: "inline-block" }}>↓</span>
        </div>
      </div>
      {/* comentarios */}
      <PopIn at={a + 6} x={110} y={760} w={740}>
        <Glass w={740} pad={30}>
          <div style={{ textAlign: "center", fontSize: 30, fontWeight: 800 }}>Comentarios</div>
          {copy.cta.users.map((u, i) => {
            const at = a + 14 + i * 8;
            return (
              <div key={u} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20, opacity: ease(frame, at, 8) }}>
                <Avatar letter={u[0].toUpperCase()} color={i ? C.warm : C.cold} size={52} />
                <span style={{ fontSize: 26, fontWeight: 700, opacity: 0.7 }}>{u}</span>
                <span style={{ fontSize: 28, fontWeight: 800 }}>{copy.cta.word}</span>
              </div>
            );
          })}
          {frame >= sentAt ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20 }}>
              <Avatar letter="T" color={C.highlight} size={52} />
              <span style={{ fontSize: 26, fontWeight: 700, opacity: 0.7 }}>tu_negocio</span>
              <span style={{ fontSize: 28, fontWeight: 800 }}>{copy.cta.word}</span>
            </div>
          ) : null}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26, padding: "16px 20px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.greenMid }} />
            <span style={{ flex: 1, fontSize: 28, fontWeight: 600, opacity: typed && frame < sentAt ? 1 : 0.5 }}>{typed && frame < sentAt ? typed : copy.cta.comment}</span>
            <span style={{ fontSize: 26, fontWeight: 800, color: typed && frame < sentAt ? C.highlight : "rgba(143,227,192,0.4)" }}>Publicar</span>
          </div>
        </Glass>
      </PopIn>
      {reply > 0 ? (
        <div style={{ position: "absolute", left: 110, top: 1200, transform: `translateY(${(1 - reply) * 60}px)`, opacity: Math.min(1, reply * 1.5) }}>
          <div style={{ width: 740, display: "flex", alignItems: "center", gap: 18, padding: "20px 24px", borderRadius: 28, background: "rgba(40,46,50,0.95)", border: "1.5px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", fontFamily: font, color: C.white }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="40" height="40" viewBox="0 0 24 24">
                <rect x="3" y="6" width="18" height="12" rx="3" fill="none" stroke="#fff" strokeWidth="2" />
                <circle cx="8.5" cy="12" r="1.4" fill="#fff" />
                <circle cx="12" cy="12" r="1.4" fill="#fff" />
                <circle cx="15.5" cy="12" r="1.4" fill="#fff" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>{copy.cta.reply}</div>
              <div style={{ fontSize: 26, opacity: 0.85 }}>{copy.cta.replyBody}</div>
            </div>
          </div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, width: 960, top: 1540, display: "flex", justifyContent: "center", opacity: ease(frame, replyAt + 10, 12) }}>
        <Logo height={84} color={C.white} />
      </div>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Titulares, cortes y grano */
const SCENE_OF: Record<string, SceneId> = {
  h1: "wash", h2: "wash", p1: "lost", p2: "lost", p3: "lost", g1: "guess", m1: "brand", q1: "qr", c1: "pay", c2: "pay",
  d1: "gone", d2: "gone", n1: "near", n2: "near", v1: "back", v2: "back", a1: "push", a2: "push", a3: "push", t1: "colors", f1: "free",
};
const TOP: Record<string, number> = { g1: 830, p2: 760, p3: 760, f1: 330 };
const Headlines: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = (x: number) => Math.round(x * fps);
  const list: { text: string; at: number; scene: SceneId; id: string }[] = [];
  for (const v of VOICE) for (const [text, needle] of headlines[v.id] ?? []) list.push({ text, at: Math.max(wordTime(v.id, needle) - 0.05, S[SCENE_OF[v.id]].from + 0.05), scene: SCENE_OF[v.id], id: v.id });
  return (
    <>
      {list.map((h, i) => {
        const next = list[i + 1];
        const end = next && next.scene === h.scene ? next.at - 0.1 : S[h.scene].to - 0.1;
        const len = Math.max(...h.text.split("\n").map((l) => l.replace(/[[\]]/g, "").length));
        return <Headline key={i} text={h.text} at={s(h.at)} exitAt={s(end)} size={len > 17 ? 84 : len > 13 ? 100 : 116} top={TOP[h.id] ?? 262} />;
      })}
    </>
  );
};

const Cuts: React.FC = () => {
  const { frame, s } = useT();
  let o = 0;
  for (const id of Object.keys(S) as SceneId[]) {
    if (id === "wash") continue;
    const c = s(S[id].from);
    o = Math.max(o, interpolate(frame, [c - 3, c, c + 4], [0, 0.5, 0], clamp));
  }
  return o > 0 ? <AbsoluteFill style={{ background: "#000", opacity: o }} /> : null;
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundImage: `url(${staticFile("grain.png")})`, backgroundPosition: `${(frame * 137) % 512}px ${(frame * 251) % 512}px`, opacity: 0.06, mixBlendMode: "overlay", pointerEvents: "none" }} />;
};

/* ------------------------------------------------------------------ */
/* Audio */
const musicVolume = (f: number, fps: number, total: number) => {
  const t = f / fps;
  const speaking = VOICE.some((v) => t > V[v.id].at - 0.15 && t < V[v.id].end + 0.15);
  const near = VOICE.reduce((m, v) => Math.min(m, Math.abs(t - V[v.id].at), Math.abs(t - V[v.id].end)), 9);
  const base = speaking ? audio.music.duckTo : audio.music.duckTo + (audio.music.volume - audio.music.duckTo) * Math.min(1, near / 0.3);
  return base * Math.min(1, t / 0.4) * Math.min(1, (total / fps - t) / 1.4);
};
const Sfx: React.FC<{ at: number; file: string; vol: number }> = ({ at, file, vol }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at * fps))} layout="none">
      <Html5Audio src={staticFile(`sfx/${file}.mp3`)} volume={vol} />
    </Sequence>
  );
};
/** Efectos: el "whoosh" de cada corte termina antes de la primera palabra para no taparla. */
const ctaSent = V.k1.at + 0.1 + (copy.cta.word.length * 3 + 18) / 30;
export const SFX: [number, string, number][] = [
  ...(Object.keys(S) as SceneId[]).filter((id) => id !== "wash").map((id) => [S[id].from - 0.45, "whoosh-soft", 0.22] as [number, string, number]),
  [wordTime("h2", "lavadora") - 0.1, "ring-pulse", 0.3],
  [wordTime("p1", "pierde"), "pop", 0.25],
  [wordTime("p1", "moja"), "pop", 0.25],
  [wordTime("p1", "olvida"), "pop", 0.25],
  [wordTime("q1", "ninguna") + 0.07, "tap", 0.35],
  [wordTime("c1", "paga"), "tap", 0.35],
  [wordTime("c1", "sello"), "notification", 0.4],
  [wordTime("c2", "corte"), "pop", 0.35],
  [wordTime("n1", "cerca"), "ring-pulse", 0.3],
  [wordTime("n1", "avisa") - 0.15, "notification", 0.45],
  [wordTime("n1", "avisa") - 0.1, "haptic", 0.3],
  [wordTime("v2", "panel") - 0.1, "pop", 0.4],
  [wordTime("a2", "listo") - 0.15, "tap", 0.35],
  [V.a3.at - 0.2 + 12 / 30, "notification", 0.35],
  [V.a3.at - 0.2 + 17 / 30, "notification", 0.3],
  [wordTime("f1", "veinte") - 0.3, "pop", 0.3],
  [ctaSent, "tap", 0.4],
  [ctaSent + 22 / 30, "notification", 0.4],
];

export const CamiloVuelve: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <WashScene />
      <LostScene />
      <GuessScene />
      <BrandScene />
      <QrScene />
      <PayScene />
      <GoneScene />
      <NearScene />
      <BackScene />
      <PushScene />
      <ColorsScene />
      <FreeScene />
      <CtaScene />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 60%, rgba(0,0,0,0.4) 100%)", pointerEvents: "none" }} />
      <Headlines />
      <Karaoke hide={(id) => id === "k1" || id === "m0"} />
      <Cuts />
      <Grain />
      <Html5Audio src={staticFile(audio.music.file)} volume={(f) => musicVolume(f, fps, durationInFrames)} />
      {VOICE.filter((v) => getStaticFiles().some((f) => f.name === `voz/${v.id}.wav`)).map((v) => (
        <Sequence key={v.id} from={Math.round(V[v.id].at * fps)} layout="none">
          <Html5Audio src={staticFile(`voz/${v.id}.wav`)} volume={audio.voice.volume} />
        </Sequence>
      ))}
      {SFX.map(([at, f, vol], i) => (
        <Sfx key={i} at={at} file={f} vol={vol} />
      ))}
    </AbsoluteFill>
  );
};

export { DURATION_SEC };
