import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Html5Audio, Sequence, getStaticFiles, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { audio, brand } from "./brand";
import { copy, headlines } from "./copy";
import { font, logoFont, tracking } from "./fonts";
import { Logo } from "./components/Logo";
import { PassCard } from "./components/PassCard";
import { Coin, Cup3D, GOLD, Member, ShadowFloor, Star3D } from "./three/Objects";
import { Stage } from "./three/Stage";
import { toScreen } from "./three/camera";
import { EASE, EASE_INOUT, clamp, ease, pop } from "./motion";
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
/* Piezas gráficas */

/** Estrella dorada de 5 puntas con degradado y brillo. */
export const Star: React.FC<{ size: number; glow?: number; style?: React.CSSProperties; id?: string; dim?: boolean }> = ({ size, glow = 0, style, id = "st", dim = false }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ overflow: "visible", filter: glow ? `drop-shadow(0 0 ${glow}px rgba(255,200,90,0.75))` : undefined, ...style }}>
    <defs>
      <linearGradient id={`g-${id}`} x1="0" y1="-1" x2="0" y2="1">
        <stop offset="0" stopColor={dim ? "#C9C1AE" : "#FFE6A3"} />
        <stop offset="0.55" stopColor={dim ? "#B3AA95" : "#E8B84A"} />
        <stop offset="1" stopColor={dim ? "#9C937E" : "#B8821F"} />
      </linearGradient>
    </defs>
    <path d="M0 -46 L13.5 -15 L46 -14 L21 8 L29 42 L0 24 L-29 42 L-21 8 L-46 -14 L-13.5 -15 Z" fill={`url(#g-${id})`} stroke={dim ? "#A79F8B" : "#FFF1C9"} strokeWidth={1.5} strokeLinejoin="round" />
    <path d="M0 -46 L13.5 -15 L0 -6 Z" fill="rgba(255,255,255,0.35)" />
  </svg>
);

const fmt = (n: number) => Math.round(n).toLocaleString("es-CO").replace(/,/g, ".");


/** Foto 16:9 llenando el vertical: `cx` = columna (px de la foto de 2048) que queda centrada. */
const Photo: React.FC<{ src: string; cx: number; zoom?: number; originY?: number; filter?: string }> = ({ src, cx, zoom = 1, originY = 960, filter }) => {
  const k = 1920 / 1152;
  const w = 2048 * k;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <img src={staticFile(src)} style={{ position: "absolute", height: 1920, width: w, left: 540 - cx * k, top: 0, transform: `scale(${zoom})`, transformOrigin: `${cx * k}px ${originY}px`, filter }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Fondos */
const ForestBg: React.FC<{ rays?: boolean; tone?: number }> = ({ rays = true, tone = 1 }) => {
  const { frame } = useT();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1100px at 480px 820px, #17614A 0%, ${C.forest} 52%, #04110D 100%)`, filter: tone < 1 ? `saturate(${tone})` : undefined }}>
      {rays ? (
        <AbsoluteFill
          style={{
            background: `repeating-conic-gradient(from ${frame * 0.15}deg at 480px 860px, rgba(255,230,160,0.07) 0deg 4deg, transparent 4deg 14deg)`,
            maskImage: "radial-gradient(circle at 480px 860px, black 0%, transparent 62%)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
const PaperBg: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 820px 1000px at 480px 860px, #FBF7EE 0%, ${C.paper} 55%, #D9D0BD 100%)` }} />
);

/* ------------------------------------------------------------------ */
/* Escenas */
const Scene: React.FC<{ id: SceneId; children: React.ReactNode }> = ({ id, children }) => {
  const { frame, s } = useT();
  const a = s(S[id].from);
  const b = s(S[id].to);
  if (frame < a || frame > b + 7) return null;
  const tin = a === 0 ? 1 : ease(frame, a, 7);
  return <AbsoluteFill style={{ opacity: tin, transform: `scale(${1.04 - 0.04 * tin})`, filter: tin < 1 ? `blur(${(1 - tin) * 10}px)` : undefined }}>{children}</AbsoluteFill>;
};

/* ---------------- Escenas en 3D ---------------- */
type V3 = [number, number, number];
const Float: React.FC<{ n?: number; spread?: [number, number, number]; seed?: string; size?: number }> = ({ n = 26, spread = [6, 7, 4], seed = "f", size = 0.05 }) => {
  const { t } = useT();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const x = (random(`${seed}x${i}`) - 0.5) * spread[0];
        const y = random(`${seed}y${i}`) * spread[1] + ((t * (0.08 + random(`${seed}v${i}`) * 0.12)) % 1) * 1.2 - 1;
        const z = (random(`${seed}z${i}`) - 0.5) * spread[2] - 1;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size * (0.5 + random(`${seed}s${i}`)), 8, 6]} />
            <meshBasicMaterial color="#FFD98A" transparent opacity={0.55} toneMapped={false} />
          </mesh>
        );
      })}
    </>
  );
};

