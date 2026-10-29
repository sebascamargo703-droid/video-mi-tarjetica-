import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, getStaticFiles, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { audio, brand } from "./brand";
import { copy, headlines } from "./copy";
import { font } from "./fonts";
import { Logo } from "./components/Logo";
import { Stage } from "./three/Stage";
import { ShadowFloor } from "./three/Objects";
import { toScreen, type Cam, type V3 } from "./three/camera";
import { Card3D, Counter, Disc3D, Phone3D, Plate, Tablet3D, type Layer } from "./three/Devices";
import { Bubbles, Confetti, Dog3D, Tub } from "./three/Dog";
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
  list.map(([src, at], i) => [`screens/${src}.png`, i === 0 ? 1 : interpolate(frame, [at, at + 5], [0, 1], clamp)] as Layer).filter(([, o], i, arr) => o > 0 && !arr.slice(i + 1).some(([, o2]) => o2 >= 1));
/** Parpadeo natural cada ~3 s. */
const blinkAt = (t: number, seed = 0) => {
  const k = (t + seed) % 3.1;
  return k < 0.12 ? Math.sin((k / 0.12) * Math.PI) : 0;
};
/** Salto: altura y aplastamiento en el segundo `at`. */
const hop = (t: number, at: number, h = 0.35, d = 0.5) => {
  const k = (t - at) / d;
  if (k < -0.15 || k > 1.15) return { y: 0, sq: 0 };
  if (k < 0) return { y: 0, sq: Math.sin(((k + 0.15) / 0.15) * Math.PI) * 0.8 };
  if (k > 1) return { y: 0, sq: Math.sin(((k - 1) / 0.15) * Math.PI) * 0.6 };
  return { y: Math.sin(k * Math.PI) * h, sq: -0.4 * Math.sin(k * Math.PI) };
};

/* ------------------------------------------------------------------ */
/* Piezas comunes */

/** Fondo claro menta (estilo "mascotas"): halo blanco que respira y patitas tenues. */
const LightBg: React.FC<{ tone?: string; y?: number }> = ({ tone = "#CFEBDF", y = 900 }) => {
  const { t } = useT();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1150px at ${CX}px ${y}px, #FBFEFC 0%, #E6F5EE ${45 + Math.sin(t) * 2}%, ${tone} 100%)` }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 60 + ((i * 311) % 900),
            top: ((i * 523 + t * 40) % 2100) - 100,
            fontSize: 60 + (i % 3) * 18,
            opacity: 0.07,
            transform: `rotate(${i * 37}deg)`,
          }}
        >
          🐾
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ id: SceneId; children: React.ReactNode }> = ({ id, children }) => {
  const { frame, s } = useT();
  const a = s(S[id].from);
  const b = s(S[id].to);
  if (frame < a || frame > b + 7) return null;
  const tin = a === 0 ? 1 : ease(frame, a, 7);
  return <AbsoluteFill style={{ opacity: tin, transform: `scale(${1.05 - 0.05 * tin})`, filter: tin < 1 ? `blur(${(1 - tin) * 10}px)` : undefined }}>{children}</AbsoluteFill>;
};

/** Partículas flotantes (menta y blancas). */
const Motes: React.FC<{ n?: number; spread?: V3; seed?: string; center?: V3 }> = ({ n = 24, spread = [6, 6, 4], seed = "m", center = [0, 1, 0] }) => {
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
            <meshBasicMaterial color={i % 3 ? "#69D3BE" : "#FFFFFF"} transparent opacity={0.7} toneMapped={false} />
          </mesh>
        );
      })}
    </>
  );
};

/** Etiqueta 2D anclada a un punto 3D. */
const Label: React.FC<{ p: V3; cam: Cam; children: React.ReactNode; dy?: number; o?: number }> = ({ p, cam, children, dy = 0, o = 1 }) => {
  const q = toScreen(p, cam);
  return <div style={{ position: "absolute", left: q.x, top: q.y + dy, transform: "translate(-50%, 0)", opacity: o, whiteSpace: "nowrap" }}>{children}</div>;
};
const Pill: React.FC<{ text: string; color?: string; fg?: string }> = ({ text, color = C.green, fg = "#fff" }) => (
  <div style={{ fontFamily: font, fontSize: 34, fontWeight: 800, color: fg, background: color, padding: "12px 26px", borderRadius: 999, boxShadow: "0 12px 30px rgba(6,35,27,0.25)" }}>{text}</div>
);

