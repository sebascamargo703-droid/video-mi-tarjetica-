import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Html5Audio, Sequence, getStaticFiles, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { audio, brand } from "./brand";
import { copy, headlines } from "./copy";
import { font, logoFont } from "./fonts";
import { Logo } from "./components/Logo";
import { Stage } from "./three/Stage";
import { useCanvasTexture } from "./three/textures";
import { toScreen, type Cam, type V3 } from "./three/camera";
import { BarberPole, Card3D, Counter, Disc3D, GlossFloor, Phone3D, Plate, Tablet3D, Washer3D, type Layer } from "./three/Devices";
import { Glow, Person, StreetLamp } from "./three/Props";
import { Geofence } from "./three/Geofence";
import { EASE_IN, EASE_INOUT, clamp, ease } from "./motion";
import { CX, Headline, Karaoke } from "./ui";
import { DURATION_SEC, SCENES, type SceneId, V, VOICE, wordTime } from "./timeline";

const C = brand.colors;
const S = SCENES;

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps, s: (x: number) => Math.round(x * fps) };
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerp3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const sp = (frame: number, fps: number, at: number, damping = 15, stiffness = 150) => (frame >= at ? spring({ frame: frame - at, fps, config: { damping, stiffness } }) : 0);
/** Capas de pantalla: cada estado entra con fundido de 5 cuadros en su cuadro `at`. */
const layers = (frame: number, list: [string, number][]): Layer[] =>
  list.map(([src, at], i) => [src, i === 0 ? 1 : interpolate(frame, [at, at + 5], [0, 1], clamp)] as Layer).filter(([, o], i, arr) => o > 0 && !arr.slice(i + 1).some(([, o2]) => o2 >= 1));

/* ------------------------------------------------------------------ */
/* Piezas comunes */

/** Fondo oscuro con un halo verde que respira (detrás del lienzo 3D transparente). */
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

/** Partículas de luz menta flotando. */
const Motes: React.FC<{ n?: number; spread?: V3; seed?: string; color?: string; center?: V3 }> = ({ n = 30, spread = [7, 8, 5], seed = "m", color = "#8FE3C0", center = [0, 0, 0] }) => {
  const { t } = useT();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const x = center[0] + (random(`${seed}x${i}`) - 0.5) * spread[0];
        const y = center[1] + (random(`${seed}y${i}`) - 0.5) * spread[1] + ((t * (0.06 + random(`${seed}v${i}`) * 0.1)) % 1) * 1.2;
        const z = center[2] + (random(`${seed}z${i}`) - 0.5) * spread[2] - 1;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.02 + random(`${seed}s${i}`) * 0.03, 8, 6]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} toneMapped={false} />
          </mesh>
        );
      })}
    </>
  );
};

/** Textura de la tarjeta de papel (la que se pierde). */
const drawPaper = (c: CanvasRenderingContext2D, w: number, h: number) => {
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
    if (i < 9) {
      c.fillStyle = "rgba(201,71,63,0.85)";
      c.beginPath();
      c.arc(x + 2, y + 1, 24, 0, Math.PI * 2);
      c.fill();
    }
  }
  c.fillStyle = "rgba(107,74,46,0.5)";
  c.fillRect(36, 282, 260, 3);
};
const usePaper = () => useCanvasTexture("tarjeta-papel", 512, 320, drawPaper);

/** Etiqueta 2D anclada a un punto 3D. */
const Label: React.FC<{ p: V3; cam: Cam; children: React.ReactNode; dy?: number; o?: number }> = ({ p, cam, children, dy = 0, o = 1 }) => {
  const q = toScreen(p, cam);
  return <div style={{ position: "absolute", left: q.x, top: q.y + dy, transform: "translate(-50%, 0)", opacity: o, whiteSpace: "nowrap" }}>{children}</div>;
};