/** Estrellitas 3D que salen disparadas desde un punto. */
const Burst3D: React.FC<{ at: number; origin: V3; n?: number; spread?: number; seed?: string }> = ({ at, origin, n = 24, spread = 3.2, seed = "b" }) => {
  const { frame } = useT();
  if (frame < at) return null;
  const k = frame - at;
  const p = interpolate(k, [0, 40], [0, 1], { ...clamp, easing: EASE });
  const fade = interpolate(k, [30, 60], [1, 0], clamp);
  if (fade <= 0) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const e = (random(`${seed}e${i}`) - 0.5) * 1.4;
        const d = (0.4 + random(`${seed}d${i}`) * 0.6) * spread * p;
        return (
          <Star3D
            key={i}
            position={[origin[0] + Math.cos(a) * d, origin[1] + Math.sin(a) * d * 0.9 - k * 0.004, origin[2] + e * d * 0.4]}
            rotation={[k * 0.05 * random(`${seed}r${i}`), k * 0.08, 0]}
            scale={(0.06 + random(`${seed}s${i}`) * 0.1) * fade}
            emissive={0.3}
          />
        );
      })}
    </>
  );
};

const HookScene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  const rise = spring({ frame: frame - 4, fps, config: { damping: 16, stiffness: 90 } });
  const noAt = s(wordTime("h1", "no"));
  const dim = ease(frame, noAt, 12);
  const starAt = s(wordTime("h2", "estrella") - 0.2);
  const sp = frame >= starAt ? spring({ frame: frame - starAt, fps, config: { damping: 12, stiffness: 110 } }) : 0;
  const cupFade = 1 - Math.min(1, sp * 1.3);
  const cam = { pos: [Math.sin(t * 0.25) * 1.2, 2.1 + 0.3 * dim, 13 - 0.6 * Math.min(1, sp)] as V3, target: [0, 1.3, 0] as V3, fov: 35 };
  return (
    <Scene id="hook">
      <ForestBg />
      <Stage cam={cam}>
        <ShadowFloor y={-0.02} opacity={0.4} />
        {cupFade > 0.01 ? (
          <Cup3D position={[0, -4 * (1 - rise) + Math.sin(t * 1.6) * 0.08 - 0.25 * dim, -0.8 * dim]} rotation={[0.06, t * 0.6, Math.sin(t) * 0.05]} scale={1 - 0.12 * dim} fade={cupFade * (1 - 0.35 * dim)} />
        ) : null}
        {sp > 0 ? (
          <group position={[0, 2.6 - 1.25 * Math.min(1, sp) + Math.sin(t * 1.5) * 0.06, 0.3]} rotation={[0.1, (1 - Math.min(1, sp)) * Math.PI * 2 + Math.sin(t * 1.2) * 0.5, 0]} scale={1.15 * sp}>
            <Star3D emissive={0.18} />
            <pointLight position={[0, 0, 1.2]} intensity={6} distance={6} color="#FFD98A" />
          </group>
        ) : null}
        <Burst3D at={starAt + 4} origin={[0, 1.4, 0.3]} n={26} seed="h" />
        <Float seed="hk" />
      </Stage>
      {sp > 0 ? <AbsoluteFill style={{ background: "radial-gradient(circle at 480px 960px, rgba(255,214,120,0.28), transparent 38%)", opacity: Math.min(1, sp), mixBlendMode: "screen" }} /> : null}
    </Scene>
  );
};

