import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, getStaticFiles, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { audio, brand } from "./brand";
import { headlines } from "./copy";
import { font } from "./fonts";
import { Logo } from "./components/Logo";
import { Stage } from "./three/Stage";
import { camAt, type Cam, type Key, type V3 } from "./three/camera";
import { Counter, Phone3D, type Layer } from "./three/Devices";
import { Glow, Person, Plant } from "./three/Props";
import { Clock, DESKS, Desk, Gift, PaperPlane, Room, Tarjetico, type Tool } from "./three/Office";
import { EASE_INOUT, clamp, ease } from "./motion";
import { CX, Headline, Karaoke } from "./ui";
import { DURATION_SEC, SCENES, type SceneId, V, VOICE, wordTime } from "./timeline";

/**
 * TikTok "La oficina dentro del celular": al dueño de un café, Mi Tarjetica le monta un equipo de
 * "Tarjeticos" que ponen sellos, felicitan cumpleaños, vigilan la cuadra, cuentan premios y miran
 * los datos. Todo en 3D; las pantallas de los monitores vienen de src/screens.tsx.
 */
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
const layers = (frame: number, list: [string, number][]): [string, number][] =>
  list.map(([src, at], i) => [src, i === 0 ? 1 : interpolate(frame, [at, at + 5], [0, 1], clamp)] as [string, number]).filter(([, o], i, arr) => o > 0 && !arr.slice(i + 1).some(([, o2]) => o2 >= 1));
const phoneLayers = (frame: number, list: [string, number][]): Layer[] => layers(frame, list).map(([src, o]) => [`screens/${src}.png`, o] as Layer);
const blinkAt = (t: number, seed = 0) => {
  const k = (t + seed) % 2.9;
  return k < 0.12 ? Math.sin((k / 0.12) * Math.PI) : 0;
};
/** Pulso 0→1→0 alrededor del segundo `at`. */
const pulse = (t: number, at: number, d = 0.5) => {
  const k = (t - at) / d;
  return k < 0 || k > 1 ? 0 : Math.sin(k * Math.PI);
};

const DarkBg: React.FC<{ y?: number }> = ({ y = 900 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 800px 1000px at ${CX}px ${y}px, #12382F 0%, #071A15 60%, #030A08 100%)` }} />
);

const Scene: React.FC<{ id: SceneId; children: React.ReactNode }> = ({ id, children }) => {
  const { frame, s } = useT();
  const a = s(S[id].from);
  const b = s(S[id].to);
  if (frame < a || frame > b + 7) return null;
  const tin = a === 0 ? 1 : ease(frame, a, 7);
  return <AbsoluteFill style={{ opacity: tin, transform: `scale(${1.05 - 0.05 * tin})`, filter: tin < 1 ? `blur(${(1 - tin) * 10}px)` : undefined }}>{children}</AbsoluteFill>;
};

/* ------------------------------------------------------------------ */
/* 1 · El celular sobre la mesa del café: la cámara se mete en la pantalla */
const Mug: React.FC<{ position: V3 }> = ({ position }) => (
  <group position={position}>
    <mesh castShadow>
      <cylinderGeometry args={[0.16, 0.14, 0.26, 32]} />
      <meshPhysicalMaterial color="#F6F2EA" roughness={0.3} clearcoat={0.6} />
    </mesh>
    <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.145, 32]} />
      <meshStandardMaterial color="#4A2C1A" roughness={0.3} />
    </mesh>
    <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.07, 0.02, 8, 16]} />
      <meshPhysicalMaterial color="#F6F2EA" roughness={0.3} />
    </mesh>
  </group>
);

const IntroScene: React.FC = () => {
  const { frame, t, s } = useT();
  const zoomAt = wordTime("h2", "oficina") - 0.2;
  const k = EASE_INOUT(Math.min(1, t / zoomAt));
  const dive = ease(frame, s(zoomAt), 30, EASE_INOUT);
  const cam: Cam = {
    pos: lerp3(lerp3([1.4, 2.0, 2.6], [0.5, 1.5, 1.4], k), [0.0, 0.42, 0.06], dive),
    target: lerp3([0, 0.05, 0], [0, 0.03, 0], dive),
    fov: 35,
  };
  const flash = interpolate(frame, [s(V.t1.at - 0.5), s(V.t1.at - 0.2)], [0, 1], clamp);
  return (
    <Scene id="intro">
      <AbsoluteFill style={{ background: "#1A120C" }} />
      <Stage cam={cam} env={0.8} exposure={1.05}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[8, 8]} />
          <meshStandardMaterial color="#8B5E3C" roughness={0.6} />
        </mesh>
        <Phone3D position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0.12]} scale={0.6} screens={[["screens/app-intro.png", 1]]} glow={dive} />
        <Mug position={[-0.75, 0.13, -0.35]} />
        <pointLight position={[0.6, 1.6, 0.8]} intensity={6} distance={5} color="#FFD9A0" />
      </Stage>
      <AbsoluteFill style={{ background: C.highlight, opacity: flash * 0.9, mixBlendMode: "screen" }} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 2 · La oficina */