/** Gotas de agua que salen disparadas (sacudida). */
const Droplets: React.FC<{ t: number; at: number; origin: V3 }> = ({ t, at, origin }) => {
  const k = t - at;
  if (k < 0 || k > 1.2) return null;
  return (
    <>
      {Array.from({ length: 26 }).map((_, i) => {
        const a = i * 2.399;
        const v = 1.6 + (i % 5) * 0.4;
        return (
          <mesh key={i} position={[origin[0] + Math.cos(a) * v * k, origin[1] + 1.4 * k - 3 * k * k + Math.sin(i) * 0.1, origin[2] + Math.sin(a) * v * k * 0.5]}>
            <sphereGeometry args={[0.03 + (i % 3) * 0.01, 10, 8]} />
            <meshPhysicalMaterial color="#9FDBF0" roughness={0} clearcoat={1} transparent opacity={0.8 * (1 - k / 1.2)} />
          </mesh>
        );
      })}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 1 · Hook: "Este cliente no habla… pero sí puede volver" */
const HookScene: React.FC = () => {
  const { frame, t } = useT();
  const k = EASE_INOUT(Math.min(1, t / S.hook.to));
  const cam: Cam = { pos: lerp3([0.9, 1.1, 5.4], [0.15, 0.9, 3.9], k), target: [0, 0.72, 0], fov: 35 };
  const habla = wordTime("h1", "habla");
  const volver = wordTime("h1", "volver");
  const j = hop(t, volver - 0.05, 0.3, 0.45);
  const happy = ease(frame, Math.round(volver * 30) - 6, 8);
  return (
    <Scene id="hook">
      <LightBg />
      <Stage cam={cam} env={1} exposure={1.05}>
        <ShadowFloor opacity={0.22} />
        <Dog3D
          position={[0, j.y, 0]}
          t={t}
          tilt={t > habla - 0.2 && t < volver - 0.2 ? 0.28 * ease(frame, Math.round((habla - 0.2) * 30), 8) : 0}
          yaw={Math.sin(t * 0.8) * 0.12}
          happy={happy}
          wag={0.3 + 0.7 * happy}
          squash={j.sq}
          blink={blinkAt(t)}
          bow={1}
        />
        <Motes seed="h" n={18} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 2 · Baño, uñas, moñito… y se va feliz */
const SpaScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const at = (w: string) => s(wordTime("h2", w) - 0.05);
  const bowP = sp(frame, fps, at("moñito"), 9, 180);
  const feliz = wordTime("h2", "feliz");
  const shakeK = t > feliz - 0.3 ? Math.sin((t - feliz) * 40) * Math.max(0, 1 - (t - feliz) * 1.5) * 0.25 : 0;
  const nails = interpolate(frame, [at("uñas"), at("uñas") + 6, at("uñas") + 22], [0, 1, 0], clamp);
  const cam: Cam = { pos: [0.35 + Math.sin(t * 0.5) * 0.2, 1.75, 5.8], target: [0.2, 0.95, 0], fov: 35 };
  return (
    <Scene id="spa">
      <LightBg tone="#CBE9F2" />
      <Stage cam={cam} env={1} exposure={1.05}>
        <ShadowFloor opacity={0.2} />
        <group position={[0.05, 0, 0]} scale={0.85}>
          <Tub foam={1} t={t} />
          <Dog3D position={[0, 0.18, 0.02]} rotation={[0, shakeK, 0]} scale={0.78} t={t} wet={1 - ease(frame, s(feliz - 0.2), 20)} bow={bowP} happy={ease(frame, s(feliz - 0.3), 8)} wag={0.6} blink={blinkAt(t, 1)} tilt={Math.sin(t * 1.3) * 0.08} />
          <Bubbles t={t} n={18} center={[0, 0.6, 0]} spread={1.2} />
          {nails > 0 ? (
            <>
              <Glow position={[-0.09, 0.28, 0.35]} size={0.5 * nails} color="#FFFFFF" opacity={0.9} />
              <Glow position={[0.09, 0.28, 0.35]} size={0.5 * nails} color="#FFFFFF" opacity={0.9} />
            </>
          ) : null}
          <Droplets t={t} at={feliz - 0.25} origin={[0, 1.0, 0]} />
        </group>
        <Card3D
          src={`screens/chk-${frame >= at("moñito") ? 3 : frame >= at("uñas") ? 2 : frame >= at("baño") ? 1 : 0}.png`}
          w={0.92}
          h={1.09}
          depth={0.03}
          back="#FBF8F1"
          position={[0.88, 1.55 + Math.sin(t * 1.5) * 0.04, 0.2]}
          rotation={[0.05, -0.4, 0.06]}
          scale={0.9}
        />
        <Motes seed="s" n={14} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 3 · ¿Y el próximo mes… vuelve contigo o se va a otra peluquería? */
const Facade: React.FC<{ src: string; color: string; door: string; position: V3; rotation: V3; glow?: number }> = ({ src, color, door, position, rotation, glow = 0 }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 1.3, -0.3]} castShadow receiveShadow>
      <boxGeometry args={[2.2, 2.6, 0.6]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
    <mesh position={[-0.42, 0.9, 0.005]}>
      <planeGeometry args={[0.95, 1.0]} />
      <meshStandardMaterial color="#FFF3DA" emissive="#FFD9A0" emissiveIntensity={0.5 + glow} />
    </mesh>
    <mesh position={[0.6, 0.75, 0.005]}>
      <planeGeometry args={[0.62, 1.5]} />
      <meshStandardMaterial color={door} roughness={0.4} />
    </mesh>
    <Plate src={src} w={2.0} h={0.43} position={[0, 2.2, 0.02]} />
    {glow > 0 ? <Glow position={[0, 1.2, 0.4]} size={3 * glow} color="#8FE3C0" opacity={0.5} /> : null}
  </group>
);

const DoubtScene: React.FC = () => {
  const { frame, t, s } = useT();
  const a = S.doubt.from;
  const mes = wordTime("h3", "mes");
  const flip = ease(frame, s(mes - 0.25), 14, EASE_INOUT);
  const calOut = ease(frame, s(wordTime("h3", "vuelve") - 0.1), 12, EASE_IN);
  const otra = wordTime("h3", "otra");
  const walkEnd = a + 1.3;
  const x = t < walkEnd ? lerp(-1.6, -0.1, (t - a) / 1.3) : t < otra ? -0.1 : lerp(-0.1, 0.5, Math.min(1, (t - otra) / 0.9));
  const walking = t < walkEnd || (t > otra && t < otra + 0.9);
  const look = t < walkEnd ? 0 : t < otra - 0.4 ? Math.sin((t - walkEnd) * 2.6) * 0.7 : 0;
  const rot = t < walkEnd ? Math.PI / 2 : t > otra - 0.3 ? 0.9 : 0.15;
  const cal = flip < 0.5 ? "cal-a" : "cal-b";
  const calRot = flip < 0.5 ? flip * Math.PI : (flip - 1) * Math.PI;
  const cam: Cam = { pos: [0.2, 2.3, 11.2], target: [0.1, 1.3, 0], fov: 35 };
  return (
    <Scene id="doubt">
      <LightBg tone="#E8DCEB" y={1000} />
      <Stage cam={cam} env={0.9} exposure={1.05}>
        <ShadowFloor opacity={0.25} />
        <mesh position={[0, 0.005, 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[8, 1.6]} />
          <meshLambertMaterial color="#DCD6CC" />
        </mesh>
        <Facade src="screens/facade-mine.png" color="#CFEFE2" door="#16705D" position={[-1.25, 0, -0.9]} rotation={[0, 0.45, 0]} glow={0.3 * (t < otra ? 1 : 0)} />
        <Facade src="screens/facade-other.png" color="#C9C4CE" door="#5A5F66" position={[1.25, 0, -0.9]} rotation={[0, -0.45, 0]} />
        <Dog3D pose="walk" position={[x, 0, 0.6]} rotation={[0, rot, 0]} walk={walking ? t * 11 : 0} scale={0.8} t={t} yaw={look} wag={walking ? 0.6 : 0.2} blink={blinkAt(t, 2)} />
        {calOut < 1 ? (
          <group position={[0, 2.35 + calOut * 3, 0.8]} rotation={[0, calRot, 0]} scale={1 - 0.3 * calOut}>
            <Card3D src={`screens/${cal}.png`} w={1.0} h={1.09} depth={0.04} back="#FFFFFF" />
          </group>
        ) : null}
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 4 · Tu tarjeta de sellos en el celular de su humano */
const CardScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const ph = sp(frame, fps, s(S.card.from + 0.05), 16, 90);
  const cel = s(wordTime("s1", "celular") - 0.1);
  const flash = interpolate(frame, [cel, cel + 3, cel + 16], [0, 1, 0], clamp);
  return (
    <Scene id="card">
      <LightBg />
      <Stage cam={{ pos: [0.35 + Math.sin(t * 0.4) * 0.2, 1.0, 5.8], target: [0.1, 0.9, 0], fov: 35 }} env={1} exposure={1.08}>
        <ShadowFloor opacity={0.22} />
        <Phone3D
          position={[-0.2, 1.05 - (1 - ph) * 3, 0]}
          rotation={[0.04, -0.25 + (1 - ph) * 2.4 + Math.sin(t * 0.8) * 0.05, 0.02]}
          scale={0.88}
          screens={layers(frame, [["w-s0", 0], ["w-s3", cel]])}
          brightness={1 + 0.3 * flash}
          glow={flash}
        />
        <Dog3D position={[0.68, 0, 0.6]} rotation={[0, -0.45, 0]} scale={0.66} t={t} yaw={-0.35} tilt={0.18 + Math.sin(t * 1.2) * 0.05} happy={ease(frame, cel, 8)} wag={0.9} blink={blinkAt(t, 0.5)} />
        <Motes seed="c" />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 5 · Escanea el QR, sin descargar app */
const ScanScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const a = s(S.scan.from);
  const inn = sp(frame, fps, a, 16, 110);
  const addAt = s(wordTime("s2", "sin") - 0.1);
  const scanned = frame >= addAt;
  const cam: Cam = { pos: [0.4 + Math.sin(t * 0.35) * 0.25, 2.0, 7.4], target: [0.05, 0.9, 0], fov: 35 };
  return (
    <Scene id="scan">
      <LightBg />
      <Stage cam={cam} env={1} exposure={1.05}>
        <Counter position={[0, 0, 0]} top="#FBF8F1" body="#A9D9C7" />
        <group position={[-0.62, 0.78, -0.15]} rotation={[-0.12, 0.38, 0]}>
          <Card3D src="screens/sign.png" w={0.98} h={1.53} depth={0.05} back={C.cream} />
          {!scanned ? (
            <mesh position={[0, -0.32 + (Math.sin((frame - a) / 5) * 0.5 + 0.5) * 0.62, 0.05]} renderOrder={10}>
              <planeGeometry args={[0.62, 0.012]} />
              <meshBasicMaterial color="#16705D" toneMapped={false} transparent opacity={0.95} />
            </mesh>
          ) : null}
        </group>
        <Phone3D position={[0.72, 0.95 - (1 - inn) * 2.5, 0.85]} rotation={[-0.05, -0.55 + 0.1 * Math.sin(t * 0.7), 0.06]} scale={0.78} screens={layers(frame, [["cam", 0], ["add", addAt]])} glow={scanned ? 0.4 : 0} />
        <Dog3D position={[0.1, 0, 0.75]} scale={0.55} t={t} yaw={0.4} tilt={-0.15} wag={0.8} happy={scanned ? 1 : 0} blink={blinkAt(t, 1.5)} />
        <Motes seed="q" n={14} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 6 · Tu logo, tus colores y patitas como sellos */
const CustomScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const a = s(S.custom.from);
  const inn = sp(frame, fps, a, 14, 110);
  const c1 = s(wordTime("s3", "colores") - 0.15);
  const pat = wordTime("s3", "patitas");
  const c2 = s(pat - 0.1);
  const spin = interpolate(frame, [c1 - 6, c1 + 6], [0, Math.PI * 2], { ...clamp, easing: EASE_INOUT }) + interpolate(frame, [c2 - 6, c2 + 6], [0, Math.PI * 2], { ...clamp, easing: EASE_INOUT });
  const theme = frame >= c2 ? 2 : frame >= c1 ? 1 : 0;
  return (
    <Scene id="custom">
      <LightBg tone="#F4D9E1" />
      <Stage cam={{ pos: [Math.sin(t * 0.5) * 0.5, 1.2, 6.6], target: [0, 1.05, 0], fov: 35 }} env={1.1} exposure={1.08}>
        <ShadowFloor opacity={0.2} />
        <group position={[0, 1.35 + (1 - inn) * -2.5, 0]} rotation={[0.08, spin + Math.sin(t * 0.9) * 0.15, -0.05]}>
          <Card3D src={`screens/theme-${theme}.png`} w={1.6} h={0.982} r={0.1} depth={0.04} back={copy.themes[theme].color} />
        </group>
        {Array.from({ length: 6 }).map((_, i) => {
          const at = pat + 0.1 + i * 0.12;
          const k = Math.min(1, Math.max(0, (t - at) / 0.5));
          if (t < at) return null;
          const p = lerp3([(i - 2.5) * 0.9, 3.2, 1.5], [(i - 2.5) * 0.36, 0.25, 0.8], EASE_INOUT(k));
          return <Disc3D key={i} src="screens/token.png" r={0.14} t={0.04} position={p} rotation={[0.3 * (1 - k), k * 6, 0]} edge={C.cream} metal={false} />;
        })}
        <Confetti t={t} at={pat + 0.3} origin={[0, 1.3, 0.4]} n={30} />
        <Dog3D position={[0.7, 0, 0.9]} rotation={[0, -0.35, 0]} scale={0.5} t={t} yaw={-0.2} happy={t > pat ? 1 : 0} wag={1} blink={blinkAt(t, 0.7)} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 7 · Cada baño o compra, una patita */
const StampScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const a = s(S.stamp.from);
  const payAt = s(wordTime("s4", "baño"));
  const stampAt = s(wordTime("s4", "patita"));
  const tok = interpolate(frame, [payAt + 6, stampAt + 2], [0, 1], { ...clamp, easing: EASE_INOUT });
  const from: V3 = [-0.55, 0.68, 0.1];
  const to: V3 = [0.72, 1.05, 0.55];
  const tp = lerp3(from, to, tok);
  tp[1] += Math.sin(tok * Math.PI) * 0.9;
  const j = hop(t, stampAt / fps + 0.05, 0.25, 0.4);
  return (
    <Scene id="stamp">
      <LightBg />
      <Stage cam={{ pos: [0.1 + Math.sin(t * 0.3) * 0.2, 1.9, 7.4], target: [0, 0.8, 0], fov: 35 }} env={1} exposure={1.05}>
        <Counter position={[0, 0, 0]} top="#FBF8F1" body="#A9D9C7" />
        <Tablet3D position={[-0.82, 0.68, -0.35]} rotation={[-0.22, 0.42, 0]} scale={0.55} screens={layers(frame, [["pos-a", 0], ["pos-b", stampAt]])} />
        <Phone3D
          position={[0.72, 0.92 - (1 - sp(frame, fps, a + 3, 16, 110)) * 2.5, 0.45]}
          rotation={[-0.06, -0.38, 0.02]}
          scale={0.78}
          screens={layers(frame, [["w-s6", 0], ["w-s7-banner", stampAt]])}
          glow={interpolate(frame, [stampAt, stampAt + 4, stampAt + 20], [0, 1, 0], clamp)}
        />
        {tok > 0 && tok < 1 ? <Disc3D src="screens/token.png" r={0.16} t={0.04} position={tp} rotation={[0.3, tok * 9, 0]} edge={C.cream} metal={false} /> : null}
        <Dog3D position={[0.05, 0 + j.y, 1.0]} scale={0.5} squash={j.sq} t={t} yaw={0.35} wag={1} happy={frame >= stampAt ? 1 : 0.3} blink={blinkAt(t, 2.2)} />
        <Motes seed="st" n={14} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 8 · A las ocho patitas… ¡baño gratis! */
const RewardScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const ocho = s(wordTime("s5", "ocho"));
  const gratis = wordTime("s5", "gratis") - 0.1;
  const medal = sp(frame, fps, s(gratis), 10, 150);
  const j1 = hop(t, gratis, 0.45, 0.5);
  const j2 = hop(t, gratis + 0.6, 0.3, 0.4);
  const j = j1.y ? j1 : j2;
  return (
    <Scene id="reward">
      <LightBg tone="#F6E7B8" />
      <Stage cam={{ pos: [0, 1.1, 6.6], target: [0, 1.0, 0], fov: 35 }} env={1.1} exposure={1.08}>
        <ShadowFloor opacity={0.2} />
        <Phone3D position={[-0.45, 1.15, 0]} rotation={[0.03, 0.18 + Math.sin(t * 0.8) * 0.05, -0.03]} scale={0.85} screens={layers(frame, [["w-s7-pulse", 0], ["w-s8", ocho]])} glow={interpolate(frame, [ocho, ocho + 4, ocho + 18], [0, 1, 0], clamp)} />
        {medal > 0 ? (
          <group position={[0.42, 1.05, 0.95]} scale={medal * 1.05} rotation={[0.1, -0.4 + Math.sin(t * 1.6) * 0.4, 0.08]}>
            <Disc3D src="screens/medal.png" r={0.42} t={0.07} />
            <Glow position={[0, 0, -0.1]} size={1.8} color="#E8B84A" opacity={0.45} />
          </group>
        ) : null}
        <Confetti t={t} at={gratis} origin={[0.2, 1.4, 0.5]} n={46} />
        <Dog3D position={[0.62, j.y, 0.4]} rotation={[0, -0.35, 0]} scale={0.55} squash={j.sq} t={t} happy={1} wag={1} tilt={0.12} blink={blinkAt(t, 0.3)} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 9 · Pasa cerca y su celular le avisa */
const NearScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const a = S.near.from;
  const stopAt = wordTime("s6", "avisa") - 0.1;
  const walkT = Math.min(t, stopAt) - a;
  const px = -3.0 + walkT * 1.05;
  const fenceOn = ease(frame, s(wordTime("s6", "cerca") - 0.1), 18);
  const notifAt = s(wordTime("s6", "avisa") - 0.15);
  const n = sp(frame, fps, notifAt, 13, 140);
  const pulse = ((t - a) * 0.7) % 1;
  const flash = interpolate(frame, [notifAt, notifAt + 4, notifAt + 20], [0, 1, 0], clamp);
  const walking = t < stopAt;
  const cam: Cam = { pos: [px * 0.35 + 0.5, 5.0, 15], target: [px * 0.3 + 0.2, 1.3, -0.6], fov: 38 };
  return (
    <Scene id="near">
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFD9B8 0%, #F6C7D3 40%, #CFE7E4 100%)" }} />
      <Stage cam={cam} env={0.8} exposure={1.0}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshLambertMaterial color="#B9C2C6" />
        </mesh>
        <mesh position={[0, 0.06, -0.1]} receiveShadow>
          <boxGeometry args={[40, 0.12, 2.6]} />
          <meshLambertMaterial color="#E6E1D8" />
        </mesh>
        <group position={[0, 0, -1.6]}>
          <Facade src="screens/facade-mine.png" color="#CFEFE2" door="#16705D" position={[0, 0, 0]} rotation={[0, 0, 0]} glow={0.4 * fenceOn} />
        </group>
        <mesh position={[-3.5, 1.6, -2.2]} castShadow>
          <boxGeometry args={[4.6, 3.2, 1.6]} />
          <meshStandardMaterial color="#F2D7C2" roughness={0.85} />
        </mesh>
        <mesh position={[3.4, 1.4, -2.2]} castShadow>
          <boxGeometry args={[4.4, 2.8, 1.6]} />
          <meshStandardMaterial color="#C9DDF0" roughness={0.85} />
        </mesh>
        <StreetLamp position={[-2.2, 0, 1.0]} light={false} />
        <StreetLamp position={[2.6, 0, 1.0]} light={false} />
        <Geofence center={[0.2, 0.06, 0.4]} r={2.4} on={fenceOn} pulse={fenceOn > 0.5 ? pulse : 0} flash={flash} />
        <Person position={[px, 0.12, 0.25]} rot={Math.PI / 2 - 0.1} walk={walking ? walkT * 7 : undefined} shirt="#E0607E" pants="#2A2F3A" seed={5} phone lookDown />
        <Dog3D pose="walk" position={[px + 0.7, 0.12, 0.75]} rotation={[0, Math.PI / 2, 0]} walk={walking ? walkT * 12 : 0} scale={0.55} t={t} wag={walking ? 0.6 : 1} happy={n > 0 ? 1 : 0} yaw={n > 0 ? -0.6 : 0} />
        {n > 0 ? (
          <group position={[px + 0.5, 2.3 + 0.05 * Math.sin(t * 2), 1.4]} rotation={[-0.2, -0.05, 0]} scale={n}>
            <Plate src="screens/notif-near.png" w={3.3} h={1.24} />
          </group>
        ) : null}
        <Glow position={[px + 0.22, 1.2, 0.57]} size={0.5 + 1.2 * flash} color="#8FE3C0" opacity={0.6 + 0.4 * flash} />
      </Stage>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 10 · Peluquerías caninas, veterinarias y tiendas de mascotas */
const NichesScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const words = ["peluquerías", "veterinarias", "tiendas"];
  const cam: Cam = { pos: [Math.sin(t * 0.4) * 0.4, 1.0, 7.6], target: [0, 0.85, 0], fov: 35 };
  return (
    <Scene id="niches">
      <LightBg />
      <Stage cam={cam} env={1.1} exposure={1.08}>
        <ShadowFloor opacity={0.18} />
        {copy.niches.map((n, i) => {
          const p = sp(frame, fps, s(wordTime("s7", words[i]) - 0.1), 13, 120);
          if (p <= 0) return null;
          const y = 1.7 - i * 0.78;
          return (
            <group key={n.label} position={[(i - 1) * 0.28, y - (1 - p) * 2.5, (i - 1) * 0.25]} rotation={[-0.06, (1 - p) * Math.PI + Math.sin(t * 0.8 + i) * 0.12 + (i - 1) * 0.1, (i - 1) * -0.04]}>
              <Card3D src={`screens/niche-${i}.png`} w={1.4} h={0.86} r={0.09} depth={0.03} back={n.color} />
            </group>
          );
        })}
        <Dog3D position={[-0.95, 0, 0.9]} rotation={[0, 0.4, 0]} scale={0.48} t={t} wag={1} happy={1} yaw={0.3} blink={blinkAt(t, 1.1)} />
      </Stage>
      {copy.niches.map((n, i) => {
        const at = s(wordTime("s7", words[i]) - 0.1) + 6;
        return frame >= at ? (
          <Label key={n.label} p={[(i - 1) * 0.28 - 0.2, 1.7 - i * 0.78 + 0.43, (i - 1) * 0.25]} cam={cam} dy={-34} o={ease(frame, at, 8)}>
            <Pill text={n.label} color={n.color} />
          </Label>
        ) : null;
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 11 · Empieza gratis */
const FreeScene: React.FC = () => {
  const { frame, fps, t, s } = useT();
  const a = s(S.free.from);
  const coin = sp(frame, fps, a + 2, 12, 120);
  const at = s(wordTime("f1", "veinte") - 0.3);
  return (
    <Scene id="free">
      <LightBg tone="#C6EBDC" />
      <Stage cam={{ pos: [0, 1.0, 6], target: [0, 1.05, 0], fov: 35 }} env={1.1} exposure={1.1}>
        <ShadowFloor opacity={0.18} />
        <group position={[0, 1.55, 0]} scale={coin} rotation={[0.15, (1 - coin) * 4 + Math.sin(t * 1.4) * 0.5, 0]}>
          <Disc3D src="screens/gratis.png" r={0.55} t={0.1} edge="#69D3BE" metal={false} emissive={0.05} />
        </group>
        <Dog3D position={[0.66, 0, 0.7]} rotation={[0, -0.4, 0]} scale={0.58} t={t} happy={1} wag={1} tilt={0.15} blink={blinkAt(t, 0.4)} />
        <Motes seed="f" n={24} />
      </Stage>
      {copy.free.chips.map((c, i) => {
        const p = sp(frame, fps, at + i * 6, 14, 160);
        return (
          <div key={c} style={{ position: "absolute", left: 0, width: 960, top: 1120 + i * 104, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 30px", borderRadius: 999, background: "#FFFFFF", border: `3px solid ${C.greenMid}`, fontFamily: font, fontSize: 38, fontWeight: 800, color: C.ink, boxShadow: "0 12px 30px rgba(6,35,27,0.15)" }}>
              <span style={{ color: C.greenMid }}>✓</span>
              {c}
            </div>
          </div>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 12 · Comenta TARJETICA */
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
  const j = hop(t, replyAt / fps, 0.3, 0.45);
  return (
    <Scene id="cta">
      <LightBg tone="#BFE6D6" />
      <Stage cam={{ pos: [0.3 + Math.sin(t * 0.5) * 0.25, 1.0, 5.6], target: [0, 0.75, 0], fov: 35 }} env={1} exposure={1.08}>
        <ShadowFloor opacity={0.2} />
        <Phone3D
          position={[-0.25, 0.72 - (1 - ph) * 3, 0]}
          rotation={[0.04, -0.15 + Math.sin(t * 0.7) * 0.06, 0.02]}
          scale={0.95}
          screens={layers(frame, [["cm-0", 0], ["cm-1", typeAt], ["cm-2", sentAt], ["cm-3", replyAt]])}
          glow={interpolate(frame, [replyAt, replyAt + 4, replyAt + 20], [0, 1, 0], clamp)}
        />
        <Dog3D position={[0.62, j.y, 0.7]} rotation={[0, -0.45, 0]} scale={0.52} squash={j.sq} t={t} happy={1} wag={1} tilt={0.18} yaw={-0.3} blink={blinkAt(t, 1.7)} />
      </Stage>
      <div style={{ position: "absolute", left: 0, width: 960, top: 250, textAlign: "center", fontFamily: font, fontWeight: 800, color: C.ink, letterSpacing: "-0.04em" }}>
        <div style={{ fontSize: 100, opacity: Math.min(1, pTop * 1.5), transform: `scale(${1.2 - 0.2 * pTop})` }}>{copy.cta.top}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 22, marginTop: 10, transform: `scale(${pWord})` }}>
          <span style={{ fontSize: 124, background: C.greenMid, color: "#fff", padding: "0.04em 0.18em 0", borderRadius: "0.12em", boxShadow: "0 20px 50px rgba(22,112,93,0.35)" }}>{copy.cta.word}</span>
          <span style={{ fontSize: 96, color: C.greenMid, transform: `translateY(${bob}px)`, display: "inline-block" }}>↓</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 960, top: 1620, display: "flex", justifyContent: "center", opacity: ease(frame, replyAt + 10, 12) }}>
        <Logo height={80} color={C.ink} />
      </div>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Titulares, cortes y grano */
const SCENE_OF: Record<string, SceneId> = { h1: "hook", h2: "spa", h3: "doubt", s1: "card", s2: "scan", s3: "custom", s4: "stamp", s5: "reward", s6: "near", s7: "niches", f1: "free" };
const Headlines: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = (x: number) => Math.round(x * fps);
  const list: { text: string; at: number; scene: SceneId; id: string }[] = [];
  for (const v of VOICE) for (const [text, needle] of headlines[v.id] ?? []) list.push({ text, at: Math.max(wordTime(v.id, needle) - 0.05, S[SCENE_OF[v.id]].from + 0.05), scene: SCENE_OF[v.id], id: v.id });
  return (
    <>
      {list.map((h, i) => {
        const next = list[i + 1];
        const end = next && next.scene === h.scene ? next.at - 0.08 : S[h.scene].to - 0.1;
        const len = Math.max(...h.text.split("\n").map((l) => l.replace(/[[\]]/g, "").length));
        return <Headline key={i} text={h.text} at={s(h.at)} exitAt={s(end)} size={len > 17 ? 84 : len > 13 ? 100 : 116} top={262} light />;
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
    o = Math.max(o, interpolate(frame, [c - 3, c, c + 4], [0, 0.55, 0], clamp));
  }
  return o > 0 ? <AbsoluteFill style={{ background: "#FFFFFF", opacity: o }} /> : null;
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundImage: `url(${staticFile("grain.png")})`, backgroundPosition: `${(frame * 137) % 512}px ${(frame * 251) % 512}px`, opacity: 0.05, mixBlendMode: "overlay", pointerEvents: "none" }} />;
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
  ...(Object.keys(S) as SceneId[]).filter((id) => id !== "hook").map((id) => [S[id].from - 0.45, "whoosh-soft", 0.2] as [number, string, number]),
  [wordTime("h1", "volver") - 0.05, "pop", 0.3],
  [wordTime("h2", "baño"), "pop", 0.22],
  [wordTime("h2", "uñas"), "pop", 0.22],
  [wordTime("h2", "moñito"), "pop", 0.3],
  [V.h2.end, "ring-pulse", 0.22],
  [wordTime("s1", "celular") - 0.1, "notification", 0.3],
  [wordTime("s2", "ninguna"), "tap", 0.3],
  [V.s3.end, "pop", 0.3],
  [wordTime("s4", "patita"), "notification", 0.35],
  [V.s5.end + 0.05, "ring-pulse", 0.3],
  [V.s6.at - 0.4, "ring-pulse", 0.15],
  [wordTime("s6", "avisa") - 0.15, "notification", 0.4],
  [wordTime("s6", "avisa") - 0.1, "haptic", 0.25],
  [wordTime("f1", "veinte") - 0.3, "pop", 0.3],
  [ctaSent, "tap", 0.4],
  [ctaSent + 22 / 30, "notification", 0.4],
];

export const Patitas: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#E6F5EE" }}>
      <HookScene />
      <SpaScene />
      <DoubtScene />
      <CardScene />
      <ScanScene />
      <CustomScene />
      <StampScene />
      <RewardScene />
      <NearScene />
      <NichesScene />
      <FreeScene />
      <CtaScene />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 65%, rgba(6,35,27,0.18) 100%)", pointerEvents: "none" }} />
      <Headlines />
      <Karaoke hide={(id) => id === "k1"} />
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