const Stat1Scene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  const from = s(wordTime("s1", "gastaron"));
  const to = s(wordTime("s1", "dólares"));
  const v = copy.stat1.value * interpolate(frame, [from, to], [0, 1], { ...clamp, easing: Easing3 });
  const inn = spring({ frame: frame - s(S.stat1.from), fps, config: { damping: 18, stiffness: 120 } });
  const membersAt = s(wordTime("s1", "miembros"));
  const unitIn = ease(frame, to - 4, 10);
  const cols = 7;
  const rows = 5;
  const coinsAt = to - 6;
  const cam = { pos: [Math.sin(t * 0.2) * 1.5, 9.5, 12.5] as V3, target: [0, 1.1, 0.6] as V3, fov: 36 };
  return (
    <Scene id="stat1">
      <ForestBg />
      <Stage cam={cam}>
        <ShadowFloor opacity={0.45} />
        {Array.from({ length: cols * rows }).map((_, i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);
          const order = random(`p${i}`) * 40;
          const on = frame >= membersAt + order ? spring({ frame: frame - membersAt - order, fps, config: { damping: 12, stiffness: 160 } }) : 0;
          return <Member key={i} position={[(c - (cols - 1) / 2) * 0.95, 0, (r - (rows - 1) / 2) * 0.95]} on={on} scale={0.62} />;
        })}
        {frame >= coinsAt
          ? Array.from({ length: 22 }).map((_, i) => {
              const k = (frame - coinsAt - i * 2) / fps;
              if (k < 0) return null;
              const y = 7 - 9.8 * 0.5 * k * k * 0.6;
              if (y < 0.1) return null;
              return <Coin key={i} position={[(random(`cx${i}`) - 0.5) * 7, y, (random(`cz${i}`) - 0.5) * 4]} rotation={[k * 6 + i, k * 3, i]} scale={0.9} />;
            })
          : null}
        <Float seed="s1" spread={[9, 6, 6]} />
      </Stage>
      <div style={{ position: "absolute", left: 0, width: 960, top: 300, textAlign: "center", fontFamily: font, color: C.white, opacity: Math.min(1, inn * 1.5) }}>
        <div style={{ fontSize: 168, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", color: C.goldLight, textShadow: "0 0 50px rgba(232,184,74,0.35), 0 10px 30px rgba(0,0,0,0.5)" }}>
          {copy.stat1.prefix}
          {fmt(v)}
        </div>
        <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: "0.04em", marginTop: 10, opacity: 0.4 + 0.6 * unitIn, textShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>{copy.stat1.unit}</div>
        <div style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 40, color: C.soft, marginTop: 16, lineHeight: 1.2, padding: "0 80px" }}>{copy.stat1.label}</div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 960, top: 1300, textAlign: "center", fontFamily: font, fontSize: 22, fontWeight: 600, color: "rgba(167,201,189,0.75)" }}>{copy.source}</div>
    </Scene>
  );
};
const Easing3 = (x: number) => 1 - Math.pow(1 - x, 3);