const shot = (desk: V3, side: 1 | -1): { pos: V3; target: V3 } => ({
  pos: [desk[0] - side * 0.35, desk[1] + 1.6, desk[2] + 4.5],
  target: [desk[0] + side * 0.42, desk[1] + 0.9, desk[2]],
});
const WIDE = { pos: [0, 3.0, 8.4] as V3, target: [0, 1.6, -1.6] as V3 };

const officeKeys = (): Key[] => {
  const k: Key[] = [];
  const add = (t: number, p: { pos: V3; target: V3 }, fov = 36) => k.push({ t, pos: p.pos, target: p.target, fov });
  const drift = (p: { pos: V3; target: V3 }, dx: number): { pos: V3; target: V3 } => ({ pos: [p.pos[0] + dx, p.pos[1], p.pos[2] - 0.25], target: p.target });
  const hold = (from: number, to: number, p: { pos: V3; target: V3 }, dx = 0.25) => {
    add(from, p);
    add(to, drift(p, dx));
  };
  add(S.office.from, { pos: [0, 1.4, 2.6], target: [0, 1.05, -0.4] });
  add(V.t1.end, { pos: [0, 1.6, 3.6], target: [0, 1.2, -0.6] });
  hold(V.t2.at + 0.1, V.w1.at - 0.3, WIDE, 0.4);
  const desks: [keyof typeof DESKS, 1 | -1, string][] = [
    ["sellos", -1, "w1"],
    ["cumple", 1, "w2"],
    ["cuadra", -1, "w3"],
    ["premios", 1, "w4"],
    ["datos", 1, "w5"],
  ];
  for (const [d, side, id] of desks) {
    const p = shot(DESKS[d], side);
    hold(V[id].at + 0.25, V[id].end, p, side * 0.2);
  }
  hold(V.q1.at + 0.25, V.q4.end, { pos: [1.4, 4.15, 0.9], target: [1.4, 4.15, -4.4] }, -0.15);
  hold(V.q5.at + 0.2, S.office.to, WIDE, -0.4);
  return k;
};
const KEYS = officeKeys();

/** En los primeros planos de las filas de atrás, las filas de adelante se esconden a mitad del barrido
 * (no se ven en el plano, pero tapaban el monitor). */
const hiddenDesk = (id: keyof typeof DESKS, t: number) => {
  const front = id === "sellos" || id === "cumple";
  const mid = id === "cuadra" || id === "premios";
  if (front && t > V.w3.at + 0.12 && t < V.q1.at + 0.5) return true;
  if (mid && t > V.w5.at + 0.12 && t < V.q1.at + 0.5) return true;
  return false;
};

const DESK_DEF: { id: keyof typeof DESKS; tool: Tool; color: string; label: string; side: 1 | -1 }[] = [
  { id: "sellos", tool: "stamp", color: "#69D3BE", label: "l-sellos", side: -1 },
  { id: "cumple", tool: "party", color: "#8FE3C0", label: "l-cumple", side: 1 },
  { id: "cuadra", tool: "binoculars", color: "#5CC7A9", label: "l-cuadra", side: -1 },
  { id: "premios", tool: "star", color: "#7ADBC3", label: "l-premios", side: 1 },
  { id: "datos", tool: "headset", color: "#4FB89B", label: "l-datos", side: 1 },
];

const OfficeScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const cam = camAt(KEYS, t);
  const at = (id: string, w: string) => s(wordTime(id, w));
  const screens: Record<string, [string, number][]> = {
    sellos: layers(frame, [["m-sellos-a", 0], ["m-sellos-b", at("w1", "sello")]]),
    cumple: layers(frame, [["m-cumple-a", 0], ["m-cumple-b", at("w2", "regalo") - 3]]),
    cuadra: layers(frame, [["m-cuadra-a", 0], ["m-cuadra-b", at("w3", "avisa") - 3]]),
    premios: [["m-premios", 1]],
    datos: layers(frame, [["m-datos-a", 0], ["m-datos-b", at("w5", "promo") - 3]]),
  };
  const acts: Record<string, number> = {
    sellos: pulse(t, wordTime("w1", "paga"), 0.45) + pulse(t, wordTime("w1", "sello") - 0.1, 0.45),
    cumple: pulse(t, wordTime("w2", "regalo") - 0.15, 0.6),
    cuadra: t > wordTime("w3", "vigila") - 0.2 && t < V.w3.end + 0.3 ? 1 : 0,
    premios: pulse(t, wordTime("w4", "premios") - 0.1, 0.6) + pulse(t, wordTime("w4", "falta") - 0.1, 0.6),
    datos: pulse(t, wordTime("w5", "promo") - 0.1, 0.6),
  };
  const focus: Record<string, string> = { sellos: "w1", cumple: "w2", cuadra: "w3", premios: "w4", datos: "w5" };
  const gift = sp(frame, fps, at("w2", "regalo") - 2, 10, 140);
  const planeK = interpolate(t, [wordTime("w5", "promo") - 0.1, wordTime("w5", "promo") + 1.4], [0, 1], clamp);
  const sealK = interpolate(t, [wordTime("w1", "sello"), wordTime("w1", "sello") + 0.9], [0, 1], clamp);
  const wall = layers(frame, [["wall-a", 0], ["wall-b", s(V.q3.at - 0.05)]]);
  const fast = t > V.q5.at - 0.1 && t < V.q6.end + 0.5;
  const night = fast ? 0.5 + 0.5 * Math.sin((t - V.q5.at) * 9) : 1;
  const sellos = DESKS.sellos;
  return (
    <Scene id="office">
      <DarkBg />
      <Stage cam={cam} env={0.8} exposure={1.12}>
        <ambientLight intensity={0.45} />
        <Room wall={wall} night={night} />
        <Clock position={[3.3, 4.9, -4.45]} t={t} speed={fast ? 40 : 0.05} />
        <Plant position={[-3.2, 0, -0.6]} scale={1.3} />
        <Plant position={[3.2, 0, -0.6]} scale={1.3} />
        {DESK_DEF.map((d, i) => {
          const p = DESKS[d.id];
          const fid = focus[d.id];
          const focused = t > V[fid].at - 0.1 && t < V[fid].end + 0.2;
          return (
            <group key={d.id} visible={!hiddenDesk(d.id, t)}>
              <Desk position={p} screens={screens[d.id]} label={d.label} glow={focused ? 1 : 0.2} />
              <Tarjetico position={[p[0] + d.side * 1.02, p[1], p[2] + 0.3]} rotation={[0, -d.side * 0.5, 0]} scale={0.9} color={d.color} tool={d.tool} t={t} seed={i * 1.3} act={Math.min(1, acts[d.id])} type={focused ? 0.4 : 1} happy={focused ? 1 : 0} blink={blinkAt(t, i)} />
            </group>
          );
        })}
        {/* extras sin escritorio: corren con sellos por el pasillo */}
        {[0, 1].map((i) => {
          const k = ((t * 0.18 + i * 0.5) % 1) * 2 - 1;
          return <Tarjetico key={i} position={[k * 3.4, 0, 1.4]} rotation={[0, (Math.PI / 2) * (k > 0 ? 1 : 1), 0]} scale={0.8} color="#A7E8D5" tool="none" t={t * 1.6} seed={i + 7} type={0} blink={blinkAt(t, i + 4)} />;
        })}
        {hiddenDesk("cumple", t) ? null : <Gift position={[DESKS.cumple[0] - 0.45, DESKS.cumple[1] + 0.9, DESKS.cumple[2] + 0.15]} p={gift} />}
        {sealK > 0 && sealK < 1 ? (
          <group position={[sellos[0] + 0.1, sellos[1] + 1.0 + sealK * 2.2, sellos[2] + 0.2 + sealK * 0.6]} scale={1 - 0.4 * sealK}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.03, 24]} />
              <meshStandardMaterial color="#8FE3C0" emissive="#8FE3C0" emissiveIntensity={0.6} />
            </mesh>
            <Glow position={[0, 0, 0]} size={0.6} color="#8FE3C0" opacity={0.8} />
          </group>
        ) : null}
        {planeK > 0 && planeK < 1 ? (
          <PaperPlane position={[DESKS.datos[0] + 0.3 + planeK * 1.5, DESKS.datos[1] + 1.3 + Math.sin(planeK * Math.PI) * 0.8 + planeK * 0.6, DESKS.datos[2] + planeK * 2.6]} rotation={[-0.3, 0.6, -0.2]} scale={1.1} />
        ) : null}
        {acts.cuadra > 0 && !hiddenDesk("cuadra", t) ? <Glow position={[DESKS.cuadra[0], DESKS.cuadra[1] + 1.25, DESKS.cuadra[2] - 0.1]} size={1 + ((t * 1.5) % 1) * 1.5} color="#8FE3C0" opacity={0.5 * (1 - ((t * 1.5) % 1))} /> : null}
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 3 · Y tú: atender a tus clientes */
const CafeScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const k = EASE_INOUT(Math.min(1, (t - S.cafe.from) / (S.cafe.to - S.cafe.from)));
  const cam: Cam = { pos: lerp3([1.4, 2.2, 6.0], [0.6, 1.9, 5.0], k), target: [-0.2, 1.2, 0], fov: 36 };
  const notifAt = s(wordTime("y2", "clientes") - 0.2);
  const wave = Math.sin(t * 9) * 0.6;
  return (
    <Scene id="cafe">
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #2A1C12 0%, #1A120C 100%)" }} />
      <Stage cam={cam} env={0.8} exposure={1.05}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshLambertMaterial color="#5A3D27" />
        </mesh>
        <mesh position={[0, 2, -2.2]}>
          <boxGeometry args={[10, 4, 0.2]} />
          <meshLambertMaterial color="#2C3D37" />
        </mesh>
        <Counter position={[0, 1.0, -0.2]} w={4} d={1.0} />
        <Person position={[-0.3, 0, -1.2]} rot={0} shirt="#16705D" pants="#2A2F3A" seed={2} />
        <Person position={[0.7, 0, 0.9]} rot={Math.PI + 0.3} shirt="#E0607E" pants="#3A3F4A" seed={6} />
        <Mug position={[0.25, 1.13, -0.1]} />
        <Phone3D position={[-0.75, 1.04, 0.05]} rotation={[-1.25, 0.2, 0]} scale={0.42} screens={phoneLayers(frame, [["app-intro", 0], ["lock-volvio", notifAt]])} glow={interpolate(frame, [notifAt, notifAt + 4, notifAt + 20], [0, 1, 0], clamp)} />
        <group position={[-1.3, 1.0, 0.1]} rotation={[0, 0.5, 0]}>
          <Tarjetico t={t} scale={0.7} tool="none" act={0} type={0} happy={1} blink={blinkAt(t, 3)} />
          <mesh position={[0.24, 0.62, 0.05]} rotation={[0, 0, -1.2 + wave]}>
            <capsuleGeometry args={[0.03, 0.12, 4, 8]} />
            <meshStandardMaterial color="#69D3BE" />
          </mesh>
        </group>
        <pointLight position={[0, 3, 1.5]} intensity={10} distance={7} color="#FFD9A0" />
        <Glow position={[-0.75, 1.2, 0.1]} size={0.6 + sp(frame, fps, notifAt) * 0.8} color="#8FE3C0" opacity={0.6 * Math.min(1, sp(frame, fps, notifAt))} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 4 · Envíaselo a ese amigo + Comenta TARJETICA */
const CtaScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const ph = sp(frame, fps, s(S.cta.from + 0.05), 16, 100);
  const miraAt = s(wordTime("k1", "papel") - 0.1);
  const ctaAt = s(V.k2.at - 0.05);
  const word = sp(frame, fps, s(wordTime("k2", "tarjetica") - 0.1), 11, 170);
  const out = ease(frame, ctaAt, 12, EASE_INOUT);
  const bob = Math.sin(t * 5) * 8;
  return (
    <Scene id="cta">
      <DarkBg y={1000} />
      <Stage cam={{ pos: [0.3 + Math.sin(t * 0.5) * 0.2, 0.1 + out * 0.2, 5.4 + out * 1.2], target: [0, -0.05 - out * 0.35, 0], fov: 35 }} env={0.8} exposure={1.05}>
        <Phone3D position={[0, -0.1 - (1 - ph) * 3 - out * 0.4, 0]} rotation={[0.04, -0.2 + Math.sin(t * 0.7) * 0.06, 0.02]} scale={1.05 - 0.3 * out} screens={phoneLayers(frame, [["chat-a", 0], ["chat-b", miraAt]])} glow={interpolate(frame, [miraAt, miraAt + 4, miraAt + 18], [0, 1, 0], clamp)} />
        <Tarjetico position={[0.75, -1.05, 0.6]} rotation={[0, -0.4, 0]} scale={0.9} t={t} happy={1} type={0} blink={blinkAt(t, 1)} act={pulse(t, wordTime("k2", "tarjetica"), 0.5)} />
      </Stage>
      {out > 0.01 ? (
        <div style={{ position: "absolute", left: 0, width: 960, top: 250, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.white, letterSpacing: "-0.04em", opacity: out }}>
          <div style={{ fontSize: 100 }}>COMENTA</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 22, marginTop: 10, transform: `scale(${word})` }}>
            <span style={{ fontSize: 124, background: C.highlight, color: C.ink, padding: "0.04em 0.18em 0", borderRadius: "0.12em", boxShadow: "0 20px 60px rgba(143,227,192,0.4)" }}>TARJETICA</span>
            <span style={{ fontSize: 96, color: C.highlight, transform: `translateY(${bob}px)`, display: "inline-block" }}>↓</span>
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.01em", marginTop: 26, color: C.soft }}>y crea la tuya gratis</div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, width: 960, top: 1600, display: "flex", justifyContent: "center", opacity: ease(frame, ctaAt + 16, 12) }}>
        <Logo height={80} color={C.white} />
      </div>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Titulares, cortes, grano y audio */
const SCENE_OF = (id: string): SceneId => (id.startsWith("h") ? "intro" : id.startsWith("y") ? "cafe" : id.startsWith("k") ? "cta" : "office");
const Headlines: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = (x: number) => Math.round(x * fps);
  const list: { text: string; at: number; end: number }[] = [];
  for (const v of VOICE) for (const [text, needle] of headlines[v.id] ?? []) list.push({ text, at: Math.max(wordTime(v.id, needle) - 0.05, S[SCENE_OF(v.id)].from + 0.05), end: V[v.id].end + 0.15 });
  return (
    <>
      {list.map((h, i) => {
        const next = list[i + 1];
        const end = Math.min(h.end + 0.6, next ? next.at - 0.08 : DURATION_SEC);
        const len = Math.max(...h.text.split("\n").map((l) => l.replace(/[[\]]/g, "").length));
        return <Headline key={i} text={h.text} at={s(h.at)} exitAt={s(end)} size={len > 17 ? 84 : len > 13 ? 100 : 116} top={262} />;
      })}
    </>
  );
};

const Cuts: React.FC = () => {
  const { frame, s } = useT();
  let o = 0;
  for (const id of ["cafe", "cta"] as SceneId[]) {
    const c = s(S[id].from);
    o = Math.max(o, interpolate(frame, [c - 3, c, c + 4], [0, 0.6, 0], clamp));
  }
  return o > 0 ? <AbsoluteFill style={{ background: "#000", opacity: o }} /> : null;
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundImage: `url(${staticFile("grain.png")})`, backgroundPosition: `${(frame * 137) % 512}px ${(frame * 251) % 512}px`, opacity: 0.06, mixBlendMode: "overlay", pointerEvents: "none" }} />;
};

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
  [V.t1.at - 0.6, "whoosh-soft", 0.3],
  [V.t1.at - 0.25, "ring-pulse", 0.25],
  [V.t2.at, "pop", 0.3],
  ...["w1", "w2", "w3", "w4", "w5", "q1", "q5"].map((id) => [V[id].at - 0.45, "whoosh-soft", 0.16] as [number, string, number]),
  [wordTime("w1", "paga"), "tap", 0.35],
  [wordTime("w1", "sello"), "notification", 0.35],
  [wordTime("w2", "regalo") - 0.1, "pop", 0.35],
  [wordTime("w3", "avisa") - 0.1, "ring-pulse", 0.25],
  [wordTime("w4", "premios"), "pop", 0.25],
  [wordTime("w5", "promo") - 0.1, "whoosh-soft", 0.2],
  [V.q2.at, "pop", 0.3],
  [V.q4.at, "pop", 0.3],
  [V.q6.at, "ring-pulse", 0.3],
  [wordTime("y2", "clientes") - 0.2, "notification", 0.4],
  [wordTime("k1", "papel") - 0.1, "notification", 0.3],
  [wordTime("k2", "tarjetica") - 0.1, "pop", 0.35],
];

export const Oficina: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#030A08" }}>
      <IntroScene />
      <OfficeScene />
      <CafeScene />
      <CtaScene />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 60%, rgba(0,0,0,0.45) 100%)", pointerEvents: "none" }} />
      <Headlines />
      <Karaoke hide={(id) => id === "k2"} />
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