/* ------------------------------------------------------------------ */
/* 1 · La tarjeta en la lavadora */
const PaperWasher: React.FC<{ spin: number; shake: number }> = ({ spin, shake }) => {
  const paper = usePaper();
  return <Washer3D spin={spin} shake={shake} cardTex={paper} />;
};
const WashScene: React.FC = () => {
  const { frame, t, s } = useT();
  const la = wordTime("h2", "lavadora") - 0.1;
  const fast = Math.max(0, t - la);
  const spin = t * 0.9 + fast * fast * 5;
  const k = EASE_INOUT(Math.min(1, t / S.wash.to));
  const cam: Cam = { pos: lerp3([1.6, 1.0, 8.4], [0.25, 0.0, 4.4], k), target: lerp3([0, -0.05, 0], [0, -0.12, 0], k), fov: 35 };
  const shake = ease(frame, s(la), 10);
  return (
    <Scene id="wash">
      <DarkBg glow={0.8} y={1000} />
      <Stage cam={cam} env={1} exposure={1.05}>
        <GlossFloor y={-1.15} />
        <PaperWasher spin={spin} shake={shake} />
        <Motes seed="w" spread={[6, 6, 4]} n={20} />
      </Stage>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,8,11,0.78) 0%, rgba(5,8,11,0.25) 24%, rgba(5,8,11,0) 34%)" }} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 2 · Tarjetas de papel que caen, se mojan y se pierden */
const PAPER_TINTS = ["#F3EAD6", "#CDEBDD", "#F4D3DA", "#D6E2F5", "#F7E3B5"];
const PaperCards: React.FC<{ tau: number; wet: number; lost: number }> = ({ tau, wet, lost }) => {
  const tex = usePaper();
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
      <Stage cam={{ pos: [Math.sin(t * 0.3) * 0.6, 0.2, 10], target: [0, 0, 0], fov: 40 }} env={0.9 - 0.5 * dim} exposure={1.1 - 0.4 * dim}>
        <GlossFloor y={-4.5} />
        <PaperCards tau={tau} wet={wet} lost={lost} />
      </Stage>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)", opacity: 0.5 + 0.5 * dim }} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 3 · ¿Adivina quién sí vuelve? — un celular sube desde la oscuridad */
const GuessScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const a = s(S.guess.from);
  const rise = sp(frame, fps, a, 18, 70);
  const on = ease(frame, s(V.g1.end - 0.4), 12);
  return (
    <Scene id="guess">
      <DarkBg glow={0.5 + 0.8 * on} y={1000} />
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${t * 12}deg at ${CX}px 980px, rgba(143,227,192,0.09) 0deg 5deg, transparent 5deg 15deg)`,
          maskImage: "radial-gradient(circle at 480px 980px, black 0%, transparent 55%)",
          opacity: 0.3 + 0.7 * on,
        }}
      />
      <Stage cam={{ pos: [0.6, -0.3, 5.6], target: [0, 0.05, 0], fov: 35 }} env={0.7} exposure={1.1}>
        <Phone3D position={[0, -3.2 * (1 - rise), 0]} rotation={[0.08, -0.7 + 0.55 * rise + Math.sin(t * 0.8) * 0.05, 0.04]} scale={0.95} screens={[["screens/lock.png", on]]} glow={on} />
        <pointLight position={[0, 1.5, -1.5]} intensity={6} distance={6} color="#8FE3C0" />
        <Motes seed="g" n={26} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 4 · Mi Tarjetica: la tarjeta de papel entra al celular */
const FlyingPaper: React.FC<{ fly: number; t: number; o: number }> = ({ fly, t, o }) => {
  const paper = usePaper();
  if (!paper) return null;
  return (
    <mesh position={lerp3([-1.4, 1.1, 0.8], [0, 0.1, 0.12], fly)} rotation={[0.3 * (1 - fly), 0.6 * (1 - fly) + fly * 0.3, -0.4 + 0.4 * fly + (1 - fly) * t]} scale={1 - 0.55 * fly}>
      <boxGeometry args={[0.9, 0.56, 0.01]} />
      <meshStandardMaterial map={paper} roughness={0.6} transparent opacity={o} />
    </mesh>
  );
};
const BrandScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const logoAt = s(V.m0.at - 0.05);
  const logoIn = sp(frame, fps, logoAt, 14, 120);
  const logoOut = ease(frame, s(V.m1.at - 0.1), 14, EASE_IN);
  const phAt = s(V.m1.at + 0.05);
  const ph = sp(frame, fps, phAt, 16, 90);
  const flyAt = s(wordTime("m1", "celular") - 0.55);
  const fly = ease(frame, flyAt, 18, EASE_INOUT);
  const arrived = s(wordTime("m1", "celular") + 0.05);
  const flash = interpolate(frame, [arrived - 2, arrived + 2, arrived + 14], [0, 1, 0], clamp);
  return (
    <Scene id="brand">
      <DarkBg y={980} glow={1 + 0.5 * flash} />
      <Stage cam={{ pos: [0.35 + Math.sin(t * 0.4) * 0.2, 0.2, 5.6], target: [0, 0.05, 0], fov: 35 }} env={1} exposure={1.1}>
        {logoOut < 1 ? (
          <group position={[0, 0.1 + logoOut * 1.8, -logoOut * 2]} rotation={[0, Math.sin(t * 1.2) * 0.25 * (1 - logoIn * 0.6), 0]} scale={0.6 + 0.4 * logoIn}>
            <Plate src="screens/logo.png" w={1.9} h={0.646} opacity={Math.min(1, logoIn * 1.4) * (1 - logoOut)} />
            <Glow position={[0, 0, -0.2]} size={3.2} color="#16705D" opacity={0.5 * logoIn * (1 - logoOut)} />
          </group>
        ) : null}
        {ph > 0 ? (
          <Phone3D
            position={[2.6 * (1 - ph), -0.05, 0]}
            rotation={[0.05, -Math.PI * 1.1 * (1 - ph) - 0.22 + Math.sin(t * 0.9) * 0.06, 0.03 * (1 - ph)]}
            scale={0.92}
            screens={[["screens/w-s0.png", 1], ["screens/w-s4.png", interpolate(frame, [arrived, arrived + 6], [0, 1], clamp)]]}
            brightness={1 + 0.4 * flash}
            glow={flash}
          />
        ) : null}
        {frame >= flyAt - 14 && fly < 1 ? <FlyingPaper fly={fly} t={t} o={Math.min(1, (frame - flyAt + 14) / 6) * (1 - ease(frame, arrived - 5, 5))} /> : null}
        <Motes seed="b" n={26} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 5 · Escanea el QR del mostrador, sin descargar app */
const QrScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const a = s(S.qr.from);
  const inn = sp(frame, fps, a, 16, 110);
  const addAt = s(wordTime("q1", "sin") - 0.1);
  const scanned = frame >= addAt;
  const cam: Cam = { pos: [0.4 + Math.sin(t * 0.35) * 0.25, 0.9, 6.9], target: [0.05, -0.25, 0], fov: 35 };
  return (
    <Scene id="qr">
      <DarkBg y={1000} />
      <Stage cam={cam} env={1} exposure={1.08}>
        <Counter position={[0, -1, 0]} />
        <group position={[-0.62, -1 + 0.78, -0.15]} rotation={[-0.12, 0.38, 0]}>
          <Card3D src="screens/sign.png" w={0.98} h={1.53} depth={0.05} back={C.cream} />
          {!scanned ? (
            <mesh position={[0, -0.32 + (Math.sin((frame - a) / 5) * 0.5 + 0.5) * 0.62, 0.05]} renderOrder={10}>
              <planeGeometry args={[0.62, 0.012]} />
              <meshBasicMaterial color="#69D3BE" toneMapped={false} transparent opacity={0.95} />
            </mesh>
          ) : null}
        </group>
        <mesh position={[-0.62, -0.97, -0.25]} castShadow>
          <boxGeometry args={[0.7, 0.06, 0.35]} />
          <meshStandardMaterial color="#1F2A33" roughness={0.4} />
        </mesh>
        <Phone3D
          position={[0.72, -0.05 - (1 - inn) * 2.5, 0.85]}
          rotation={[-0.05, -0.55 + 0.1 * Math.sin(t * 0.7), 0.06]}
          scale={0.78}
          screens={layers(frame, [["screens/cam.png", 0], ["screens/add.png", addAt]])}
          glow={scanned ? 0.4 : 0}
        />
        {!scanned ? (
          <mesh position={[0.1, -0.15, 0.4]} rotation={[0, -0.9, 0]} renderOrder={10}>
            <planeGeometry args={[1.3, 0.004]} />
            <meshBasicMaterial color="#8FE3C0" toneMapped={false} transparent opacity={0.35 + 0.3 * Math.sin(t * 8)} />
          </mesh>
        ) : null}
        <Motes seed="q" n={18} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 6 · Camilo paga y el sello llega solo */
const PayScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const a = s(S.pay.from);
  const payAt = s(wordTime("c1", "paga"));
  const stampAt = s(wordTime("c1", "sello"));
  const tok = interpolate(frame, [payAt + 4, stampAt + 2], [0, 1], { ...clamp, easing: EASE_INOUT });
  const zoom = ease(frame, s(V.c2.at - 0.15), 26, EASE_INOUT);
  const medalAt = s(wordTime("c2", "corte") - 0.05);
  const medal = sp(frame, fps, medalAt, 10, 150);
  const from: V3 = [-0.55, -0.32, 0.1];
  const to: V3 = [0.72, 0.05, 0.55];
  const tp = lerp3(from, to, tok);
  tp[1] += Math.sin(tok * Math.PI) * 0.9;
  const cam: Cam = {
    pos: lerp3([0.1 + Math.sin(t * 0.3) * 0.2, 0.75, 6.2], [0.8, 0.25, 4.2], zoom),
    target: lerp3([0, -0.25, 0], [0.6, -0.08, 0.4], zoom),
    fov: 35,
  };
  return (
    <Scene id="pay">
      <DarkBg y={1000} />
      <Stage cam={cam} env={1} exposure={1.08}>
        <Counter position={[0, -1, 0]} />
        <Tablet3D position={[-0.82, -0.32, -0.35]} rotation={[-0.22, 0.42, 0]} scale={0.55} screens={layers(frame, [["screens/pos-a.png", 0], ["screens/pos-b.png", stampAt]])} />
        <Phone3D
          position={[0.72, -0.08 - (1 - sp(frame, fps, a + 3, 16, 110)) * 2.5, 0.45]}
          rotation={[-0.06, -0.38 + 0.25 * zoom, 0.02]}
          scale={0.78}
          screens={layers(frame, [["screens/w-s3.png", 0], ["screens/w-s4-banner.png", stampAt], ["screens/w-s4.png", stampAt + 45], ["screens/w-s4-pulse.png", s(wordTime("c2", "cinco"))]])}
          glow={interpolate(frame, [stampAt, stampAt + 4, stampAt + 20], [0, 1, 0], clamp)}
        />
        {tok > 0 && tok < 1 ? <Disc3D src="screens/token.png" r={0.14} t={0.04} position={tp} rotation={[0.3, tok * 9, 0]} edge="#F6F2EA" metal={false} /> : null}
        {medal > 0 ? (
          <group position={[0.3, -0.34 + 0.06 * Math.sin(t * 2), 0.95]} scale={medal * 0.8} rotation={[0.1, -0.6 + Math.sin(t * 1.5) * 0.35, 0.1]}>
            <Disc3D src="screens/medal.png" r={0.3} t={0.06} />
            <Glow position={[0, 0, -0.1]} size={1.4} color="#E8B84A" opacity={0.35} />
          </group>
        ) : null}
        <Motes seed="p" n={18} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 7 · Camilo deja de venir: su tarjeta se apaga y los días suben */
const GoneScene: React.FC = () => {
  const { frame, t, s } = useT();
  const from = s(wordTime("d1", "deja"));
  const to = s(V.d2.end);
  const days = Math.round(interpolate(frame, [from, to], [1, 47], { ...clamp, easing: EASE_INOUT }));
  const grey = ease(frame, from, 40);
  const tint = new THREE.Color("#ffffff").lerp(new THREE.Color("#6E757B"), grey);
  return (
    <Scene id="gone">
      <DarkBg glow={0.6 - 0.4 * grey} y={800} />
      <Stage cam={{ pos: [Math.sin(t * 0.25) * 0.6, 0.85 - 0.1 * grey, 5.4 - 0.4 * grey], target: [0, 0.3, 0], fov: 35 }} env={1 - 0.5 * grey} exposure={1.1 - 0.3 * grey}>
        <GlossFloor y={-0.5} />
        <Card3D src="screens/pass.png" w={0.64} h={0.875} depth={0.025} position={[0, 0.72, 0]} rotation={[-0.08, -0.3 + Math.sin(t * 0.4) * 0.12, 0.02]} tint={tint} back="#2A3138" />
        <Motes seed="d" n={30} color="#9AA4AC" spread={[5, 5, 4]} />
      </Stage>
      <div style={{ position: "absolute", left: 0, width: 960, top: 1050, textAlign: "center", fontFamily: font, color: C.white, opacity: ease(frame, from - 4, 10) }}>
        <div style={{ fontSize: 190, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", color: C.red, textShadow: "0 0 50px rgba(255,90,82,0.35)" }}>{days}</div>
        <div style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 48, marginTop: 2, opacity: 0.85 }}>{copy.days}</div>
      </div>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 8 · La calle: Camilo pasa cerca de la barbería y su celular le avisa */
const Building: React.FC<{ x: number; w: number; h: number; color: string; seed: number }> = ({ x, w, h, color, seed }) => (
  <group position={[x, 0, -2.2]}>
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[w, h, 3]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
    {Array.from({ length: Math.floor(h / 1.2) - 1 }).map((_, r) =>
      Array.from({ length: Math.max(1, Math.floor(w / 1.1)) }).map((__, c) => {
        const lit = random(`win${seed}-${r}-${c}`) > 0.45;
        return (
          <mesh key={`${r}-${c}`} position={[(c - (Math.max(1, Math.floor(w / 1.1)) - 1) / 2) * 1.05, 1.9 + r * 1.2, 1.505]}>
            <planeGeometry args={[0.55, 0.7]} />
            <meshStandardMaterial color={lit ? "#FFD9A0" : "#1C2630"} emissive={lit ? "#FFB866" : "#000"} emissiveIntensity={lit ? 0.9 : 0} />
          </mesh>
        );
      }),
    )}
  </group>
);

const Barbershop: React.FC<{ t: number }> = ({ t }) => (
  <group position={[0, 0, -2.2]}>
    <mesh position={[0, 1.75, 0]} castShadow receiveShadow>
      <boxGeometry args={[3.4, 3.5, 3]} />
      <meshStandardMaterial color="#2B3A45" roughness={0.7} />
    </mesh>
    {/* vitrina iluminada */}
    <mesh position={[-0.55, 1.05, 1.505]}>
      <planeGeometry args={[1.9, 1.5]} />
      <meshStandardMaterial color="#FFE2B0" emissive="#FFB866" emissiveIntensity={1.1} />
    </mesh>
    {[-1.2, -0.55, 0.1].map((x) => (
      <mesh key={x} position={[x, 0.75, 1.51]}>
        <boxGeometry args={[0.32, 0.55, 0.02]} />
        <meshStandardMaterial color="#1B1B1B" roughness={0.5} />
      </mesh>
    ))}
    {/* puerta */}
    <mesh position={[1.05, 0.95, 1.505]}>
      <planeGeometry args={[0.85, 1.9]} />
      <meshStandardMaterial color="#14191D" roughness={0.3} metalness={0.4} />
    </mesh>
    <Plate src="screens/facade.png" w={2.9} h={0.62} position={[0, 2.75, 1.52]} lit={false} />
    <BarberPole position={[1.6, 1.4, 1.62]} t={t} scale={0.9} />
    <pointLight position={[-0.5, 1.2, 2.6]} intensity={5} distance={5} color="#FFB866" />
    <Glow position={[-0.55, 1.1, 1.7]} size={3} color="#FFB866" opacity={0.35} />
  </group>
);

const NearScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const a = S.near.from;
  const stopAt = wordTime("n1", "avisa") - 0.1;
  const walkT = Math.min(t, stopAt) - a;
  const cx = -3.4 + walkT * 1.05;
  const fenceOn = ease(frame, s(wordTime("n1", "cerca") - 0.1), 18);
  const notifAt = s(wordTime("n1", "avisa") - 0.15);
  const n = sp(frame, fps, notifAt, 13, 140);
  const pulse = ((t - a) * 0.7) % 1;
  const flash = interpolate(frame, [notifAt, notifAt + 4, notifAt + 20], [0, 1, 0], clamp);
  const cam: Cam = { pos: [cx * 0.35 + 0.6, 4.6, 13.5], target: [cx * 0.3 + 0.2, 1.3, -0.8], fov: 38 };
  return (
    <Scene id="near">
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #0B1622 0%, #13232E 45%, #0A1014 100%)" }} />
      <Stage cam={cam} env={0.45} exposure={0.95}>
        {/* andén y calle */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#1A2026" roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.06, -0.1]} receiveShadow>
          <boxGeometry args={[40, 0.12, 2.6]} />
          <meshStandardMaterial color="#5A6168" roughness={0.8} />
        </mesh>
        {[-12, -8, -4, 0, 4, 8, 12].map((x) => (
          <mesh key={x} position={[x, 0.015, 3.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.6, 0.12]} />
            <meshBasicMaterial color="#C9CDD1" />
          </mesh>
        ))}
        <Building x={-4.3} w={4.6} h={6} color="#5B4A3E" seed={1} />
        <Barbershop t={t} />
        <Building x={4.2} w={4.4} h={5} color="#3E5248" seed={2} />
        <StreetLamp position={[-2.4, 0, 1.0]} />
        <StreetLamp position={[3.2, 0, 1.0]} />
        <Geofence center={[0.3, 0.06, 0.4]} r={2.6} on={fenceOn} pulse={fenceOn > 0.5 ? pulse : 0} flash={flash} />
        <Person position={[cx, 0.12, 0.35]} rot={Math.PI / 2 - 0.15} walk={t < stopAt ? walkT * 7 : undefined} shirt="#1F4A3C" pants="#2A2F3A" seed={3} phone lookDown />
        {n > 0 ? (
          <group position={[cx + 0.6, 2.3 + 0.05 * Math.sin(t * 2), 1.6]} rotation={[-0.22, -0.05, 0]} scale={n}>
            <Plate src="screens/notif-near.png" w={3.3} h={1.226} />
          </group>
        ) : null}
        <Glow position={[cx + 0.22, 1.2, 0.67]} size={0.5 + 1.2 * flash} color="#8FE3C0" opacity={0.6 + 0.4 * flash} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 9 y 10 · El panel en la tablet: Camilo volvió; aviso a los que no vuelven */
const BackScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const a = s(S.back.from);
  const inn = sp(frame, fps, a, 16, 100);
  const backAt = s(V.v1.at + 0.1);
  const stAt = s(wordTime("v2", "panel") - 0.15);
  const st = sp(frame, fps, stAt, 11, 160);
  return (
    <Scene id="back">
      <DarkBg y={1000} />
      <Stage cam={{ pos: [0.3 + Math.sin(t * 0.3) * 0.3, 0.6, 6], target: [0, 0, 0], fov: 35 }} env={1} exposure={1.08}>
        <Counter position={[0, -0.95, 0]} />
        <Tablet3D position={[0, 0.05 - (1 - inn) * 3, 0]} rotation={[-0.12, -0.18 + Math.sin(t * 0.5) * 0.05, 0]} scale={0.85} screens={layers(frame, [["screens/pan-a.png", 0], ["screens/pan-b.png", backAt]])} />
        {st > 0 ? (
          <group position={[0.42, -0.48 + 2.2 * (1 - st), 1.0]} rotation={[-0.35, -0.25, -0.25 + (1 - st) * 2]} scale={0.8}>
            <Disc3D src="screens/volvio.png" r={0.36} t={0.06} edge="#8FE3C0" metal={false} emissive={0.15} />
          </group>
        ) : null}
        <Motes seed="v" n={20} />
      </Stage>
    </Scene>
  );
};

const PushScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const selAt = s(V.a1.at + 0.3);
  const cmpAt = s(V.a2.at - 0.05);
  const sendAt = s(wordTime("a2", "listo") - 0.15);
  const phonesAt = s(V.a3.at - 0.25);
  const back = ease(frame, phonesAt - 6, 16, EASE_INOUT);
  const cam: Cam = { pos: lerp3([0.3 + Math.sin(t * 0.3) * 0.3, 0.6, 6], [0, 0.9, 6.4], back), target: lerp3([0, 0, 0], [0, -0.05, 0.6], back), fov: 35 };
  return (
    <Scene id="push">
      <DarkBg y={1000} />
      <Stage cam={cam} env={1} exposure={1.08}>
        <Counter position={[0, -0.95, 0]} />
        <Tablet3D
          position={[0, 0.05 + back * 0.5, -back * 2.2]}
          rotation={[-0.12, -0.18, 0]}
          scale={0.85}
          screens={layers(frame, [["screens/pan-b.png", 0], ["screens/pan-c.png", selAt], ["screens/cmp-a.png", cmpAt], ["screens/cmp-b.png", cmpAt + 10], ["screens/cmp-c.png", sendAt]])}
        />
        {frame >= sendAt && frame < phonesAt + 20
          ? [0, 1].map((i) => {
              const k = interpolate(frame, [sendAt + 2 + i * 3, phonesAt + 14 + i * 3], [0, 1], { ...clamp, easing: EASE_INOUT });
              if (k <= 0 || k >= 1) return null;
              const p = lerp3([0, 0.1 + back * 0.5, -back * 2.2 + 0.2], [i ? 0.5 : -0.5, -0.1, 0.9], k);
              p[1] += Math.sin(k * Math.PI) * 0.8;
              return (
                <group key={i} position={p}>
                  <mesh>
                    <sphereGeometry args={[0.05, 12, 10]} />
                    <meshBasicMaterial color="#8FE3C0" toneMapped={false} />
                  </mesh>
                  <Glow position={[0, 0, 0]} size={0.6} color="#8FE3C0" opacity={0.9} />
                </group>
              );
            })
          : null}
        {[0, 1].map((i) => {
          const p = sp(frame, fps, phonesAt + i * 4, 15, 120);
          if (p <= 0) return null;
          const notif = phonesAt + 12 + i * 3;
          return (
            <Phone3D
              key={i}
              position={[i ? 0.5 : -0.5, -0.12 - (1 - p) * 2.4, 0.9]}
              rotation={[-0.08, i ? -0.3 : 0.3, 0]}
              scale={0.62}
              screens={layers(frame, [["screens/lock.png", 0], ["screens/lock-push.png", notif]])}
              glow={interpolate(frame, [notif, notif + 4, notif + 18], [0, 1, 0], clamp)}
            />
          );
        })}
        <Motes seed="a" n={20} />
      </Stage>
      {frame >= phonesAt + 12
        ? copy.push.names.map((name, i) => (
            <Label key={name} p={[i ? 0.5 : -0.5, -0.12 + 0.62 * 0.8, 0.9]} cam={cam} dy={-62} o={ease(frame, phonesAt + 14 + i * 3, 8)}>
              <div style={{ fontFamily: font, fontSize: 30, fontWeight: 800, color: C.white }}>
                {name} <span style={{ color: C.highlight }}>· {copy.push.sent}</span>
              </div>
            </Label>
          ))
        : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 11 · Tu tarjeta con tu logo y tus colores: cuatro tarjetas 3D */
const ColorsScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const a = s(S.colors.from);
  return (
    <Scene id="colors">
      <DarkBg y={1000} />
      <Stage cam={{ pos: [Math.sin(t * 0.5) * 0.8, 0.6, 7.6], target: [0, 0.0, 0], fov: 35 }} env={1.1} exposure={1.1}>
        <GlossFloor y={-1.6} />
        {copy.brands.map((b, i) => {
          const p = sp(frame, fps, a + 3 + i * 7, 14, 110);
          if (p <= 0) return null;
          const off = i - 1.5;
          return (
            <Card3D
              key={b.name}
              src={`screens/mini-${i}.png`}
              w={1.5}
              h={0.92}
              r={0.09}
              depth={0.025}
              back={b.color}
              position={[off * 0.22, 0.9 - i * 0.5 - (1 - p) * 3, off * 0.25]}
              rotation={[-0.1, (1 - p) * Math.PI + off * 0.12 + Math.sin(t * 0.8 + i) * 0.08, off * -0.06]}
            />
          );
        })}
        <Motes seed="c" n={22} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 12 · Empieza gratis */
const FreeScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const a = s(S.free.from);
  const coin = sp(frame, fps, a + 2, 12, 120);
  const at = s(wordTime("f1", "veinte") - 0.3);
  return (
    <Scene id="free">
      <DarkBg glow={1.3} y={860} />
      <Stage cam={{ pos: [0, 0.2, 6], target: [0, -0.15, 0], fov: 35 }} env={1.1} exposure={1.1}>
        <group position={[0, 0.25, 0]} scale={coin} rotation={[0.15, (1 - coin) * 4 + Math.sin(t * 1.4) * 0.5, 0]}>
          <Disc3D src="screens/gratis.png" r={0.5} t={0.1} edge="#8FE3C0" metal={false} emissive={0.1} />
          <Glow position={[0, 0, -0.3]} size={3.4} color="#16705D" opacity={0.6} />
        </group>
        <Motes seed="f" n={30} />
      </Stage>
      {copy.free.chips.map((c, i) => {
        const p = sp(frame, fps, at + i * 6, 14, 160);
        return (
          <div key={c} style={{ position: "absolute", left: 0, width: 960, top: 1080 + i * 112, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 32px", borderRadius: 999, background: "rgba(143,227,192,0.12)", border: `2px solid ${C.highlight}`, fontFamily: font, fontSize: 38, fontWeight: 800, color: C.white }}>
              <span style={{ color: C.highlight }}>✓</span>
              {c}
            </div>
          </div>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 13 · Comenta TARJETICA */
const CtaScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const a = s(V.k1.at - 0.05);
  const wordAt = s(wordTime("k1", "tarjetica") - 0.1);
  const pTop = sp(frame, fps, a, 15, 180);
  const pWord = sp(frame, fps, wordAt, 11, 170);
  const ph = sp(frame, fps, a + 2, 16, 100);
  const typeAt = wordAt + 10;
  const sentAt = typeAt + 26;
  const replyAt = sentAt + 22;
  const bob = Math.sin(t * 5) * 8;
  return (
    <Scene id="cta">
      <DarkBg glow={1.3} y={1050} />
      <Stage cam={{ pos: [0.3 + Math.sin(t * 0.5) * 0.25, 0.1, 5.4], target: [0, -0.35, 0], fov: 35 }} env={1} exposure={1.1}>
        <Phone3D
          position={[0, -0.45 - (1 - ph) * 3, 0]}
          rotation={[0.04, -0.2 + Math.sin(t * 0.7) * 0.08, 0.02]}
          scale={1.1}
          screens={layers(frame, [["screens/cm-0.png", 0], ["screens/cm-1.png", typeAt], ["screens/cm-2.png", sentAt], ["screens/cm-3.png", replyAt]])}
          glow={interpolate(frame, [replyAt, replyAt + 4, replyAt + 20], [0, 1, 0], clamp)}
        />
        <Motes seed="k" n={30} />
      </Stage>
      <div style={{ position: "absolute", left: 0, width: 960, top: 250, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.white, letterSpacing: "-0.04em" }}>
        <div style={{ fontSize: 100, opacity: Math.min(1, pTop * 1.5), transform: `scale(${1.2 - 0.2 * pTop})`, textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>{copy.cta.top}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 22, marginTop: 10, transform: `scale(${pWord})` }}>
          <span style={{ fontSize: 124, background: C.highlight, color: C.ink, padding: "0.04em 0.18em 0", borderRadius: "0.12em", boxShadow: "0 20px 60px rgba(143,227,192,0.4)" }}>{copy.cta.word}</span>
          <span style={{ fontSize: 96, color: C.highlight, transform: `translateY(${bob}px)`, display: "inline-block" }}>↓</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 960, top: 1620, display: "flex", justifyContent: "center", opacity: ease(frame, replyAt + 10, 12) }}>
        <Logo height={80} color={C.white} />
      </div>
    </Scene>
  );
};

/* Titulares, cortes y grano */
const SCENE_OF: Record<string, SceneId> = {
  h1: "wash", h2: "wash", p1: "lost", p2: "lost", p3: "lost", g1: "guess", m1: "brand", q1: "qr", c1: "pay", c2: "pay",
  d1: "gone", d2: "gone", n1: "near", n2: "near", v1: "back", v2: "back", a1: "push", a2: "push", a3: "push", t1: "colors", f1: "free",
};
const TOP: Record<string, number> = { p2: 760, p3: 760 };
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
  [V.h2.end + 0.05, "ring-pulse", 0.25],
  [wordTime("p1", "pierde"), "pop", 0.25],
  [wordTime("p1", "moja"), "pop", 0.25],
  [wordTime("p1", "olvida"), "pop", 0.25],
  [wordTime("q1", "ninguna") + 0.07, "tap", 0.35],
  [wordTime("c1", "paga"), "tap", 0.35],
  [wordTime("c1", "sello"), "notification", 0.4],
  [wordTime("c2", "corte"), "pop", 0.35],
  [V.n1.at - 0.35, "ring-pulse", 0.18],
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