const Stat2Scene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  const waitEnd = s(V.s3.at - 0.1);
  const dim = frame < waitEnd ? 1 : 1 - ease(frame, waitEnd, 8);
  const pctAt = s(wordTime("s3", "sesenta") - 0.25);
  const p = interpolate(frame, [pctAt, pctAt + 30], [0, 0.6], { ...clamp, easing: EASE });
  const inn = spring({ frame: frame - waitEnd, fps, config: { damping: 16, stiffness: 120 } });
  const label = ease(frame, s(wordTime("s3", "venden")), 12);
  const cam = { pos: [0, 0.2, 9] as V3, target: [0, 0, 0] as V3, fov: 35 };
  const arcGeo = useMemo(() => new THREE.TorusGeometry(1.0, 0.11, 32, 160, Math.max(0.0001, Math.PI * 2 * p)), [p]);
  return (
    <Scene id="stat2">
      <Photo src="fotos/fila.jpg" cx={1290} zoom={1.04 + 0.06 * ease(frame, s(S.stat2.from), s(S.stat2.to - S.stat2.from))} filter={`grayscale(${dim}) brightness(${0.75 - 0.2 * dim})`} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(4,17,13,0.85) 0%, rgba(4,17,13,${0.35 + 0.35 * (1 - dim)}) 35%, rgba(4,17,13,${0.45 + 0.3 * (1 - dim)}) 60%, rgba(4,17,13,0.92) 100%)` }} />
      {frame >= waitEnd ? (
        <>
          <Stage cam={cam} shadows={false}>
            <group position={[0, 0.47, 0]} rotation={[0.25 * Math.sin(t * 0.7), 0.35 * Math.sin(t * 0.5), 0]} scale={0.85 + 0.15 * inn}>
              <mesh>
                <torusGeometry args={[1.0, 0.1, 24, 160]} />
                <meshStandardMaterial color="#1E4F41" roughness={0.6} metalness={0.2} transparent opacity={0.85} />
              </mesh>
              <mesh geometry={arcGeo} rotation={[0, Math.PI, Math.PI / 2]}>
                <meshStandardMaterial {...GOLD} emissive="#FFB733" emissiveIntensity={0.15} />
              </mesh>
            </group>
            <group position={[0, -0.82, 0.4]}>
              {Array.from({ length: 10 }).map((_, i) => (
                <Member key={i} position={[(i - 4.5) * 0.34, 0, 0]} on={p * 10 > i + 0.5 ? 1 : 0} scale={0.28} />
              ))}
            </group>
            <Float seed="s2" spread={[7, 6, 3]} />
          </Stage>
          <div style={{ position: "absolute", left: CX - 220, width: 440, top: 690, textAlign: "center", fontFamily: font, color: C.white, opacity: Math.min(1, inn * 1.5) }}>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "0.2em", color: C.soft }}>CASI</div>
            <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, color: C.goldLight, fontVariantNumeric: "tabular-nums", textShadow: "0 0 40px rgba(232,184,74,0.35)" }}>{Math.round(p * 100)}%</div>
          </div>
          <div style={{ position: "absolute", left: 0, width: 960, top: 1250, textAlign: "center", fontFamily: font, opacity: label, transform: `translateY(${(1 - label) * 14}px)` }}>
            <div style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 40, color: C.white, lineHeight: 1.2 }}>{copy.stat2.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "rgba(167,201,189,0.75)", marginTop: 10 }}>{copy.source}</div>
          </div>
        </>
      ) : null}
    </Scene>
  );
};

const WhyScene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  const sharp = ease(frame, s(V.w2.at - 0.1), 12);
  const todayAt = s(wordTime("w2", "vende"));
  const today = spring({ frame: frame - todayAt, fps, config: { damping: 15, stiffness: 160 } });
  const tomAt = s(wordTime("w2", "mañana") - 0.1);
  const tom = spring({ frame: frame - tomAt, fps, config: { damping: 13, stiffness: 160 } });
  const swap = Math.min(1, tom);
  const zoom = 1.06 + 0.08 * ease(frame, s(S.why.from), s(S.why.to - S.why.from));
  const Tag: React.FC<{ text: string; gold?: boolean }> = ({ text, gold }) => (
    <div style={{ padding: "16px 34px", borderRadius: 16, fontFamily: font, fontWeight: 800, fontSize: 64, letterSpacing: "0.02em", background: gold ? "linear-gradient(90deg, #D49B2E, #FFD98A)" : C.forest, color: gold ? C.ink : C.white, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>{text}</div>
  );
  return (
    <Scene id="why">
      <Photo src="fotos/barista.jpg" cx={1240} zoom={zoom} originY={900} filter={`blur(${(1 - sharp) * 14}px) brightness(${0.55 + 0.35 * sharp})`} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,17,13,0.85) 0%, rgba(4,17,13,0.25) 32%, rgba(4,17,13,0.1) 55%, rgba(4,17,13,0.75) 100%)" }} />
      {tom > 0.001 ? (
        <Stage cam={{ pos: [0, 0, 10], target: [0, 0, 0], fov: 40 }} shadows={false}>
          <group position={[-1.05, 0.2 + Math.sin(t * 1.6) * 0.08, 0.5]} rotation={[0.1, Math.sin(t * 1.3) * 0.6, 0]} scale={0.7 * tom}>
            <Star3D emissive={0.35} />
            <pointLight position={[0, 0, 1.4]} intensity={4} distance={5} color="#FFD98A" />
          </group>
          <Burst3D at={tomAt + 3} origin={[-1.05, 0.2, 0.5]} n={18} spread={2} seed="w" />
        </Stage>
      ) : null}
      <div style={{ position: "absolute", left: 0, width: 960, top: 1120, display: "flex", justifyContent: "center" }}>
        {today > 0.001 ? (
          <div style={{ position: "absolute", transform: `scale(${(0.6 + 0.4 * today) * (1 - 0.3 * swap)}) translateY(${-swap * 60}px)`, opacity: Math.min(1, today * 1.5) * (1 - swap) }}>
            <Tag text={copy.today} />
          </div>
        ) : null}
        {tom > 0.001 ? (
          <div style={{ position: "absolute", transform: `scale(${0.6 + 0.4 * tom})`, opacity: Math.min(1, tom * 1.5) }}>
            <Tag text={copy.tomorrow} gold />
          </div>
        ) : null}
      </div>
    </Scene>
  );
};

const MechScene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  const steps: [string, number][] = [
    ["compras", 2],
    ["acumulas", 5],
    ["estrellas", 7],
    ["cada", 9],
    ["premio", 10],
  ];
  let target = 0;
  for (const [w, n] of steps) if (frame >= s(wordTime("m1", w))) target = n;
  const rewardAt = s(wordTime("m1", "premio"));
  const reward = pop(frame, fps, rewardAt + 6);
  const chartAt = s(V.m2.at - 0.05);
  const chart = ease(frame, chartAt, 14, EASE_INOUT);
  const heights = [0.25, 0.5, 0.8, 1.3, 2.0];
  const cam = { pos: [Math.sin(t * 0.3) * 0.8 * (1 - chart) + chart * 0.35, 1.6 + chart * 1.0, 10] as V3, target: [chart * 0.1, 1.2, 0] as V3, fov: 36 };
  const labels = heights.map((_, i) => toScreen([(i - 2) * 0.62, 0.0, 0.5], cam));
  return (
    <Scene id="mech">
      <PaperBg />
      <Stage cam={cam} env={1}>
        <ShadowFloor y={0} opacity={0.18} />
        {chart < 1 ? (
          <group position={[0, chart * 3, 0]}>
            <Cup3D position={[0, 1.14, -0.3]} rotation={[0.05, t * 0.6, 0]} scale={0.7} fade={1 - chart} />
            {Array.from({ length: 10 }).map((_, i) => {
              const on = i < target;
              const at = s(wordTime("m1", steps.find(([, n]) => n > i)?.[0] ?? "premio")) + (i % 3) * 2;
              const p = on ? spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 220 } }) : 0;
              return <Star3D key={i} position={[(i - 4.5) * 0.29, 0.98, 0.6]} rotation={[0, on ? Math.sin(t * 2 + i) * 0.25 : 0, on ? (1 - p) * Math.PI * 2 : 0]} scale={0.11 * (on ? 0.7 + 0.45 * p : 0.85)} dim={on ? 0 : 1} emissive={on ? 0.4 : 0} />;
            })}
          </group>
        ) : null}
        {chart > 0
          ? heights.map((h, i) => {
              const g = ease(frame, chartAt + 6 + i * 6, 16);
              const hh = Math.max(0.01, h * g);
              const last = i === heights.length - 1;
              return (
                <group key={i} position={[(i - 2) * 0.62, 0, 0.5]}>
                  <mesh position={[0, hh / 2, 0]} castShadow>
                    <boxGeometry args={[0.42, hh, 0.42]} />
                    <meshPhysicalMaterial color={last ? "#E8B84A" : "#14644D"} metalness={last ? 0.35 : 0.1} roughness={last ? 0.3 : 0.4} clearcoat={0.6} emissive={last ? "#B8821F" : "#000"} emissiveIntensity={last ? 0.35 : 0} />
                  </mesh>
                  <group position={[0, hh + 0.28, 0]} rotation={[0, Math.sin(t * 1.2 + i) * 0.5, 0]} scale={0.18 * g}>
                    <Star3D emissive={0.4} />
                  </group>
                </group>
              );
            })
          : null}
        <Burst3D at={rewardAt + 6} origin={[1.0, 1.1, 0.6]} n={16} spread={1.6} seed="m" />
      </Stage>
      {/* barra y contador (parte 1) */}
      <div style={{ position: "absolute", left: 90, width: 780, top: 1095, opacity: 1 - chart }}>
        <div style={{ height: 20, borderRadius: 99, background: "#E2D9C6", overflow: "hidden" }}>
          <div style={{ width: `${target * 10}%`, height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #14644D, #E8B84A)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, fontFamily: font }}>
          <div style={{ fontSize: 54, fontWeight: 800, color: C.ink, fontVariantNumeric: "tabular-nums" }}>{target} ★</div>
          {reward > 0 ? <div style={{ transform: `scale(${reward})`, padding: "14px 28px", borderRadius: 999, background: "linear-gradient(90deg, #D49B2E, #FFD98A)", color: C.ink, fontSize: 36, fontWeight: 800, letterSpacing: "0.08em", boxShadow: "0 14px 40px rgba(212,155,46,0.45)" }}>🎁 {copy.reward}</div> : null}
        </div>
      </div>
      {chart > 0.3
        ? labels.map((p, i) => (
            <div key={i} style={{ position: "absolute", left: p.x - 70, width: 140, top: p.y + 18, textAlign: "center", fontFamily: font, fontSize: 22, fontWeight: 800, color: "#6B6455", opacity: chart }}>
              {copy.visits[i]}
            </div>
          ))
        : null}
    </Scene>
  );
};

const BizScene: React.FC = () => {
  const { frame, s, t } = useT();
  const push = ease(frame, s(S.biz.from), s(S.biz.to - S.biz.from) + 12, EASE_INOUT);
  const zoom = 1.0 + 0.07 * push;
  // letrero de la foto: x 674–1400, y 150–240 (px de la foto de 2048×1152)
  const k = 1920 / 1152;
  const cx = 1037;
  const signY = 195 * k;
  const write = ease(frame, s(wordTime("y1", "negocio") - 0.15), 16);
  return (
    <Scene id="biz">
      <Photo src="fotos/fachada.jpg" cx={cx} zoom={zoom} originY={1100} filter="brightness(0.95) saturate(1.05)" />
      {/* "Tu negocio" en el letrero (misma transformación que la foto) */}
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `540px 1100px` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: signY - 62, height: 124, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 700, fontSize: 104, color: "#0E3F31", letterSpacing: "-0.01em", clipPath: `inset(0 ${100 - write * 100}% 0 0)`, textShadow: "0 1px 0 rgba(255,255,255,0.25)" }}>Tu negocio</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,8,10,0.55) 0%, rgba(4,8,10,0) 22%, rgba(4,8,10,0) 70%, rgba(4,8,10,0.55) 100%)" }} />
      <div style={{ position: "absolute", left: 0, width: 960, top: 150, display: "flex", justifyContent: "center", opacity: ease(frame, s(S.biz.from + 0.05), 8) }}>
        <div style={{ fontFamily: font, fontWeight: 800, fontSize: 30, letterSpacing: "0.24em", color: C.white, padding: "10px 22px", borderRadius: 999, background: "rgba(5,8,11,0.55)" }}>AHORA PIENSA EN</div>
      </div>
      <Stage cam={{ pos: [0, 0, 10], target: [0, 0, 0], fov: 40 }} shadows={false}>
        {Array.from({ length: 11 }).map((_, i) => {
          const at = s(S.biz.from + 0.25) + i * 3;
          const p = pop(frame, 30, at);
          const x = (random(`bx${i}`) - 0.5) * 6;
          const y = -2.2 + random(`by${i}`) * 4.2 + Math.sin(t * 1.4 + i) * 0.08;
          return <Star3D key={i} position={[x, y, random(`bz${i}`) * 2]} rotation={[0, t * 1.2 + i, 0]} scale={(0.1 + random(`bs${i}`) * 0.12) * p} emissive={0.45} />;
        })}
      </Stage>
    </Scene>
  );
};

/** Fondo 3D de estrellas flotando (escena de la app y CTA). */
const StarField: React.FC<{ n?: number; seed?: string; blur?: number }> = ({ n = 18, seed = "sf", blur = 0 }) => {
  const { t } = useT();
  return (
    <AbsoluteFill style={{ filter: blur ? `blur(${blur}px)` : undefined }}>
      <Stage cam={{ pos: [0, 0, 10], target: [0, 0, 0], fov: 40 }} shadows={false}>
        {Array.from({ length: n }).map((_, i) => (
          <Star3D
            key={i}
            position={[(random(`${seed}x${i}`) - 0.5) * 9, (random(`${seed}y${i}`) - 0.5) * 14 + Math.sin(t * 0.6 + i) * 0.2, (random(`${seed}z${i}`) - 0.5) * 6 - 2]}
            rotation={[t * 0.3 + i, t * 0.5 + i, 0]}
            scale={0.2 + random(`${seed}s${i}`) * 0.35}
            emissive={0.2}
          />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

const AppScene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  const phoneAt = s(wordTime("y2", "tarjetica") - 0.2);
  const rise = spring({ frame: frame - phoneAt, fps, config: { damping: 20, stiffness: 120 } });
  const logoAt = s(wordTime("y2", "mi") - 0.1);
  const logoShow = ease(frame, logoAt, 10);
  const chips: [string, string, number, number][] = [
    [copy.chips[1], "sellos", -1, 760],
    [copy.chips[2], "premios", 1, 960],
    ["Y vuelven ↺", "vuelven", -1, 1160],
  ];
  return (
    <Scene id="app">
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1100px at 480px 900px, #145B44 0%, #0B2A22 55%, #04110D 100%)` }} />
      <StarField blur={3} />
      <div style={{ position: "absolute", left: 0, width: 960, top: 300, display: "flex", justifyContent: "center", opacity: logoShow }}>
        <Logo height={120} color={C.white} animateAt={logoAt} />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - rise) * 1100}px)` }}>
        <BigPhone y={540} w={470} tilt={Math.sin(t * 1.2) * 1.5}>
          <AbsoluteFill style={{ background: "#050505" }}>
            <div style={{ position: "absolute", top: 140, left: 32, right: 32, display: "flex", justifyContent: "space-between", fontFamily: font, fontWeight: 600, fontSize: 32, color: "#fff" }}>
              <span>Listo</span>
              <span>···</span>
            </div>
            <div style={{ position: "absolute", left: 32, top: 210 }}>
              <PassCard width={SCREEN - 64} pulse={(Math.sin(t * Math.PI * 3) + 1) / 2} />
            </div>
          </AbsoluteFill>
        </BigPhone>
      </div>
      {chips.map(([text, w, side, y]) => {
        const p = spring({ frame: frame - s(wordTime("y2", w)), fps, config: { damping: 14, stiffness: 170 } });
        if (p <= 0.001) return null;
        return (
          <div
            key={text}
            style={{
              position: "absolute",
              top: y,
              left: side < 0 ? 40 : undefined,
              right: side > 0 ? 160 : undefined,
              transform: `translateX(${(1 - p) * side * 200}px) rotate(${side * -3}deg)`,
              opacity: Math.min(1, p * 1.5),
              padding: "18px 30px",
              borderRadius: 999,
              background: w === "premios" ? "linear-gradient(90deg, #D49B2E, #FFD98A)" : C.highlight,
              color: C.ink,
              fontFamily: font,
              fontWeight: 800,
              fontSize: 36,
              boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
            }}
          >
            {w === "sellos" ? "✓ " : w === "premios" ? "🎁 " : ""}
            {text}
          </div>
        );
      })}
    </Scene>
  );
};


const CtaScene: React.FC = () => {
  const { frame, fps, s } = useT();
  if (frame < s(S.cta.from)) return null;
  const at = s(V.c1.at);
  const title = spring({ frame: frame - at + 2, fps, config: { damping: 14, stiffness: 170 } });
  const word = spring({ frame: frame - at - s(0.25), fps, config: { damping: 12, stiffness: 190 } });
  const sub = ease(frame, at + s(0.7), s(0.5));
  const bar = ease(frame, at + s(0.5), s(0.5));
  const typeStart = at + s(1.0);
  const typed = copy.cta.word.slice(0, Math.max(0, Math.min(copy.cta.word.length, Math.floor((frame - typeStart) / 3))));
  const sentAt = typeStart + copy.cta.word.length * 3 + s(0.25);
  const sent = ease(frame, sentAt, s(0.4));
  const logoAt = at + s(2.2);
  const caret = Math.floor(frame / 15) % 2 === 0;
  const arrow = Math.sin((frame / fps) * Math.PI * 2 * 1.2) * 10;
  const ring = ease(frame, at, 20);
  return (
    <Scene id="cta">
      <ForestBg />
      <Stage cam={{ pos: [0, 0.8, 10], target: [0, 0.8, 0], fov: 36 }} shadows={false}>
        <group position={[-0.55, 2.35, 0]} rotation={[0.35, 0, 0.05]}>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2 + frame * 0.012;
            return <Star3D key={i} position={[Math.cos(a) * 2.6 * ring, 0, Math.sin(a) * 2.6 * ring]} rotation={[0, frame * 0.05 + i, 0]} scale={0.16 * ring} emissive={0.25} />;
          })}
        </group>
      </Stage>
      <div style={{ position: "absolute", left: 0, width: 960, top: 380, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: font, color: C.white, textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>
        <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: tracking.headline, lineHeight: 1, transform: `scale(${0.7 + 0.3 * title})`, opacity: Math.min(1, title * 1.5) }}>{copy.cta.top}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18, transform: `scale(${0.6 + 0.4 * word})`, opacity: Math.min(1, word * 1.5) }}>
          <span style={{ fontSize: 116, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, background: `linear-gradient(90deg, #E8B84A, #FFD98A)`, color: C.ink, padding: "0 20px", borderRadius: 18, textShadow: "none", boxShadow: "0 18px 60px rgba(232,184,74,0.35)" }}>{copy.cta.word}</span>
          <span style={{ fontSize: 100, fontWeight: 800, transform: `translateY(${arrow}px)` }}>↓</span>
        </div>
        <div style={{ marginTop: 40, fontFamily: logoFont, fontStyle: "italic", fontSize: 46, fontWeight: 600, color: C.cream, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)`, textAlign: "center", padding: "0 60px", lineHeight: 1.2 }}>{copy.cta.sub}</div>
      </div>
      <div style={{ position: "absolute", left: CX - 420, width: 840, top: 1010, opacity: bar, transform: `translateY(${(1 - bar) * 40}px)` }}>
        <div style={{ height: 112, borderRadius: 999, background: "rgba(5,8,11,0.55)", border: "2px solid rgba(255,255,255,0.16)", display: "flex", alignItems: "center", padding: "0 20px", gap: 20, fontFamily: font }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: `linear-gradient(145deg, ${C.mint}, ${C.greenMid})` }} />
          <div style={{ flex: 1, fontSize: 40, fontWeight: typed && sent === 0 ? 800 : 400, color: typed && sent === 0 ? C.white : "rgba(255,255,255,0.5)" }}>
            {sent > 0 ? copy.cta.comment : typed || copy.cta.comment}
            {typed && sent === 0 && caret ? <span style={{ fontWeight: 400 }}>|</span> : null}
          </div>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: typed.length === copy.cta.word.length ? "#2F7BF6" : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 44, fontWeight: 800, transform: `scale(${1 + 0.15 * Math.sin(Math.min(1, sent) * Math.PI)})` }}>↑</div>
        </div>
        {sent > 0 ? <div style={{ position: "absolute", right: 30, top: -96 - 30 * sent, opacity: Math.min(1, sent * 2), padding: "14px 28px", borderRadius: 26, background: "#2F7BF6", color: "#fff", fontFamily: font, fontWeight: 800, fontSize: 40 }}>{copy.cta.word}</div> : null}
      </div>
      <div style={{ position: "absolute", left: 0, width: 960, top: 1240, display: "flex", justifyContent: "center", opacity: ease(frame, logoAt, s(0.3)) }}>
        <Logo height={150} color={C.white} animateAt={logoAt} />
      </div>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
const DARK: Record<string, boolean> = { m1: true, m2: true };
const SCENE_OF: Record<string, SceneId> = { h1: "hook", h2: "hook", s2: "stat2", w1: "why", w2: "why", m1: "mech", m2: "mech", y1: "biz", y2: "app" };
const Headlines: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = (x: number) => Math.round(x * fps);
  const list: { text: string; at: number; scene: SceneId; dark: boolean; id: string }[] = [];
  for (const v of VOICE) for (const [text, needle] of headlines[v.id] ?? []) list.push({ text, at: Math.max(wordTime(v.id, needle), S[SCENE_OF[v.id]].from + 0.05), scene: SCENE_OF[v.id], dark: !!DARK[v.id], id: v.id });
  return (
    <>
      {list.map((h, i) => {
        const next = list[i + 1];
        let end = next && next.scene === h.scene ? next.at - 0.12 : S[h.scene].to - 0.1;
        if (h.id === "y2") end = wordTime("y2", "mi") - 0.25;
        if (h.id === "s2") end = V.s3.at - 0.15;
        if (h.id === "w1") end = V.w2.at - 0.1;
        return <Headline key={i} text={h.text} at={s(h.at)} exitAt={s(end)} size={h.text.length > 24 ? 92 : h.text.length > 18 ? 104 : 116} dark={h.dark} top={h.id === "w1" ? 760 : 262} />;
      })}
    </>
  );
};

const Cuts: React.FC = () => {
  const { frame, s } = useT();
  let o = 0;
  for (const id of Object.keys(S) as SceneId[]) {
    if (id === "hook") continue;
    const c = s(S[id].from);
    o = Math.max(o, interpolate(frame, [c - 3, c, c + 4], [0, 0.6, 0], clamp));
  }
  return o > 0 ? <AbsoluteFill style={{ background: "#000", opacity: o }} /> : null;
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundImage: `url(${staticFile("grain.png")})`, backgroundPosition: `${(frame * 137) % 512}px ${(frame * 251) % 512}px`, opacity: 0.06, mixBlendMode: "overlay", pointerEvents: "none" }} />;
};

/* ------------------------------------------------------------------ */
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
export const SFX: [number, string, number][] = [
  ...(Object.keys(S) as SceneId[]).filter((id) => id !== "hook" && id !== "mech").map((id) => [S[id].from - 0.08, "whoosh-soft", 0.3] as [number, string, number]),
  [wordTime("h2", "estrella") - 0.1, "ring-pulse", 0.45],
  [wordTime("s1", "dólares"), "pop", 0.4],
  [wordTime("s3", "sesenta"), "ring-pulse", 0.35],
  [wordTime("w2", "mañana"), "pop", 0.35],
  [wordTime("m1", "acumulas"), "tap", 0.3],
  [wordTime("m1", "estrellas"), "tap", 0.3],
  [wordTime("m1", "premio") + 0.2, "notification", 0.4],
  [wordTime("y2", "sellos"), "pop", 0.35],
  [wordTime("y2", "premios"), "pop", 0.35],
  [wordTime("y2", "vuelven"), "pop", 0.35],
  [V.c1.at + 1.0 + (copy.cta.word.length * 3) / 30 + 0.25, "tap", 0.45],
];

export const ElSecreto: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <HookScene />
      <Stat1Scene />
      <Stat2Scene />
      <WhyScene />
      <MechScene />
      <BizScene />
      <AppScene />
      <CtaScene />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 60%, rgba(0,0,0,0.4) 100%)", pointerEvents: "none" }} />
      <Headlines />
      <Karaoke hide={(id) => id === "c1"} />
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
